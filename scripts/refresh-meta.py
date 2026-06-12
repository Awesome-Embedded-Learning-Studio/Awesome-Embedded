#!/usr/bin/env python3
"""Refresh the org metadata snapshot under content/meta/.

Produces a JSON snapshot named content/meta/<YYYY-MM-DD>.json that records the
current state of every repository in the Awesome-Embedded-Learning-Studio org.
The file is gitignored (content/ is ignored) and serves as a dated point-in-time
record of repos / stars / forks / languages etc. for the docs site.

The output schema matches the existing snapshots (e.g. content/meta/2026-05-25.json):

    {
      "scan_date":   "YYYY-MM-DD",
      "scan_tool":   "gh cli",
      "organization": { ...rest /orgs fields, see ORG_KEYS },
      "repos": [ { one object per repo, see REPO assembly }, ... ],
      "summary":     { total_repos, public/private, stars/forks, ... }
    }

Data sources (all via the `gh` CLI, which handles auth):
  - organization object -> REST  /orgs/{org}
  - per-repo fields     -> GraphQL organization.repositories
  - contributors_count  -> REST  /repos/{org}/{repo}/contributors  (one call each)

Usage:
    scripts/refresh-meta.py                  # org + output dir use defaults
    scripts/refresh-meta.py --org FOO        # override org
    scripts/refresh-meta.py --out-dir path   # override output directory
"""
import argparse
import datetime
import json
import shutil
import subprocess
import sys
from collections import Counter
from pathlib import Path

DEFAULT_ORG = "Awesome-Embedded-Learning-Studio"
REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT_DIR = REPO_ROOT / "content" / "meta"

# Fields kept from the REST /orgs response (matches existing snapshots).
ORG_KEYS = [
    "blog", "created_at", "default_repository_permission", "description",
    "followers", "following", "login", "members_can_create_repositories",
    "name", "public_repos", "total_private_repos", "twitter_username",
    "two_factor_requirement_enabled", "updated_at",
]

# GraphQL query: one page of 100 (org is well under that), pagination handled
# for safety. Field names mirror the snapshot's per-repo object.
QUERY = """
query($login: String!, $after: String) {
  organization(login: $login) {
    repositories(first: 100, after: $after, orderBy: {field: NAME, direction: ASC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name url description homepageUrl
        stargazerCount forkCount
        primaryLanguage { name }
        repositoryTopics(first: 50) { nodes { topic { name } } }
        licenseInfo { key }
        isArchived isPrivate isFork
        hasWikiEnabled hasIssuesEnabled hasProjectsEnabled
        diskUsage
        watchers { totalCount }
        defaultBranchRef { name target { ... on Commit { history(first: 1) { nodes { committedDate } } } } }
        createdAt updatedAt
        issues(states: OPEN) { totalCount }
        pullRequests(states: OPEN) { totalCount }
        latestRelease { publishedAt }
        releases { totalCount }
      }
    }
  }
}
"""


def gh_json(args):
    """Run `gh` and return parsed JSON; raise on non-zero exit."""
    r = subprocess.run(["gh"] + args, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"gh failed: {' '.join(args)}\n{r.stderr.strip()}")
    return json.loads(r.stdout) if r.stdout.strip() else None


def gh_json_or_none(args):
    """Like gh_json but returns None on failure (e.g. empty repo 404s)."""
    try:
        return gh_json(args)
    except RuntimeError:
        return None


def fetch_organization(org):
    org_raw = gh_json(["api", f"/orgs/{org}"])
    return {k: org_raw.get(k) for k in ORG_KEYS}


def fetch_repos(org):
    after = None
    nodes = []
    while True:
        args = ["api", "graphql", "-f", f"query={QUERY}", "-F", f"login={org}"]
        if after:
            args += ["-F", f"after={after}"]
        repo = gh_json(args)["data"]["organization"]["repositories"]
        nodes += repo["nodes"]
        if not repo["pageInfo"]["hasNextPage"]:
            break
        after = repo["pageInfo"]["endCursor"]
    print(f"[graphql] fetched {len(nodes)} repos from {org}")
    return nodes


def contributors_count(org, name):
    # REST contributors list: empty repos 404 -> 0. List is capped server-side;
    # 100 per page covers every repo here. Flag if we hit the cap (truncated).
    contribs = gh_json_or_none(
        ["api", f"/repos/{org}/{name}/contributors?per_page=100&anon=1"])
    cc = len(contribs) if isinstance(contribs, list) else 0
    if cc == 100:
        print(f"  [warn] {name}: contributors count may be truncated at 100")
    return cc


