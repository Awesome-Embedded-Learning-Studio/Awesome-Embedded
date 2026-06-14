#!/usr/bin/env python3
"""Diff two org snapshots into a raw weekly-report markdown (stage ①, private).

Reads the latest content/meta/<YYYY-MM-DD>.json and the snapshot closest to
N days before it (default 7), then writes a structured diff to
content/meta/weekly-raw-<current>.md. That file is gitignored (content/ is
ignored) and is the input to the refinement prompt that turns it into the
public weekly narrative.

If the latest snapshot is older than one day, refreshes it first (unless
--no-refresh). Emits a warning when the two snapshots are <4 or >10 days apart.

Usage:
    scripts/weekly-report.py                 # refresh-if-stale, diff vs ~7d ago
    scripts/weekly-report.py --no-refresh    # use latest snapshot as-is
    scripts/weekly-report.py --days 14       # look back 14 days
    scripts/weekly-report.py --out PATH      # override output path
"""
import argparse
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
META_DIR = REPO_ROOT / "content" / "meta"
REFRESH_SCRIPT = REPO_ROOT / "scripts" / "refresh-meta.py"

ACTIVE_DAYS = 30
STALE_DAYS = 180
MIN_INTERVAL = 4
MAX_INTERVAL = 10


def parse_commit_date(s):
    if not s:
        return None
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00")).date()


def snapshots():
    return sorted(
        META_DIR.glob("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].json"))


def latest_snapshot():
    snaps = snapshots()
    return snaps[-1] if snaps else None


def maybe_refresh(no_refresh):
    snap = latest_snapshot()
    if no_refresh or snap is None:
        return snap
    scan_date = dt.date.fromisoformat(snap.stem)
    if (dt.date.today() - scan_date).days < 1:
        return snap
    print(f"[refresh] snapshot {snap.stem} is stale, refreshing via gh ...",
          file=sys.stderr)
    r = subprocess.run([sys.executable, str(REFRESH_SCRIPT)])
    if r.returncode != 0:
        print("[refresh] failed, falling back to latest snapshot",
              file=sys.stderr)
    return latest_snapshot()


def bucket(repo, today):
    d = parse_commit_date(repo.get("last_commit_date"))
    if d is None:
        return "stale"
    days = (today - d).days
    if days <= ACTIVE_DAYS:
        return "active"
    if days <= STALE_DAYS:
        return "maintaining"
    return "stale"


def pick_previous(current_date, want_days):
    """Snapshot strictly older than current, closest to (current - want_days)."""
    target = current_date - dt.timedelta(days=want_days)
    older = [s for s in snapshots() if dt.date.fromisoformat(s.stem) < current_date]
    if not older:
        return None
    return min(older, key=lambda s: abs(dt.date.fromisoformat(s.stem) - target))


