#!/usr/bin/env python3
"""Collect the org's open issues into a build-time snapshot for the site.

Generates ``site/.vitepress/issue-data.ts`` (committed, a build input) which
``IssueBoard.vue`` renders on the GitHub Pages site. Refresh:

    python scripts/collect-issues.py

Requires the ``gh`` CLI with a logged-in account (same as refresh-meta.py).

采集口径（2026-10-25 拍板）:
  - 主体只收 open issue：正文截断 500 字、标签、作者、父子关系。
  - open 父下已关闭的子 issue 收无正文的轻量骨架，保证展开树不断枝
    （当日实测全组织 13 条这样的子）；骨架不进统计。
  - closed 的父不收；open 子若挂在 closed 父下，parentAvailable=false，
    前端把它升为顶层显示并附父的 GitHub 链接。
  - 父子键一律 ``owner/repo#number``，跨仓子 issue 从数据结构上天然支持
    （当日组织内暂无跨仓子，出现时自动按同口径补全正文）。

Fail loud: any gh error, manifest problem or parent-cycle aborts the run.
Pure standard library.
"""
import json
import re
import subprocess
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = REPO_ROOT / "org-repos.yml"
OUT_FILE = REPO_ROOT / "site" / ".vitepress" / "issue-data.ts"

EXCERPT_LIMIT = 500          # 正文截断字数（采集时存多少）
SUB_ISSUES_PAGE = 20         # 每个父 issue 最多带出的子 issue 数（cap 见警告）
MAX_TREE_DEPTH = 10          # 前端递归深度上限（防环兜底，与 Vue 组件保持一致）

URL_RE = re.compile(r"github\.com/([\w.-]+)/([\w.-]+)")

QUERY_OPEN_ISSUES = """
query($owner:String!,$name:String!,$after:String){
  repository(owner:$owner,name:$name){
    issues(first:100, after:$after, states:OPEN,
            orderBy:{field:UPDATED_AT,direction:DESC}){
      totalCount
      pageInfo{ hasNextPage endCursor }
      nodes{
        number title url state createdAt updatedAt body
        author{ login avatarUrl(size:64) }
        labels(first:10){ nodes{ name } }
        parent{ number title url repository{ nameWithOwner } }
        subIssues(first:%d){
          totalCount
          nodes{
            number title url state createdAt
            author{ login avatarUrl(size:64) }
            repository{ nameWithOwner }
          }
        }
      }
    }
  }
}
""" % SUB_ISSUES_PAGE

# 跨仓 open 子补全（当前组织没有跨仓子，出现时才触发）。
QUERY_CROSS_CHILD = """
query($owner:String!,$name:String!,$number:Int!){
  repository(owner:$owner,name:$name){
    issue(number:$number){
      number title url state createdAt updatedAt body
      author{ login avatarUrl(size:64) }
      labels(first:10){ nodes{ name } }
      parent{ number title url repository{ nameWithOwner } }
      subIssues(first:%d){
        totalCount
        nodes{
          number title url state createdAt
          author{ login avatarUrl(size:64) }
          repository{ nameWithOwner }
        }
      }
    }
  }
}
""" % SUB_ISSUES_PAGE


def gh_graphql(query: str, **params: str):
    """Run one gh api graphql call; raise (fail loud) on any error."""
    args = ["gh", "api", "graphql", "-f", f"query={query}"]
    for key, value in params.items():
        if value in ("", None):
            continue  # 首页不带 after；与 refresh-meta.py 的条件传参一致
        args += ["-F", f"{key}={value}"]
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"gh failed: {query.splitlines()[0]}\n{r.stderr.strip()}")
    payload = json.loads(r.stdout)
    # GraphQL 降级成 200 + errors 字段的情况也要拦住。
    if payload.get("errors"):
        raise RuntimeError(f"graphql errors: {json.dumps(payload['errors'], ensure_ascii=False)[:500]}")
    return payload["data"]


def load_manifest() -> list[tuple[str, str]]:
    text = MANIFEST.read_text(encoding="utf-8")
    if "repos:" not in text:
        sys.exit(f"error: {MANIFEST.name} has no top-level 'repos:' key")
    repos = [(m.group(1), m.group(2)) for m in URL_RE.finditer(text)]
    if not repos:
        sys.exit(f"error: no github.com URLs found in {MANIFEST.name}")
    return repos


