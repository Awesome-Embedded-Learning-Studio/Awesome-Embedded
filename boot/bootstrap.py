#!/usr/bin/env python3
"""Bootstrap an Awesome-Embedded learning workspace.

Clone (first run) or update (subsequent runs) the Awesome-Embedded-Learning-Studio
learning repos into a user-specified destination. ``--dest`` is required and has
no default: this script is meant to be consumable by other repos, so it must not
hardcode ``./repos/``. Repo URLs come from ``org-repos.yml`` at the repo root
(the single source of truth); the ``TRACKS`` constant below encodes which repos
belong to which learning pillar (the docs site's four-pillar roadmap at
``document/roadmap/``).

First run (dest missing or has no ``.git`` subdirs):
    clone the core starter set (CORE_REPOS), then print a mini learning map.
Subsequent run (dest already has ``.git`` subdirs):
    git-fetch + fast-forward every repo under dest (update mode).

Usage:
    python boot/bootstrap.py --dest <path>                    # first run: core starters
    python boot/bootstrap.py --dest <path> --track mcu        # add a pillar
    python boot/bootstrap.py --dest <path>                    # update all
    python boot/bootstrap.py --dest <path> --track all --full # everything, full history
    python boot/bootstrap.py --dest <path> --dry-run          # preview only

Exit codes: 0 ok | 1 usage | 2 git failure | 3 config drift (TRACKS vs org-repos.yml)

Pure standard library — runs on the system Python exactly like refresh-meta.py.
"""
import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST = REPO_ROOT / "org-repos.yml"
# Same plain-regex approach as scripts/sync-orgorg-repos.py:27 — the manifest is
# a flat url list, so no YAML dependency is needed.
URL_RE = re.compile(r"github\.com/[\w.-]+/[\w.-]+")

EXIT_OK, EXIT_USAGE, EXIT_GIT, EXIT_CONFIG = 0, 1, 2, 3

# Core starter set — what a first run (no --track) clones. These are the two
# "核心起步" repos from document/roadmap/01-fundamentals: toolchain prep + C.
CORE_REPOS = ["EmbedBox", "C-Journey"]

# Pillar -> repo short-names. Short-names MUST match the url tail in
# org-repos.yml exactly (case-sensitive: ST-Forge, h618_forge, aex).
# esp-forge is private + unregistered -> not listed; append to TRACKS["mcu"]
# once it goes public and is added to org-repos.yml.
TRACKS = {
    "fundamentals": ["EmbedBox", "C-Journey", "Tutorial_FreeRTOS", "PenguinLab",
                     "Tutorial_AwesomeHardware", "Tutorial_AwesomeQt",
                     "Tutorial_AwesomeModernCPP"],
    "mcu":          ["ST-Forge", "BareMetal-Drivers", "micro-forge"],
    "linux":        ["imx-forge", "rk-forge", "h618_forge", "CFBox", "lightroot",
                     "buildmeter"],
    "specialty":    ["Cinux", "Cinux-Book", "Cinux-Base", "Cinux-GUI", "aex",
                     "bareline"],
}


def die(msg: str, code: int) -> None:
    """Print msg to stderr and exit with code (centralizes fail-loud exits)."""
    print(msg, file=sys.stderr)
    sys.exit(code)


# ── data layer (pure, importable) ────────────────────────────────────────────

def load_manifest(yml_path: Path) -> list[str]:
    """Read org-repos.yml -> list of 'github.com/owner/repo' tails. Fail loud."""
    if not yml_path.exists():
        die(f"error: manifest not found: {yml_path}", EXIT_CONFIG)
    text = yml_path.read_text(encoding="utf-8")
    if "repos:" not in text:
        die(f"error: {yml_path.name} has no top-level 'repos:' key", EXIT_CONFIG)
    urls = URL_RE.findall(text)
    if not urls:
        die(f"error: no github.com URLs found in {yml_path.name}", EXIT_CONFIG)
    return urls


def resolve_url(name: str, manifest: list[str]) -> str:
    """Match a TRACKS short-name against the manifest -> full https URL.

    A name in TRACKS but missing from org-repos.yml is config drift; we fail
    loud so the mismatch gets fixed rather than silently skipped.
    """
    for m in manifest:
        if m.endswith("/" + name):
            return "https://" + m
    die(f"error: '{name}' is in TRACKS but not in org-repos.yml.\n"
        f"       Add it to org-repos.yml or remove it from TRACKS.", EXIT_CONFIG)


def resolve_track(track: str) -> list[str]:
    """Resolve a track name to an ordered, de-duplicated list of short-names.

    'all' flattens every pillar (preserving first-seen order, no duplicates).
    """
    if track == "all":
        seen, out = set(), []
        for names in TRACKS.values():
            for n in names:
                if n not in seen:
                    seen.add(n)
                    out.append(n)
        return out
    if track not in TRACKS:
        die(f"error: unknown track '{track}'. "
            f"Choose from: all, {', '.join(TRACKS)}", EXIT_USAGE)
    return list(TRACKS[track])


# ── mode detection ───────────────────────────────────────────────────────────

def detect_mode(dest: Path) -> str:
    """'first' if dest has no .git subdirs, else 'update'."""
    if not dest.exists():
        return "first"
    if any((p / ".git").exists() for p in dest.iterdir() if p.is_dir()):
        return "update"
    return "first"


# ── git operations (importable) ──────────────────────────────────────────────

