#!/usr/bin/env python3
"""Push an iteration plan file to GitHub as parent-child linked issues.

用法（两步）:

    python scripts/push-iteration-issues.py <plan.md>              # 预演，只打印
    python scripts/push-iteration-issues.py <plan.md> --apply \\
        [--label "iteration/w44"]... [--milestone "2026-W44"]      # 真发

计划文件格式（标题层级即父子）:

    # 迭代 · 2026-W44 · owner/repo     <- 一级标题：迭代声明，仓库从这里读，不建 issue
    ## 父 issue 标题                    <- 二级标题：父 issue
    正文…（到下一个标题为止，原样进 issue 正文）
    ### 子 issue 标题                   <- 三级：上面最近的二级的子，以此类推

写回：每条 issue 建成后，脚本把 ``<!--#编号-->`` 追加到对应标题行末尾并立即
存盘，重跑时带编号的条目跳过，中断续跑不发重。父子用 GitHub 原生 sub-issue
关系挂接（collect-issues.py / IssueBoard 读的就是这个关系）。

Requires the ``gh`` CLI with a logged-in account（同 collect-issues.py）。
Fail loud: any gh error, parse error or structure error aborts the run.
Pure standard library.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

REPO_RE = re.compile(r"([\w.-]+)/([\w.-]+)")
HEADING_RE = re.compile(r"^(#{2,6})\s+(.*?)\s*$")
H1_RE = re.compile(r"^#\s+(.*?)\s*$")
DONE_RE = re.compile(r"<!--\s*#(\d+)\s*-->\s*$")


class PlanIssue:
    def __init__(self, level, title, body, line_no, number, parent):
        self.level = level          # 标题层级（2..6）
        self.title = title          # 去掉写回编号后的标题
        self.body = body            # 标题下正文（到下一个标题为止）
        self.line_no = line_no      # 1-based，写回编号用
        self.number = number        # 已建 issue 编号，None 表示待建
        self.parent = parent        # PlanIssue 或 None
        self.new_id = None          # 创建时 GitHub 返回的 database id


def fail(msg: str) -> None:
    sys.exit(f"error: {msg}")


def gh_api(*args) -> dict | list:
    """Run one gh api call; raise (fail loud) on any error."""
    r = subprocess.run(["gh", "api", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"gh api {' '.join(args[:2])} failed:\n{r.stderr.strip()[:500]}")
    return json.loads(r.stdout) if r.stdout.strip() else {}


def parse_plan(path: Path) -> tuple[str, str, list[PlanIssue], list[str]]:
    """解析计划文件 -> (owner, repo, issues, warnings)。"""
    lines = path.read_text(encoding="utf-8").splitlines()
    owner = repo = None
    issues: list[PlanIssue] = []
    warnings: list[str] = []
    stack: list[PlanIssue] = []      # 栈顶是最近的上级标题
    body_start = None                # 当前正在收集正文的位置

    def close_body(end: int) -> None:
        if issues and body_start is not None:
            issues[-1].body = "\n".join(lines[body_start:end]).strip()

    for i, line in enumerate(lines):
        m1 = H1_RE.match(line)
        m = HEADING_RE.match(line)
        if m1:
            if owner:
                fail(f"第 {i + 1} 行出现第二个一级标题，一个文件只允许一个迭代声明")
            hit = REPO_RE.search(m1.group(1))
            if not hit:
                fail(f"第 {i + 1} 行一级标题里找不到 owner/repo")
            owner, repo = hit.group(1), hit.group(2)
        elif m:
            close_body(i)
            level = len(m.group(1))
            raw_title = m.group(2)
            done = DONE_RE.search(raw_title)
            number = int(done.group(1)) if done else None
            title = raw_title[:done.start()].rstrip() if done else raw_title
            if not title:
                fail(f"第 {i + 1} 行标题为空")
            while stack and stack[-1].level >= level:
                stack.pop()
            if not stack and level > 2:
                warnings.append(f"第 {i + 1} 行 level {level} 标题没有上级，将作为顶层 issue")
            if stack and level > stack[-1].level + 1:
                warnings.append(
                    f"第 {i + 1} 行 level {level} 跳级（上级是 level {stack[-1].level}），按最近上级挂接")
            issue = PlanIssue(level, title, "", i + 1, number, stack[-1] if stack else None)
            issues.append(issue)
            stack.append(issue)
            body_start = i + 1
    close_body(len(lines))

    if not owner:
        fail("缺一级标题（迭代声明行，含 owner/repo）")
    if not issues:
        fail("计划文件里没有任何 issue 标题（## 起的标题）")
    return owner, repo, issues, warnings


def render_tree(issues: list[PlanIssue]) -> str:
    out = []
    for it in issues:
        tag = f"[skip #{it.number}]" if it.number else "[new]"
        out.append("  " * (it.level - 2) + f"{tag} {it.title}")
    return "\n".join(out)


def write_back_number(path: Path, lines: list[str], issue: PlanIssue) -> None:
    """把建好的编号注回标题行末尾并立即存盘（断点续跑不发重的关键）。"""
    idx = issue.line_no - 1
    lines[idx] = lines[idx].rstrip() + f" <!--#{issue.number}-->"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def ensure_milestone(owner_repo: str, title: str) -> int:
    """按标题找 open 里程碑，没有就建，返回里程碑编号。"""
    found = gh_api(f"repos/{owner_repo}/milestones?state=open&per_page=100")
    for ms in found:
        if ms["title"] == title:
            return ms["number"]
    return gh_api("-X", "POST", f"repos/{owner_repo}/milestones",
                  "-f", f"title={title}")["number"]


def create_issue(owner_repo: str, it: PlanIssue, labels: list[str],
                 milestone: int | None) -> dict:
    args = ["repos/{r}/issues".format(r=owner_repo), "-f", f"title={it.title}"]
    if it.body:
        args += ["-f", f"body={it.body}"]
    for lb in labels:
        args += ["-f", f"labels[]={lb}"]
    if milestone:
        args += ["-F", f"milestone={milestone}"]
    return gh_api(*args)


def link_child(owner_repo: str, parent_number: int, child_id: int) -> dict:
    return gh_api("-X", "POST",
                  f"repos/{owner_repo}/issues/{parent_number}/sub_issues",
                  "-F", f"sub_issue_id={child_id}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("plan", type=Path, help="计划文件（markdown）")
    ap.add_argument("--apply", action="store_true",
                    help="真发（默认只预演，不联网）")
    ap.add_argument("--label", action="append", default=[], metavar="NAME",
                    help="issue 标签，可重复")
    ap.add_argument("--milestone", metavar="TITLE",
                    help="迭代里程碑标题，不存在则自动创建")
    args = ap.parse_args()

    if not args.plan.is_file():
        fail(f"找不到计划文件 {args.plan}")
    owner, repo, issues, warnings = parse_plan(args.plan)
    owner_repo = f"{owner}/{repo}"
    for w in warnings:
        print(f"[warn] {w}")

    todo = [it for it in issues if not it.number]
    print(f"[plan] {args.plan.name} -> {owner_repo}")
    print(render_tree(issues))
    print(f"[stat] 共 {len(issues)} 条，待建 {len(todo)}，已建跳过 {len(issues) - len(todo)}")
    if not todo:
        print("[done] 没有待建条目")
        return

    if not args.apply:
        print("[dry-run] 预演结束，未联网未创建。确认无误后加 --apply 真发")
        return

    milestone_no = ensure_milestone(owner_repo, args.milestone) if args.milestone else None
    if milestone_no:
        print(f"[ok] milestone #{milestone_no} {args.milestone}")
    lines = args.plan.read_text(encoding="utf-8").splitlines()
    created = 0
    try:
        for it in issues:
            if it.number:
                continue
            data = create_issue(owner_repo, it, args.label, milestone_no)
            it.number, it.new_id = data["number"], data["id"]
            write_back_number(args.plan, lines, it)
            print(f"[ok] #{it.number} {it.title}")
            created += 1
            if it.parent:
                # 父标题在文档里必在子之前，走到这里父的编号已就绪。
                link_child(owner_repo, it.parent.number, it.new_id)
                print(f"[ok]   └ 挂到父 #{it.parent.number} {it.parent.title}")
    except RuntimeError as e:
        fail(f"建到第 {created + 1} 条时中断，编号已写回，修好后重跑续发。\n{e}")

    print(f"[done] 新建 {created} 条。可以跑 python scripts/collect-issues.py 刷新看板")


if __name__ == "__main__":
    main()
