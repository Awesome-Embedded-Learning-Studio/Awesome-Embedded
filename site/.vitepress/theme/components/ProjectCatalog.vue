<script setup lang="ts">
import { computed, ref } from 'vue'
import { laneGroups, laneLabels, projects, type ProjectLane } from '../../project-data'
import ProjectCard from './ProjectCard.vue'

type LaneFilter = 'all' | ProjectLane

const selected = ref<LaneFilter>('all')
const filters: Array<{ value: LaneFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'learning', label: '教学线' },
  { value: 'product', label: '产品线' },
  { value: 'infrastructure', label: '基建与验证' },
]

const visibleLanes = computed(() => {
  const lanes: ProjectLane[] = ['learning', 'product', 'infrastructure']
  return selected.value === 'all' ? lanes : [selected.value]
})

const groupsFor = (lane: ProjectLane) => laneGroups[lane]

const projectsInGroup = (lane: ProjectLane, group: string) =>
  projects.filter((project) => project.lane === lane && project.group === group)
</script>

<template>
  <div class="catalog-filters" aria-label="项目类型筛选">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      :class="{ active: selected === filter.value }"
      @click="selected = filter.value"
    >
      {{ filter.label }}
    </button>
  </div>

  <section v-for="lane in visibleLanes" :key="lane" class="catalog-section">
    <h2 :id="`lane-${lane}`">{{ laneLabels[lane].title }}</h2>
    <p class="lane-description">{{ laneLabels[lane].description }}</p>
    <div v-for="group in groupsFor(lane)" :key="group.id" class="group-block">
      <h3 :id="`group-${group.id}`">
        {{ group.title }}
        <span class="group-count">{{ projectsInGroup(lane, group.id).length }}</span>
      </h3>
      <p v-if="group.description" class="group-description">{{ group.description }}</p>
      <div class="project-grid">
        <ProjectCard
          v-for="project in projectsInGroup(lane, group.id)"
          :key="project.name"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 1.5rem 0 2rem;
}

.catalog-filters button {
  padding: 7px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}

.catalog-filters button:hover,
.catalog-filters button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.catalog-section {
  margin-top: 2.5rem;
}

.lane-description {
  max-width: 760px;
  color: var(--vp-c-text-2);
}

.group-block {
  margin-top: 2rem;
}

.group-block h3 {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 0.25rem;
}

.group-count {
  color: var(--vp-c-text-3);
  font-size: 0.85em;
  font-weight: normal;
}

.group-description {
  max-width: 760px;
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin: 1.5em 0;
}

@media (max-width: 639px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
