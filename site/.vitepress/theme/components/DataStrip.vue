<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useRepoStats } from '../composables/useStars'

// 首页 Hero 正下方的 mono 细数据带。种子数取自组织 Discussion #7（2026-08-23 晨），
// 客户端由 useStars 的实时抓取替换（sessionStorage 缓存 1h）。

const { lang } = useData()
const { getAllStats } = useRepoStats()

const en = computed(() => lang.value.startsWith('en'))

// org 总量种子（Discussion #7：截至 2026-08-23 08:00）
const SEED = { stars: 652, forks: 96, repos: 38 }

const live = computed(() => {
  const all = getAllStats()
  // 只有全组织口径（GitHub org API 成功）才替换种子值；shields.io 回退只
  // 覆盖导航白名单子集，总量会明显偏小，那种情况下宁可继续用种子数。
  if (all.size < 35) return null
  let stars = 0
  let forks = 0
  for (const v of all.values()) {
    stars += v.stars
    forks += v.forks
  }
  return { stars, forks, repos: all.size }
})

const data = computed(() => live.value ?? SEED)

const items = computed(() => [
  { label: en.value ? 'org stars' : 'org stars', value: `★ ${data.value.stars}` },
  { label: 'forks', value: `⑂ ${data.value.forks}` },
  { label: en.value ? 'repos' : '仓库', value: String(data.value.repos) },
  {
    label: en.value ? 'evidence' : '验证',
    value: en.value ? 'Host → Sim → QEMU → Board' : 'Host → 模拟 → QEMU → 真板',
  },
])
</script>

<template>
  <div class="aels-stats">
    <span v-for="it in items" :key="it.label" class="aels-stats__item">
      <b>{{ it.value }}</b>{{ it.label }}
    </span>
  </div>
</template>

<style scoped>
.aels-stats {
  max-width: 1152px;
  margin: -6px auto 0;
  padding: 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 26px;
  align-items: baseline;
  border-top: 1px solid var(--vp-c-divider);
  font-family: var(--aels-font-mono);
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

.aels-stats__item b {
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 14px;
  margin-right: 6px;
}

@media (max-width: 639px) {
  .aels-stats { gap: 6px 18px; }
}
</style>