IMG_MD_RE = re.compile(r'!\[[^\]]*\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)')
IMG_HTML_RE = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I)
# 整段剔除用：img 全标签 + 常见 HTML 标签（白名单制，避免误删 C++ 泛型尖括号如 <int>）
IMG_TAG_RE = re.compile(r'<img\b[^>]*>', re.I)
HTML_TAG_RE = re.compile(
    r'</?(?:br|hr|p|div|span|details|summary|sub|sup|b|i|em|strong|u|s|code|pre'
    r'|table|thead|tbody|tr|td|th|ul|ol|li|a|blockquote|kbd|h[1-6]|video|source)'
    r'(?:\s[^>]*)?/?>', re.I)
BLOB_RE = re.compile(r"^https://github\.com/([\w.-]+)/([\w.-]+)/blob/([^/]+)/(.+)$")


def resolve_image(url: str, here: str) -> str:
    """把正文里的图片地址换成浏览器可直接加载的 URL。

    here 是 "owner/repo"，用于仓库相对路径。三种形态：
    user-attachments / 绝对 http(s) 原样；github blob 页链接转 raw；
    仓库相对路径拼 raw 的 HEAD。
    """
    url = url.strip()
    m = BLOB_RE.match(url)
    if m:
        return f"https://raw.githubusercontent.com/{m.group(1)}/{m.group(2)}/{m.group(3)}/{m.group(4)}"
    if url.startswith(("http://", "https://", "data:")):
        return url
    path = re.sub(r"^\./", "", url.lstrip("/"))
    return f"https://raw.githubusercontent.com/{here}/HEAD/{path}"


def make_excerpt(body, here: str) -> tuple[str, str | None]:
    """清洗正文 -> (前 EXCERPT_LIMIT 字文字, 首图可加载 URL 或 None)。

    图片记号从文字里剔除，首图单独返回给前端亮在摘要上方。"""
    if not body:
        return "", None
    first_image = None
    for url in IMG_MD_RE.findall(body) + IMG_HTML_RE.findall(body):
        if first_image is None:
            first_image = resolve_image(url, here)
    t = IMG_MD_RE.sub("", body)
    t = IMG_TAG_RE.sub("", t)      # <img ... /> 整段剔除，不留 "/>" 尾巴
    t = HTML_TAG_RE.sub("", t)     # 其余常见 HTML 标签整段剔除
    t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)
    t = t.replace("`", "")
    t = re.sub(r"^#{1,6}\s*", "", t, flags=re.M)  # 行首 markdown 标题记号
    t = re.sub(r"\r\n?", "\n", t)
    t = re.sub(r"\n{3,}", "\n\n", t).strip()
    return t[:EXCERPT_LIMIT], first_image


def author_fields(node) -> tuple:
    a = node.get("author") or {}
    return a.get("login"), a.get("avatarUrl")


def record_from_open(node, owner: str, name: str) -> dict:
    """open issue -> 完整记录。"""
    author, avatar = author_fields(node)
    parent = node.get("parent")
    sub = node["subIssues"]
    excerpt, first_image = make_excerpt(node.get("body"), f"{owner}/{name}")
    return {
        "key": None,  # 组装期填
        "repo": name,
        "number": node["number"],
        "title": node["title"],
        "state": "OPEN",
        "skeleton": False,
        "excerpt": excerpt,
        "excerptImage": first_image,
        "author": author,
        "avatarUrl": avatar,
        "createdAt": node["createdAt"],
        "updatedAt": node["updatedAt"],
        "labels": [l["name"] for l in node["labels"]["nodes"]],
        "url": node["url"],
        "parentKey": None,
        "parentAvailable": None,   # 后处理
        "parentHint": ({"title": parent["title"], "url": parent["url"]} if parent else None),
        "childTotal": sub["totalCount"],
        "openChildren": None,      # 后处理
        "closedChildren": None,    # 后处理
        "_subNodes": sub["nodes"],  # 后处理用完即删
    }


