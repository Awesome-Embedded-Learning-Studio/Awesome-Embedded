<script setup lang="ts">
import { computed } from 'vue'
import { useStars, useRepoStats } from '../composables/useStars'

const { getStars } = useStars()
const { getAllStats } = useRepoStats()

// 参与总 Stars 求和的公开仓库（与 useStars.ts 的 REPO_NAMES 保持一致）。
const repos = [
  'https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP',
  'https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_cpp_SimpleIniParser',
  'https://github.com/Awesome-Embedded-Learning-Studio/Project_MakeAMemroyPool',
  'https://github.com/Awesome-Embedded-Learning-Studio/CFBox',
  'https://github.com/Awesome-Embedded-Learning-Studio/Project_CXXBaseComponents',
  'https://github.com/Awesome-Embedded-Learning-Studio/edgecv',
  'https://github.com/Awesome-Embedded-Learning-Studio/imx-forge',
  'https://github.com/Awesome-Embedded-Learning-Studio/rk-forge',
  'https://github.com/Awesome-Embedded-Learning-Studio/rtl8733bu-linux-driver',
  'https://github.com/Awesome-Embedded-Learning-Studio/PenguinLab',
  'https://github.com/Awesome-Embedded-Learning-Studio/Cinux',
  'https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Book',
  'https://github.com/Awesome-Embedded-Learning-Studio/Cinux-Base',
  'https://github.com/Awesome-Embedded-Learning-Studio/ST-Forge',
  'https://github.com/Awesome-Embedded-Learning-Studio/BareMetal-Drivers',
  'https://github.com/Awesome-Embedded-Learning-Studio/Project_MicroWatch',
  'https://github.com/Awesome-Embedded-Learning-Studio/micro-forge',
  'https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_FreeRTOS',
  'https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt',
  'https://github.com/Awesome-Embedded-Learning-Studio/CFDesktop',
  'https://github.com/Awesome-Embedded-Learning-Studio/qt-compile-pipeline',
  'https://github.com/Awesome-Embedded-Learning-Studio/QuarkWidgets',
  'https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeHardware',
  'https://github.com/Awesome-Embedded-Learning-Studio/EmbedBox',
  'https://github.com/Awesome-Embedded-Learning-Studio/C-Journey',
  'https://github.com/Awesome-Embedded-Learning-Studio/aex',
  'https://github.com/Awesome-Embedded-Learning-Studio/bareline',
  'https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded',
]

const totalStars = computed(() => {
  let sum = 0
  for (const url of repos) {
    const s = getStars(url)
    if (s !== null) sum += s
  }
  return sum || null
})

// 公开仓库数：从 GitHub org API 实拉（未拉到时显示 '—'），不再写死过期数字。
const publicRepoCount = computed(() => {
  const n = getAllStats().size
  return n > 0 ? String(n) : '—'
})

const stats = computed(() => [
  { label: '公开仓库', value: publicRepoCount.value },
  { label: '总 Stars', value: totalStars.value ?? '—' },
  { label: '主要语言', value: 'C · C++ · Shell · TS' },
  { label: '贡献者', value: '3+' },
])
</script>

<template>
  <div class="org-stats">
    <div v-for="item in stats" :key="item.label" class="stat-item">
      <span class="stat-value">{{ item.value }}</span>
      <span class="stat-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.org-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin: 1.5em 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.stat-label {
  margin-top: 6px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

@media (max-width: 639px) {
  .org-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>
