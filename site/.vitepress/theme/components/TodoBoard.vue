<script setup lang="ts">
import { computed } from 'vue'
import { todoItems, trackLabels } from '../../todo-data'
import type { TodoItem } from '../../todo-data'

const done = computed(() =>
  todoItems.filter((item) => item.status === 'done').sort((a, b) => b.month.localeCompare(a.month)).slice(0, 10),
)
const active = computed(() => todoItems.filter((item) => item.status === 'active'))
const queued = computed(() => todoItems.filter((item) => item.status === 'queued'))
const counts = computed(() => {
  const byTrack = new Map<string, number>()
  for (const item of todoItems) byTrack.set(item.track, (byTrack.get(item.track) || 0) + 1)
  return [...byTrack.entries()].map(([track, n]) => `${trackLabels[track as TodoItem['track']].title} ${n}`).join(' · ')
})

function href(item: TodoItem): string | undefined {
  if (item.link) return item.link
  if (item.projectSlug) return `/projects/${item.projectSlug}/`
  return undefined
}
</script>

<template>
  <p class="todo-counts">{{ counts }}（只登记已拍板的方向，任务级与未拍板不公开）</p>

  <h2>最近完成</h2>
  <ul class="todo-list">
    <li v-for="item in done" :key="item.id">
      <span class="todo-month">{{ item.month }}</span>
      <a v-if="href(item)" :href="href(item)">{{ item.title }}</a>
      <span v-else>{{ item.title }}</span>
      <span class="todo-desc"> —— {{ item.desc }}</span>
    </li>
  </ul>

  <h2>进行中</h2>
  <ul class="todo-list">
    <li v-for="item in active" :key="item.id">
      <a v-if="href(item)" :href="href(item)">{{ item.title }}</a>
      <span v-else>{{ item.title }}</span>
      <span class="todo-desc"> —— {{ item.desc }}</span>
    </li>
  </ul>

  <h2>排队中</h2>
  <ul class="todo-list">
    <li v-for="item in queued" :key="item.id">
      <span class="todo-track">{{ trackLabels[item.track].title }}</span>
      <a v-if="href(item)" :href="href(item)">{{ item.title }}</a>
      <span v-else>{{ item.title }}</span>
      <span class="todo-desc"> —— {{ item.desc }}</span>
    </li>
  </ul>
</template>

<style scoped>
.todo-counts {
  font-size: 0.85em;
  opacity: 0.75;
}
.todo-month,
.todo-track {
  display: inline-block;
  margin-right: 0.5em;
  font-size: 0.85em;
  opacity: 0.75;
}
.todo-desc {
  opacity: 0.85;
}
</style>
