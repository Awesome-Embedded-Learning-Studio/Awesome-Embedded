#!/usr/bin/env python3
"""Sync the tracked-repo manifest into the orgorg submodule.

Reads the single source of truth — ``org-repos.yml`` at the repo root — and
writes it verbatim into ``third_party/orgorg/.orgorg/repos.yml`` (the path
orgorg's ``src/state.py`` resolves via ``_project_root()/.orgorg/repos.yml``).
Keeps ``org-repos.yml`` as the only hand-edited manifest; orgorg's copy is
always derived from it (it cannot be tracked inside the submodule, since the
upstream ``.gitignore`` excludes it).

Idempotent: if the destination already matches the source byte-for-byte it is
left untouched. Fails loud on any problem. Pure standard library — runs on the
system Python exactly like ``refresh-meta.py``.

Usage:
    python scripts/sync-orgorg-repos.py
"""
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE = REPO_ROOT / "org-repos.yml"
DEST = REPO_ROOT / "third_party" / "orgorg" / ".orgorg" / "repos.yml"

# Matches the owner/repo tail of a GitHub URL in a ``- url:`` entry.
URL_RE = re.compile(r"github\.com/[\w.-]+/[\w.-]+")


def main() -> None:
    if not SOURCE.exists():
        sys.exit(f"error: source manifest not found: {SOURCE}")
    text = SOURCE.read_text(encoding="utf-8")

    if "repos:" not in text:
        sys.exit(f"error: {SOURCE.name} has no top-level 'repos:' key")
    urls = URL_RE.findall(text)
    if not urls:
        sys.exit(f"error: no github.com URLs found in {SOURCE.name} — "
                 f"is the manifest empty or broken?")

    if not DEST.parent.exists():
        sys.exit(f"error: destination dir missing — submodule not init'd? "
                 f"{DEST.parent}")

    if DEST.exists() and DEST.read_text(encoding="utf-8") == text:
        print(f"[ok] {len(urls)} repos — "
              f"{DEST.relative_to(REPO_ROOT)} already in sync")
        return

    DEST.write_text(text, encoding="utf-8")
    print(f"[done] synced {len(urls)} repos -> "
          f"{DEST.relative_to(REPO_ROOT)}")
    print(f"       source of truth: {SOURCE.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