def run_git(cmd: list[str], dry: bool = False) -> None:
    """Run a git command; fail loud (EXIT_GIT) on non-zero. Dry-run prints only."""
    if dry:
        print(f"  [dry-run] {' '.join(cmd)}")
        return
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        die(f"error: git failed: {' '.join(cmd)}\n{r.stderr.strip()}", EXIT_GIT)


def clone_one(name: str, url: str, dest: Path, depth: int, dry: bool) -> None:
    """git clone one repo into dest/name. depth=0 means full history."""
    target = dest / name
    cmd = ["git", "clone"]
    if depth > 0:
        cmd += ["--depth", str(depth)]
    cmd += [url, str(target)]
    print(f"[clone] {name}")
    run_git(cmd, dry)


def pull_one(repo_dir: Path, dry: bool) -> None:
    """Fast-forward update of an existing repo (shallow-safe).

    fetch --depth 1 + merge --ff-only FETCH_HEAD. ``git pull`` does not accept
    ``--depth``, so we split it. Local uncommitted changes make the merge fail
    -> we fail loud (the user should ``git stash`` or commit first).
    """
    print(f"[pull] {repo_dir.name}")
    run_git(["git", "-C", str(repo_dir), "fetch", "--depth", "1", "origin"], dry)
    run_git(["git", "-C", str(repo_dir), "merge", "--ff-only", "FETCH_HEAD"], dry)


# ── orchestration ────────────────────────────────────────────────────────────

def apply_names(dest: Path, names: list[str], manifest: list[str],
                depth: int, dry: bool) -> None:
    """For each name: pull if the repo already exists under dest, else clone.

    Used for first run (nothing exists yet -> all clone) and for update with
    --track (existing -> pull, missing -> clone; other pillars untouched).
    URLs are resolved up front so config drift fails before any partial clone.
    """
    urls = [resolve_url(n, manifest) for n in names]  # pre-flight: fail loud early
    for name, url in zip(names, urls):
        target = dest / name
        if (target / ".git").exists():
            pull_one(target, dry)
        else:
            clone_one(name, url, dest, depth, dry)


def pull_all(dest: Path, dry: bool) -> None:
    """Update every git repo under dest, including user-added ones."""
    core = {n for names in TRACKS.values() for n in names}
    repos = sorted(p for p in dest.iterdir()
                   if p.is_dir() and (p / ".git").exists())
    for d in repos:
        pull_one(d, dry)
        if d.name not in core:
            print(f"  [note] {d.name}: not in TRACKS (user-added), updated anyway")


def print_map(dest: Path) -> None:
    """Print a mini learning map pointing at the roadmap and --track commands."""
    d = str(dest)
    print()
    print("────────── Awesome-Embedded 学习地图 ──────────")
    print("下一步看哪里(按方向选一支):")
    print()
    print("  P0 · 基础        EmbedBox(工具链) + C-Journey(C)")
    print("                   → 已克隆,从这里开始")
    print("  P1 · 单片机      ST-Forge(STM32F1) · esp-forge(私有,未公开)")
    print(f"                   → python boot/bootstrap.py --dest {d} --track mcu")
    print("  P2 · 嵌入式Linux imx-forge → rk-forge → h618_forge(横向参考)")
    print(f"                   → python boot/bootstrap.py --dest {d} --track linux")
    print("  专题 · Cinux     Cinux / Cinux-Book / Cinux-Base / Cinux-GUI")
    print(f"                   → python boot/bootstrap.py --dest {d} --track specialty")
    print()
    print("  完整地图:  document/roadmap/")
    print(f"  拉全部支柱: python boot/bootstrap.py --dest {d} --track all")
    print("────────────────────────────────────────────────")


def main() -> None:
    ap = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dest", type=Path,
                    help="destination directory (REQUIRED — no default; this "
                         "script is consumable by other repos)")
    ap.add_argument("--track", choices=["all"] + list(TRACKS.keys()),
                    help="learning pillar to clone (default: core starters on "
                         "first run; on update, restricts to that pillar)")
    ap.add_argument("--depth", type=int, default=1,
                    help="clone depth (default: 1 = shallow; 0 = full history)")
    ap.add_argument("--full", action="store_true",
                    help="equivalent to --depth 0 (full clone history)")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the git commands that would run; execute nothing")
    args = ap.parse_args()

    if args.dest is None:
        die("error: --dest is required (the script is consumable by other "
            "repos, so it has no default destination).", EXIT_USAGE)
    if shutil.which("git") is None:
        die("error: git not found on PATH.", EXIT_USAGE)
    if args.full:
        args.depth = 0

    dest: Path = args.dest
    manifest = load_manifest(MANIFEST)
    mode = detect_mode(dest)

    if mode == "first":
        names = CORE_REPOS if args.track is None else resolve_track(args.track)
        if dest.exists():
            non_git = [p for p in dest.iterdir() if not (p / ".git").exists()]
            if non_git:
                print(f"[warn] {dest} 已有 {len(non_git)} 项非 git 内容,将保留,"
                      f"学习仓会克隆到同目录下")
        if not args.dry_run:
            dest.mkdir(parents=True, exist_ok=True)
        print(f"[first] 首次克隆 {len(names)} 个仓库 → {dest}")
        apply_names(dest, names, manifest, args.depth, args.dry_run)
        print(f"\n[done] 首次克隆完成 → {dest}")
        if not args.dry_run:
            print_map(dest)
    else:
        print(f"[update] 更新 {dest} 下的仓库")
        if args.track is None:
            pull_all(dest, args.dry_run)
        else:
            names = resolve_track(args.track)
            apply_names(dest, names, manifest, args.depth, args.dry_run)
        print(f"\n[done] 更新完成 → {dest}")


if __name__ == "__main__":
    main()