def record_from_skeleton(node, repo: str, with_owner: str) -> dict:
    """closed 子 issue -> 轻量骨架（无正文、无标签、不进统计）。"""
    author, avatar = author_fields(node)
    return {
        "key": f"{with_owner}#{node['number']}",
        "repo": repo,
        "number": node["number"],
        "title": node["title"],
        "state": node["state"],
        "skeleton": True,
        "excerpt": "",
        "excerptImage": None,
        "author": author,
        "avatarUrl": avatar,
        "createdAt": node["createdAt"],
        "updatedAt": node["createdAt"],
        "labels": [],
        "url": node["url"],
        "parentKey": None,
        "parentAvailable": None,
        "parentHint": None,
        "childTotal": 0,
        "openChildren": None,
        "closedChildren": None,
        "_subNodes": [],
    }


def collect() -> dict:
    repos = load_manifest()
    records: dict[str, dict] = {}
    cross_open_children: list[tuple[str, str, int]] = []  # (owner, name, number) 待补全
    warnings: list[str] = []

    for owner, name in repos:
        after = None
        repo_open = 0
        while True:
            data = gh_graphql(
                QUERY_OPEN_ISSUES, owner=owner, name=name,
                after=(after or ""),  # gh -F 空串即不传
            )
            issues = data["repository"]["issues"]
            for node in issues["nodes"]:
                rec = record_from_open(node, owner, name)
                rec["key"] = f"{owner}/{name}#{node['number']}"
                if node.get("parent"):
                    p = node["parent"]
                    rec["parentKey"] = (f"{p['repository']['nameWithOwner']}#{p['number']}")
                records[rec["key"]] = rec
                repo_open += 1

                here = f"{owner}/{name}"
                sub = node["subIssues"]
                if sub["totalCount"] > SUB_ISSUES_PAGE:
                    warnings.append(
                        f"{rec['key']}: 子 issue {sub['totalCount']} 个，超出单页 {SUB_ISSUES_PAGE}，"
                        f"其余 {sub['totalCount'] - len(sub['nodes'])} 个未收录（前端会给出 GitHub 链接）")
                for child in sub["nodes"]:
                    child_owner_repo = child["repository"]["nameWithOwner"]
                    child_key = f"{child_owner_repo}#{child['number']}"
                    if child["state"] == "OPEN":
                        if child_owner_repo != here and child_key not in records:
                            cross_open_children.append(
                                (child_owner_repo.split("/")[0],
                                 child_owner_repo.split("/")[1],
                                 child["number"]))
                        # 本仓 open 子已由本仓分页覆盖，跳过。
                    elif child_key not in records:
                        skel = record_from_skeleton(child, child_owner_repo.split("/")[1], child_owner_repo)
                        skel["parentKey"] = rec["key"]
                        records[child_key] = skel
            if not issues["pageInfo"]["hasNextPage"]:
                break
            after = issues["pageInfo"]["endCursor"]
        if repo_open:
            print(f"[ok] {owner}/{name}: {repo_open} open")

    # 跨仓 open 子补全（罕见路径，出现时保证正文/标签齐全）。
    for cowner, cname, cnumber in cross_open_children:
        data = gh_graphql(QUERY_CROSS_CHILD, owner=cowner, name=cname, number=cnumber)
        node = data["repository"]["issue"]
        rec = record_from_open(node, cowner, cname)
        rec["key"] = f"{cowner}/{cname}#{node['number']}"
        if node.get("parent"):
            p = node["parent"]
            rec["parentKey"] = f"{p['repository']['nameWithOwner']}#{p['number']}"
        records[rec["key"]] = rec
        print(f"[ok] 跨仓子补全: {rec['key']}")

    finalize(records, warnings)
    return {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "org": repos[0][0],
        "repoCount": len(repos),
        "repos": sorted({r for _, r in repos}),
        "issues": [records[k] for k in sorted(records)],
    }


