<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import type { AelsProject, ProjectStage } from '../../project-data'
import { useStars } from '../composables/useStars'

const props = defineProps<{ project: AelsProject }>()

const { getStars, state } = useStars()
const displayStars = computed(() => {
  return getStars(props.project.repo)
})

const statusConfig = computed(() => {
  const map: Record<ProjectStage, { label: string; cls: string }> = {
    building: { label: '建设中', cls: 'status-building' },
    verifiable: { label: '可验证', cls: 'status-verifiable' },
    delivered: { label: '已交付', cls: 'status-delivered' },
    maintained: { label: '维护中', cls: 'status-maintained' },
  }
  return map[props.project.stage]
})

const resolvedLink = computed(() => {
  return withBase(`/projects/${props.project.slug}`)
})
</script>

<template>
  <component :is="resolvedLink ? 'a' : 'div'" :href="resolvedLink || undefined" class="project-card">
    <div class="card-header">
      <span class="card-title">{{ project.name }}</span>
      <span
        class="card-stars"
        :title="state === 'error' ? '星数暂时读取不到' : 'GitHub 实时星数'"
      >⭐ {{ displayStars ?? '—' }}</span>
    </div>
    <div class="card-body">
      <p class="card-position">{{ project.position }}</p>
      <p class="card-desc">{{ project.description }}</p>
      <p class="card-evidence"><strong>当前证据：</strong>{{ project.evidence }}</p>
      <p class="card-relations"><strong>关系：</strong>{{ project.relations.join('；') }}</p>
    </div>
    <div class="card-footer">
      <span class="card-tag tag-kind">{{ project.kind }}</span>
      <span :class="['card-tag', statusConfig.cls]">{{ statusConfig.label }}</span>
      <span v-for="domain in project.domains" :key="domain" class="card-tag tag-domain">{{ domain }}</span>
    </div>
  </component>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
  transition: border-color 0.39s ease, box-shadow 0.39s ease, transform 0.39s ease;
  text-decoration: none !important;
  color: inherit;
  cursor: pointer;
}

.project-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(-4px);
}

.dark .project-card {
  background-color: var(--vp-c-bg-elv);
  border-color: var(--vp-c-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15);
}

.dark .project-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.39s ease;
  line-height: 1.4;
}

.project-card:hover .card-title {
  color: var(--vp-c-brand-1);
}

.card-stars {
  min-width: 3.2em;
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  text-align: right;
  flex-shrink: 0;
  margin-left: 12px;
}

.card-body {
  flex: 1;
}

.card-desc {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.card-position {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.card-evidence,
.card-relations {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

.card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.card-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.6;
}

.tag-kind,
.tag-domain {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.card-tag.status-verifiable {
  border: 1px dashed var(--aels-status-verifiable);
  background-color: var(--aels-status-verifiable-bg);
  color: var(--aels-status-verifiable);
}

.card-tag.status-delivered {
  border: 1px solid var(--aels-status-delivered);
  background-color: var(--aels-status-delivered-bg);
  color: var(--aels-status-delivered);
}

.card-tag.status-building {
  border: 1px solid var(--aels-status-building);
  background-color: var(--aels-status-building-bg);
  color: var(--aels-status-building);
}

.card-tag.status-maintained {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

@media (max-width: 639px) {
  .project-card {
    padding: 18px;
  }

  .card-title {
    font-size: 15px;
  }

  .card-desc {
    font-size: 14px;
  }
}
</style>
