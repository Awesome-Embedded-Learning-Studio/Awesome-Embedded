<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '../../project-data'
import { useRepoStats } from '../composables/useStars'

const ORG = 'Awesome-Embedded-Learning-Studio'
const { getAllStats } = useRepoStats()

const projectByName = new Map(projects.map((project) => [project.name, project]))

const ranking = computed(() => {
  const all = getAllStats()
  const list: Array<{ name: string; stars: number; forks: number; desc: string }> = []
  for (const [full, stats] of all) {
    const name = full.split('/')[1]
    const project = projectByName.get(name)
    if (project) {
      list.push({ name, stars: stats.stars, forks: stats.forks, desc: project.description })
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