def build_repo_object(org, n):
    name = n["name"]
    dbr = n.get("defaultBranchRef")
    last_commit = None
    if dbr and dbr.get("target"):
        hist = dbr["target"].get("history", {}).get("nodes", [])
        if hist:
            last_commit = hist[0].get("committedDate")
    print(f"[contrib] {name}")
    return {
        "name": name,
        "url": n.get("url"),
        "description": n.get("description"),
        "homepage_url": n.get("homepageUrl"),
        "stars": n.get("stargazerCount", 0),
        "forks": n.get("forkCount", 0),
        "primary_language": (n.get("primaryLanguage") or {}).get("name"),
        "topics": [t["topic"]["name"]
                   for t in (n.get("repositoryTopics") or {}).get("nodes", [])],
        "license": (n.get("licenseInfo") or {}).get("key"),
        "is_archived": n.get("isArchived", False),
        "is_private": n.get("isPrivate", False),
        "is_fork": n.get("isFork", False),
        "has_wiki": n.get("hasWikiEnabled", False),
        "has_issues": n.get("hasIssuesEnabled", False),
        "has_projects": n.get("hasProjectsEnabled", False),
        "disk_usage_kb": n.get("diskUsage"),
        "watchers": (n.get("watchers") or {}).get("totalCount", 0),
        "default_branch": (dbr or {}).get("name"),
        "created_at": n.get("createdAt"),
        "updated_at": n.get("updatedAt"),
        "open_issues": (n.get("issues") or {}).get("totalCount", 0),
        "open_prs": (n.get("pullRequests") or {}).get("totalCount", 0),
        "last_commit_date": last_commit,
        "has_release": bool(n.get("latestRelease"))
        or (n.get("releases") or {}).get("totalCount", 0) > 0,
        "contributors_count": contributors_count(org, name),
    }


def build_summary(repos):
    lang_counter = Counter(r["primary_language"]
                           for r in repos if r["primary_language"])
    languages = [l for l, _ in
                 sorted(lang_counter.items(), key=lambda kv: (-kv[1], kv[0]))]
    return {
        "total_repos": len(repos),
        "public_repos": sum(1 for r in repos if not r["is_private"]),
        "private_repos": sum(1 for r in repos if r["is_private"]),
        "total_stars": sum(r["stars"] for r in repos),
        "total_forks": sum(r["forks"] for r in repos),
        "repos_with_issues": sum(1 for r in repos if r["open_issues"] > 0),
        "repos_with_releases": sum(1 for r in repos if r["has_release"]),
        "repos_with_license": sum(1 for r in repos if r["license"]),
        "repos_without_license": sum(1 for r in repos if not r["license"]),
        "archived_repos": sum(1 for r in repos if r["is_archived"]),
        "languages": languages,
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--org", default=DEFAULT_ORG,
                    help=f"GitHub org login (default: {DEFAULT_ORG})")
    ap.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR,
                    help=f"output directory (default: {DEFAULT_OUT_DIR})")
    args = ap.parse_args()

    if shutil.which("gh") is None:
        sys.exit("error: 'gh' CLI not found. Install it and run `gh auth login`.")
    # Fail fast with a clear message if not authenticated.
    auth = subprocess.run(["gh", "auth", "status"], capture_output=True, text=True)
    if auth.returncode != 0:
        sys.exit("error: not authenticated to gh. Run `gh auth login` first.")

    organization = fetch_organization(args.org)
    repos = [build_repo_object(args.org, n) for n in fetch_repos(args.org)]
    repos.sort(key=lambda r: r["name"].lower())
    summary = build_summary(repos)

    today = datetime.date.today().strftime("%Y-%m-%d")
    args.out_dir.mkdir(parents=True, exist_ok=True)
    out_path = args.out_dir / f"{today}.json"

    snapshot = {
        "scan_date": today,
        "scan_tool": "gh cli",
        "organization": organization,
        "repos": repos,
        "summary": summary,
    }
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\n[done] wrote {out_path}")
    print(f"  total_repos={summary['total_repos']}  "
          f"stars={summary['total_stars']}  forks={summary['total_forks']}")
    print(f"  license: with={summary['repos_with_license']} "
          f"without={summary['repos_without_license']}")
    print(f"  languages={summary['languages']}")


if __name__ == "__main__":
    main()