def fmt_delta(n):
    return f"+{n}" if n > 0 else str(n)


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--no-refresh", action="store_true",
                    help="use latest snapshot without refreshing")
    ap.add_argument("--days", type=int, default=7,
                    help="look-back window in days (default 7)")
    ap.add_argument("--out", type=Path, default=None,
                    help="output path (default content/meta/weekly-raw-<date>.md)")
    args = ap.parse_args()

    curr_path = maybe_refresh(args.no_refresh)
    if curr_path is None:
        sys.exit("error: no snapshot found. Run scripts/refresh-meta.py first.")

    curr_date = dt.date.fromisoformat(curr_path.stem)
    prev_path = pick_previous(curr_date, args.days)
    if prev_path is None:
        sys.exit(f"error: no older snapshot than {curr_date} to diff against. "
                 f"Run the pipeline another week, or set --days smaller.")

    curr = json.loads(curr_path.read_text(encoding="utf-8"))
    prev = json.loads(prev_path.read_text(encoding="utf-8"))
    prev_date = dt.date.fromisoformat(prev_path.stem)
    interval = (curr_date - prev_date).days
    interval_note = "正常" if MIN_INTERVAL <= interval <= MAX_INTERVAL \
        else f"⚠ 区间偏{'大' if interval > MAX_INTERVAL else '小'}"

    curr_repos = {r["name"]: r for r in curr["repos"]}
    prev_repos = {r["name"]: r for r in prev["repos"]}

    lines = []
    w = lines.append
    w(f"# 原始周报 diff: {prev_date} → {curr_date}")
    w("")
    w(f"> 自动生成（stage ①），**不公开**。区间 {interval} 天（{interval_note}）。")
    w(f"> 由 `scripts/weekly-report.py` 产出，供 refine prompt 加工。")
    w("")

    # --- totals ---
    cs, ps = curr["summary"], prev["summary"]
    w("## 总量变化")
    w("")
    w("| 指标 | 上期 | 本期 | Δ |")
    w("|---|---|---|---|")
    for label, key in [("仓库", "total_repos"), ("公开仓库", "public_repos"),
                        ("⭐ Stars", "total_stars"), ("🍴 Forks", "total_forks"),
                        ("有 release", "repos_with_releases"),
                        ("有未关闭 issue", "repos_with_issues"),
                        ("缺 LICENSE", "repos_without_license")]:
        a, b = ps.get(key, 0), cs.get(key, 0)
        w(f"| {label} | {a} | {b} | {fmt_delta(b - a)} |")
    w("")

    # --- stars delta ---
    deltas = []
    for name, cr in curr_repos.items():
        pr = prev_repos.get(name)
        if pr is None:
            continue
        d = cr["stars"] - pr["stars"]
        if d != 0:
            deltas.append((name, pr["stars"], cr["stars"], d))
    deltas.sort(key=lambda x: x[3], reverse=True)
    if deltas:
        w("## Stars 变化（Δ≠0，按 Δ 降序）")
        w("")
        w("| 仓库 | 上期 | 本期 | Δ |")
        w("|---|---|---|---|")
        for name, a, b, d in deltas:
            w(f"| {name} | {a} | {b} | {fmt_delta(d)} |")
        w("")
    else:
        w("## Stars 变化\n\n本周无 stars 变化。\n")

    # --- new / removed repos ---
    new_repos = [n for n in curr_repos if n not in prev_repos]
    gone_repos = [n for n in prev_repos if n not in curr_repos]
    if new_repos:
        w("## 新增仓库")
        w("")
        for n in new_repos:
            r = curr_repos[n]
            desc = (r.get("description") or "").strip()
            w(f"- **{n}** — {desc}（⭐{r['stars']}，{r.get('primary_language') or '—'}）")
        w("")
    if gone_repos:
        w("## 消失仓库（删除 / 转移 / 改名）")
        w("")
        for n in gone_repos:
            w(f"- {n}")
        w("")

    # --- activity transitions ---
    transitions = []
    for name, cr in curr_repos.items():
        pr = prev_repos.get(name)
        if pr is None:
            continue
        pb = bucket(pr, prev_date)
        cb = bucket(cr, curr_date)
        if pb != cb:
            transitions.append((name, pb, cb))
    order = {"active": 0, "maintaining": 1, "stale": 2}
    if transitions:
        w("## 活跃度变化")
        w("")
        for name, pb, cb in sorted(transitions, key=lambda t: order[t[1]]):
            arrow = "↗" if order[cb] < order[pb] else "↘"
            w(f"- {arrow} **{name}**：{pb} → {cb}")
        w("")

    # --- current attention items ---
    no_license = [r for r in curr["repos"] if not r["license"]
                  and not r.get("is_archived")]
    open_work = [r for r in curr["repos"] if r["open_issues"] or r["open_prs"]]
    stale = [r for r in curr["repos"]
             if bucket(r, curr_date) == "stale"]
    w("## 本期需要关注（供叙事引用）")
    w("")
    if no_license:
        w(f"- 缺 LICENSE（{len(no_license)}）："
          + ", ".join(r["name"] for r in no_license))
    if open_work:
        w(f"- 未关闭 issue/PR（{len(open_work)}）："
          + ", ".join(f"{r['name']}(i={r['open_issues']},p={r['open_prs']})"
                      for r in open_work))
    if stale:
        w(f"- 停滞待激活/归档（{len(stale)}）："
          + ", ".join(r["name"] for r in stale))
    if not (no_license or open_work or stale):
        w("- （暂无）")
    w("")

    out_path = args.out or (META_DIR / f"weekly-raw-{curr_date}.md")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"[done] {prev_date} → {curr_date}  (区间 {interval} 天, {interval_note})")
    print(f"  wrote {out_path.relative_to(REPO_ROOT)}")
    print(f"  stars Δ={fmt_delta(cs['total_stars']-ps['total_stars'])}  "
          f"repos Δ={fmt_delta(cs['total_repos']-ps['total_repos'])}  "
          f"new={len(new_repos)} gone={len(gone_repos)}")


if __name__ == "__main__":
    main()
