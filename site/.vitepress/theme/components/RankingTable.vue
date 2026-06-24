<script setup lang="ts">
import { computed } from 'vue'
import { useRepoStats } from '../composables/useStars'

const ORG = 'Awesome-Embedded-Learning-Studio'
const { getAllStats } = useRepoStats()

// 与 useStars.ts 的 REPO_NAMES 保持一致；只有这里的仓库才出现在排行榜里。
const REPO_META: Record<string, { desc: string }> = {
  'Tutorial_AwesomeModernCPP': { desc: '现代 C++ 系统教程（C++11~C++23）' },
  'Tutorial_cpp_SimpleIniParser': { desc: '手搓 INI 解析器，C++ 工程化入门实战' },
  'Project_MakeAMemroyPool': { desc: '内存池实战，FreeList 到 ThreadLocal' },
  'CFBox': { desc: '现代 BusyBox 替代品，446KB 极致体积' },
  'Project_CXXBaseComponents': { desc: 'ArgParser、FileCopier 等渐进式实战项目' },
  'edgecv': { desc: 'C++20 编译期类型安全计算机视觉库' },
  'imx-forge': { desc: 'i.MX6ULL 嵌入式 Linux 开发工坊' },
  'rk-forge': { desc: 'Rockchip 平台开发者工作空间' },
  'rtl8733bu-linux-driver': { desc: 'RTL8733BU WiFi 驱动 Linux 7.1 移植' },
  'PenguinLab': { desc: '基于 QEMU 的 Linux 内核学习站' },
  'Cinux': { desc: '现代 C++17 的 x86_64 操作系统实验' },
  'Cinux-Book': { desc: '从零手搓 x86_64 操作系统中文教程' },
  'Cinux-Base': { desc: 'Cinux 的 freestanding C++17 基础类型库' },
  'Cinux-GUI': { desc: 'Cinux 家族的 host-neutral GUI 核心' },
  'ST-Forge': { desc: 'STM32 HAL 驱动框架，CMake 原生构建' },
  'BareMetal-Drivers': { desc: '单片机裸机通用驱动库' },
  'Project_MicroWatch': { desc: '资源受限平台智能手表原型' },
  'micro-forge': { desc: 'ARM Cortex-M3 全系统模拟器' },
  'Tutorial_FreeRTOS': { desc: 'FreeRTOS 系列开源教程' },
  'Tutorial_AwesomeQt': { desc: 'Qt 6 百科全书式教程' },
  'CFDesktop': { desc: 'Qt6 嵌入式 Material Design 3 桌面框架' },
  'qt-compile-pipeline': { desc: 'Qt6 ARM 交叉编译自动化管道' },
  'QuarkWidgets': { desc: '组织级统一 Qt 组件库' },
  'Tutorial_AwesomeHardware': { desc: '嵌入式硬件学习笔记（电路/PCB/传感器）' },
  'EmbedBox': { desc: '嵌入式开发通用工具教程' },
  'C-Journey': { desc: 'C 初学者学习日志与社区' },
  'aex': { desc: '轻量 C++ 扩展库' },
  'bareline': { desc: '现代 C++23 shell 交互框架' },
  'Awesome-Embedded': { desc: '组织中心导航仓库' },
}

const ranking = computed(() => {
  const all = getAllStats()
  const list: Array<{ name: string; stars: number; forks: number; desc: string }> = []
  for (const [full, stats] of all) {
    const name = full.split('/')[1]
    const meta = REPO_META[name]
    if (meta) {
      list.push({ name, stars: stats.stars, forks: stats.forks, desc: meta.desc })
    }
  }
  return list.sort((a, b) => b.stars - a.stars)
})
</script>

<template>
  <div class="ranking-table">
    <div class="ranking-header">
      <span class="col-rank">#</span>
      <span class="col-name">项目</span>
      <span class="col-stars">Stars</span>
      <span class="col-forks">Forks</span>
    </div>
    <a
      v-for="(item, idx) in ranking"
      :key="item.name"
      :href="`https://github.com/${ORG}/${item.name}`"
      target="_blank"
      rel="noopener"
      class="ranking-row"
    >
      <span class="col-rank" :class="{ 'rank-top': idx < 3 }">{{ idx + 1 }}</span>
      <span class="col-name">
        <span class="repo-name">{{ item.name }}</span>
        <span class="repo-desc">{{ item.desc }}</span>
      </span>
      <span class="col-stars">⭐ {{ item.stars }}</span>
      <span class="col-forks">🍴 {{ item.forks }}</span>
    </a>
    <div v-if="ranking.length === 0" class="ranking-empty">加载中...</div>
  </div>
</template>

<style scoped>
.ranking-table {
  margin: 1.5em 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  background-color: var(--vp-c-bg);
}

.ranking-header,
.ranking-row {
  display: grid;
  grid-template-columns: 48px 1fr 80px 80px;
  align-items: center;
  padding: 14px 20px;
}

.ranking-header {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
}

.ranking-row {
  text-decoration: none !important;
  color: inherit;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.2s ease;
}

.ranking-row:last-child {
  border-bottom: none;
}

.ranking-row:hover {
  background-color: var(--vp-c-default-soft);
}

.col-rank {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-3);
}

.rank-top {
  color: #f59e0b;
  font-size: 16px;
}

.col-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.repo-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.repo-desc {
  font-size: 12px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-stars,
.col-forks {
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: right;
}

.ranking-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

@media (max-width: 639px) {
  .ranking-header,
  .ranking-row {
    grid-template-columns: 36px 1fr 60px 60px;
    padding: 12px 14px;
  }

  .repo-desc {
    display: none;
  }
}
</style>
