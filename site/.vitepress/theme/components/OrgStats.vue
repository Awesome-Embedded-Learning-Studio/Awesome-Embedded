<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '../../project-data'
import { useStars } from '../composables/useStars'

const { getStars } = useStars()

const totalStars = computed(() => {
  let sum = 0
  for (const project of projects) {
    const s = getStars(project.repo)
    if (s !== null) sum += s
  }
  return sum || null
})

const stats = computed(() => [
  { label: '导航项目', value: String(projects.length) },
  { label: '总 Stars', value: totalStars.value ?? '—' },
  { label: '维护形态', value: '教学 · 产品 · 基建' },
  { label: '验证层次', value: 'Host → 模拟 → 真机' },
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
