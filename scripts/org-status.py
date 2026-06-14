#!/usr/bin/env python3
"""Print a one-screen digest of the org's current repo state.

Reads the latest snapshot under content/meta/<YYYY-MM-DD>.json (produced by
refresh-meta.py). If that snapshot is older than one day, refreshes it first
(unless --no-refresh). Output goes to stdout only — nothing is written to disk.

Usage:
    scripts/org-status.py              # refresh-if-stale, then print
    scripts/org-status.py --no-refresh # use latest snapshot as-is (instant)
    scripts/org-status.py --top 10     # show top-10 by stars
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


def parse_commit_date(s):
    if not s:
        return None
    return dt.datetime.fromisoformat(s.replace("Z", "+00:00")).date()


def latest_snapshot():
    snaps = sorted(
        META_DIR.glob("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9].json"))
    return snaps[-1] if snaps else None


def maybe_refresh(no_refresh):
    """Run refresh-meta.py if the latest snapshot is older than one day."""
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


def bar(label, count, repos, limit=12):
    names = ", ".join(r["name"] for r in repos[:limit])
    more = f"  (+{count - limit})" if count > limit else ""
    print(f"  {label}  {count}  {names}{more}")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--no-refresh", action="store_true",
                    help="use latest snapshot without refreshing")
    ap.add_argument("--top", type=int, default=5,
                    help="number of repos to list in Top Stars (default 5)")
    args = ap.parse_args()

    snap_path = maybe_refresh(args.no_refresh)
    if snap_path is None:
        sys.exit("error: no snapshot found. Run scripts/refresh-meta.py first.")

    data = json.loads(snap_path.read_text(encoding="utf-8"))
    repos = data["repos"]
    summary = data["summary"]
    scan_date = data["scan_date"]
    today = dt.date.today()
    age = (today - dt.date.fromisoformat(scan_date)).days
    age_str = "今天" if age == 0 else f"{age} 天前"

    total = summary["total_repos"]
    total_stars = summary["total_stars"]
    total_forks = summary["total_forks"]

    print()
    print("=" * 60)
    print(f"  Awesome-Embedded-Learning-Studio  组织现状")
    print(f"  快照 {scan_date}（{age_str}）   "
          f"仓库 {total}（公开 {summary['public_repos']} / "
          f"私有 {summary['private_repos']}）")
    print(f"  ⭐ {total_stars}   🍴 {total_forks}   "
          f"有 release {summary['repos_with_releases']}   "
          f"有未关闭 issue {summary['repos_with_issues']}")
    print("=" * 60)

    # --- activity buckets ---
    active, maintaining, stale = [], [], []
    for r in repos:
        d = parse_commit_date(r.get("last_commit_date"))
        if d is None:
            stale.append(r)
            continue
        days = (today - d).days
        if days <= ACTIVE_DAYS:
            active.append(r)
        elif days <= STALE_DAYS:
            maintaining.append(r)
        else:
            stale.append(r)
    active.sort(key=lambda r: r["name"].lower())
    maintaining.sort(key=lambda r: r["name"].lower())
    stale.sort(key=lambda r: r["name"].lower())

    print("\n▸ 活跃度（按 last_commit）")
    bar("🟢 活跃 (≤30天)  ", len(active), active)
    bar("🟡 维护中 (30–180)", len(maintaining), maintaining)
    bar("🔴 停滞 (>180天) ", len(stale), stale)

    # --- top stars ---
    top = sorted(repos, key=lambda r: r["stars"], reverse=True)[:args.top]
    print(f"\n▸ Top Stars（前 {args.top}）")
    width = max((len(r["name"]) for r in top), default=8)
    for r in top:
        print(f"  {r['name']:<{width}}  ⭐ {r['stars']}  🍴 {r['forks']}")

    # --- needs attention ---
    no_license = [r for r in repos if not r["license"]
                  and not r.get("is_archived")]
    open_work = [r for r in repos if r["open_issues"] or r["open_prs"]]
    print("\n▸ 需要关注")
    if no_license:
        bar("✗ 缺 LICENSE   ", len(no_license), no_license)
    if open_work:
        names = ", ".join(
            f"{r['name']}(i={r['open_issues']},p={r['open_prs']})"
            for r in open_work[:12])
        more = f"  (+{len(open_work) - 12})" if len(open_work) > 12 else ""
        print(f"  ⚠ 未关闭 issue/PR  {len(open_work)}  {names}{more}")
    if stale:
        bar("⏳ 停滞待激活/归档", len(stale), stale)
    if not (no_license or open_work or stale):
        print("  （暂无需要关注的项）")

    print()
    print(f"详细数据：{snap_path.relative_to(REPO_ROOT)}")
    print(f"完整命令：python scripts/refresh-meta.py  （强制刷新）")
    print()


if __name__ == "__main__":
    main()
