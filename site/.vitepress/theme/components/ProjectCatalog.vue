<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  laneGroups,
  laneLabels,
  projects,
  type AelsProject,
  type ProjectLane,
  type ProjectStage,
} from '../../project-data'
import ProjectCard from './ProjectCard.vue'

type LaneFilter = 'all' | ProjectLane
type StageFilter = 'all' | Exclude<ProjectStage, 'maintained'>

const lane = ref<LaneFilter>('all')
const stage = ref<StageFilter>('all')

const laneFilters: Array<{ value: LaneFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'learning', label: '教学线' },
  { value: 'product', label: '产品线' },
  { value: 'infrastructure', label: '基建与验证' },
]

const stageFilters: Array<{ value: StageFilter; label: string }> = [
  { value: 'all', label: '全部状态' },
  { value: 'building', label: '建设中' },
  { value: 'verifiable', label: '可验证' },
  { value: 'delivered', label: '已交付' },
]

const matches = (project: AelsProject) =>
  (lane.value === 'all' || project.lane === lane.value) &&
  (stage.value === 'all' || project.stage === stage.value)

const visibleLanes = computed<ProjectLane[]>(() => {
  const lanes: ProjectLane[] = ['learning', 'product', 'infrastructure']
  return lane.value === 'all' ? lanes : [lane.value]
})

const groupsFor = (laneKey: ProjectLane) => laneGroups[laneKey]

const projectsInGroup = (laneKey: ProjectLane, group: string) =>
  projects.filter(
    (project) => project.lane === laneKey && project.group === group && matches(project),
  )

const total = computed(() => projects.filter(matches).length)

function syncUrl(): void {
  if (typeof window === 'undefined') return
  const query = new URLSearchParams(window.location.search)
  if (lane.value === 'all') query.delete('lane')
  else query.set('lane', lane.value)
  if (stage.value === 'all') query.delete('stage')
  else query.set('stage', stage.value)

  const qs = query.toString()
  const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
  window.history.replaceState(null, '', next)
}

function readUrl(): void {
  const query = new URLSearchParams(window.location.search)
  const laneParam = query.get('lane')
  const stageParam = query.get('stage')

  if (laneParam === 'learning' || laneParam === 'product' || laneParam === 'infrastructure') {
    lane.value = laneParam
  }
  if (stageParam === 'building' || stageParam === 'verifiable' || stageParam === 'delivered') {
    stage.value = stageParam
  }
}

onMounted(readUrl)
watch([lane, stage], syncUrl)
</script>

<template>
  <div class="catalog-toolbar">
    <div class="catalog-filter-group" role="group" aria-label="按开发线筛选">
      <span class="catalog-filter-label">开发线</span>
      <div class="catalog-filters">
        <button
          v-for="filter in laneFilters"
          :key="filter.value"
          type="button"
          :class="{ active: lane === filter.value }"
          :aria-pressed="lane === filter.value"
          @click="lane = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="catalog-filter-group" role="group" aria-label="按项目状态筛选">
      <span class="catalog-filter-label">状态</span>
      <div class="catalog-filters">
        <button
          v-for="filter in stageFilters"
          :key="filter.value"
          type="button"
          :class="{ active: stage === filter.value }"
          :aria-pressed="stage === filter.value"
          @click="stage = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <p class="catalog-count" role="status" aria-live="polite">
      当前显示 {{ total }} 个项目
    </p>
  </div>

  <p v-if="total === 0" class="catalog-empty">
    没有符合条件的项目，换个筛选组合试试。
  </p>

  <section
    v-for="laneKey in visibleLanes"
    v-show="total > 0"
    :key="laneKey"
    class="catalog-section"
  >
    <h2 :id="`lane-${laneKey}`">{{ laneLabels[laneKey].title }}</h2>
    <p class="lane-description">{{ laneLabels[laneKey].description }}</p>
    <div
      v-for="group in groupsFor(laneKey)"
      v-show="projectsInGroup(laneKey, group.id).length > 0"
      :key="group.id"
      class="group-block"
    >
      <h3 :id="`group-${group.id}`">
        {{ group.title }}
        <span class="group-count">{{ projectsInGroup(laneKey, group.id).length }}</span>
      </h3>
      <p v-if="group.description" class="group-description">{{ group.description }}</p>
      <div class="project-grid">
        <ProjectCard
          v-for="project in projectsInGroup(laneKey, group.id)"
          :key="project.name"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px 28px;
  margin: 1.5rem 0 1.25rem;
}

.catalog-filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.catalog-filter-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  letter-spacing: 0.4px;
}

.catalog-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.catalog-filters button {
  padding: 6px 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}

.catalog-filters button:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}

.catalog-filters button.active {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-brand-2);
  color: var(--vp-c-bg);
}

.catalog-filters button:focus-visible {
  outline: 2px solid var(--vp-c-brand-2);
  outline-offset: 2px;
}

.catalog-count {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.catalog-empty {
  margin: 2rem 0;
  padding: 1.25rem 1.5rem;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-2);
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
  color: var(--vp-c-text-2);
  font-size: 0.85em;
  font-weight: normal;
}

.group-description {
  max-width: 760px;
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin: 1.5em 0;
  align-items: stretch;
}

@media (max-width: 639px) {
  .project-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .catalog-toolbar {
    gap: 10px;
  }
}
</style>
