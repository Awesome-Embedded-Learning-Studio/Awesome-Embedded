<script setup lang="ts">
import type { IssueRecord } from './issue-live'
import IssueCard from './IssueCard.vue'

defineOptions({ name: 'IssueGrid' })

const props = withDefaults(defineProps<{
  nodes: IssueRecord[]
  trail?: string[]
  expanded: Set<string>
  kids: Map<string, IssueRecord[]>
  loading: Set<string>
  errors: Map<string, string>
  nowMs: number
  en: boolean
}>(), { trail: () => [] })

const emit = defineEmits<{
  toggle: [issue: IssueRecord]
  retry: [issue: IssueRecord]
}>()

function descendants(parent: IssueRecord) {
  return props.kids.get(parent.key)?.filter((i) => i.key !== parent.key && !props.trail.includes(i.key)) ?? []
}
</script>

<template>
  <ul class="issue-grid" :class="{ 'sub-list': trail.length > 0 }" role="list">
    <li v-for="issue in nodes" :key="issue.key">
      <IssueCard :issue="issue" :compact="trail.length > 0" :expanded="expanded.has(issue.key)"
        :kids-loading="loading.has(issue.key)" :kids-error="errors.get(issue.key) ?? null"
        :now-ms="nowMs" :en="en" @toggle="emit('toggle', issue)" @retry="emit('retry', issue)">
        <IssueGrid v-if="expanded.has(issue.key) && descendants(issue).length"
          :nodes="descendants(issue)" :trail="[...trail, issue.key]" :expanded="expanded"
          :kids="kids" :loading="loading" :errors="errors" :now-ms="nowMs" :en="en"
          @toggle="emit('toggle', $event)" @retry="emit('retry', $event)" />
      </IssueCard>
    </li>
  </ul>
</template>

<style scoped>
.issue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 235px), 1fr));
  gap: 10px;
  align-items: stretch;
  padding: 0;
  margin: 0;
  list-style: none;
}
.issue-grid > li { display: flex; flex-direction: column; min-width: 0; margin: 0; }
.issue-grid.sub-list { grid-template-columns: minmax(0, 1fr); gap: 5px; margin-top: 7px; }
@media (max-width: 639px) {
  .issue-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
