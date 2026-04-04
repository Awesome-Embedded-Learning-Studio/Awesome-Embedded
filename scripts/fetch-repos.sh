#!/usr/bin/env bash
# =============================================================================
# fetch-repos.sh
# 用途：通过 GitHub CLI 抓取组织下所有仓库的元数据，输出为 JSON
# 依赖：gh（GitHub CLI），需已登录（gh auth login）
# 用法：./scripts/fetch-repos.sh YOUR_ORG_NAME
# =============================================================================

set -euo pipefail

ORG="${1:-}"
OUTPUT_DIR="./data"
OUTPUT_FILE="${OUTPUT_DIR}/repos.json"

if [ -z "$ORG" ]; then
  echo "❌ 请提供组织名称：./scripts/fetch-repos.sh YOUR_ORG_NAME"
  exit 1
fi

echo "📡 正在拉取 ${ORG} 的仓库数据..."
mkdir -p "$OUTPUT_DIR"

# 1. 获取所有仓库的基础信息
gh repo list "$ORG" \
  --limit 200 \
  --json name,description,url,primaryLanguage,repositoryTopics,\
stargazerCount,forkCount,isArchived,isPrivate,\
pushedAt,createdAt,updatedAt,hasWikiEnabled,licenseInfo \
  > "${OUTPUT_DIR}/repos_raw.json"

REPO_COUNT=$(jq length "${OUTPUT_DIR}/repos_raw.json")
echo "✅ 获取到 ${REPO_COUNT} 个仓库"

# 2. 对每个仓库读取其 README 前 50 行（用于 AI 摘要）
echo "📖 正在读取各仓库 README 摘要..."

jq -r '.[].name' "${OUTPUT_DIR}/repos_raw.json" | while read -r repo; do
  README_CONTENT=""
  # 尝试获取 README（静默失败）
  README_CONTENT=$(gh api "repos/${ORG}/${repo}/readme" \
    --jq '.content' 2>/dev/null \
    | base64 --decode 2>/dev/null \
    | head -50 \
    || echo "")

  # 写入单独文件供后续处理
  echo "$README_CONTENT" > "${OUTPUT_DIR}/readme_${repo}.txt"
done

# 3. 判断活跃度：距今天的天数
TODAY=$(date +%s)

jq --argjson today "$TODAY" '
  map(
    . + {
      daysSinceLastPush: (
        ($today - (.pushedAt | fromdateiso8601)) / 86400 | floor
      ),
      activityStatus: (
        (($today - (.pushedAt | fromdateiso8601)) / 86400) as $days |
        if $days <= 30 then "🟢 活跃"
        elif $days <= 180 then "🟡 维护中"
        else "🔴 低活跃"
        end
      )
    }
  )
' "${OUTPUT_DIR}/repos_raw.json" > "$OUTPUT_FILE"

echo ""
echo "🎉 数据已保存至 ${OUTPUT_FILE}"
echo ""
echo "📊 活跃度分布："
jq -r 'group_by(.activityStatus) | map({status: .[0].activityStatus, count: length}) | .[] | "\(.status): \(.count) 个"' "$OUTPUT_FILE"
echo ""
echo "👉 下一步：让 Claude Code 读取 ${OUTPUT_FILE} 生成 README"