def finalize(records: dict[str, dict], warnings: list[str]) -> None:
    """父子关系后处理：parentKey 挂接、计数、环检测。"""
    # 跨仓骨架若本身带 parent 信息（不会：骨架的 parent 就是引用它的父），跳过。
    for rec in records.values():
        if rec["_subNodes"]:
            for child in rec["_subNodes"]:
                ckey = f"{child['repository']['nameWithOwner']}#{child['number']}"
                child_rec = records.get(ckey)
                if child_rec and not child_rec["parentKey"]:
                    child_rec["parentKey"] = rec["key"]

    for rec in records.values():
        rec.pop("_subNodes", None)
        rec["parentAvailable"] = bool(rec["parentKey"]) and rec["parentKey"] in records

    open_by_parent = Counter()
    closed_by_parent = Counter()
    for rec in records.values():
        if rec["parentKey"] and rec["parentKey"] in records:
            if rec["skeleton"]:
                closed_by_parent[rec["parentKey"]] += 1
            else:
                open_by_parent[rec["parentKey"]] += 1
    for rec in records.values():
        rec["openChildren"] = open_by_parent.get(rec["key"], 0)
        rec["closedChildren"] = closed_by_parent.get(rec["key"], 0)

    # 环检测：沿 parentKey 链走，超过记录总数即成环，fail loud。
    for rec in records.values():
        seen, cur = set(), rec
        while cur["parentKey"] and cur["parentKey"] in records:
            if cur["key"] in seen or len(seen) > len(records):
                sys.exit(f"error: parent 环: {rec['key']}")
            seen.add(cur["key"])
            cur = records[cur["parentKey"]]

    for w in warnings:
        print(f"[warn] {w}")
    orphans = sum(1 for r in records.values() if r["parentKey"] and not r["parentAvailable"])
    if orphans:
        print(f"[warn] 父不在快照内（closed 父或范围外）的 issue: {orphans} 条，前端升顶层显示")


TS_HEADER = """// 本文件由 scripts/collect-issues.py 生成，请勿手改。
// 数据源：GitHub GraphQL（清单见 org-repos.yml）。口径：只收 open issue，
// 正文截断 {excerpt} 字；open 父下已关闭的子收无正文的轻量骨架（skeleton），
// 保证父子树不断枝。刷新：python scripts/collect-issues.py。
// 前端渲染：site/.vitepress/theme/components/IssueBoard.vue，递归深度上限 {depth}。

export interface IssueRecord {{
  /** 全局键 owner/repo#number */
  key: string
  repo: string
  number: number
  title: string
  state: 'OPEN' | 'CLOSED'
  /** closed 骨架：无正文无标签，只为补全父子树 */
  skeleton: boolean
  /** 正文前 {excerpt} 字（已去 markdown 链接/图片记号），骨架为空串 */
  excerpt: string
  /** 摘要首图的可加载 URL（正文第一张图，已转 raw/直链），无图为 null */
  excerptImage: string | null
  author: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
  labels: string[]
  url: string
  /** 父 issue 全局键，顶层为 null */
  parentKey: string | null
  /** 父是否在本快照内（closed 父不在，前端升顶层显示） */
  parentAvailable: boolean
  /** 父不在快照时的参考信息 */
  parentHint: {{ title: string; url: string }} | null
  /** GitHub 报的子 issue 总数（含未收录部分） */
  childTotal: number
  /** 本快照内 open 子数 */
  openChildren: number
  /** 本快照内 closed 骨架子数 */
  closedChildren: number
}}

export interface IssueSnapshot {{
  generatedAt: string
  org: string
  repoCount: number
  repos: string[]
  issues: IssueRecord[]
}}

export const issueSnapshot: IssueSnapshot = """.format(excerpt=EXCERPT_LIMIT, depth=MAX_TREE_DEPTH)


def main() -> None:
    snapshot = collect()
    body = json.dumps(snapshot, ensure_ascii=False, indent=2)
    OUT_FILE.write_text(TS_HEADER + body + "\n", encoding="utf-8")
    open_total = sum(1 for i in snapshot["issues"] if not i["skeleton"])
    skeleton_total = sum(1 for i in snapshot["issues"] if i["skeleton"])
    linked = sum(1 for i in snapshot["issues"] if i["parentKey"] and i["parentAvailable"])
    print(f"\n[done] open {open_total} 条 + closed 骨架 {skeleton_total} 条, "
          f"父子挂接 {linked} 对 -> {OUT_FILE.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
