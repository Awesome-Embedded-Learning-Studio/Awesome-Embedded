<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { data } from '../../config/blog.data'

interface Post {
  url: string
  frontmatter: { title: string; description: string; date: string; tags: string[] }
}

const posts = data as unknown as Post[]
const filter = ref<string | null>(null)

onMounted(() => {
  const tag = new URLSearchParams(window.location.search).get('tag')
  if (tag) filter.value = tag
})

const shown = computed(() => (filter.value ? posts.filter((p) => p.frontmatter.tags.includes(filter.value!)) : posts))
const allTags = computed(() => [...new Set(posts.flatMap((p) => p.frontmatter.tags as string[]))])
</script>

<template>
  <p class="blog-filter">
    <button :class="{ on: filter === null }" @click="filter = null">全部</button>
    <button v-for="tag in allTags" :key="tag" :class="{ on: filter === tag }" @click="filter = tag">
      {{ tag }}
    </button>
  </p>

  <ul class="blog-list">
    <li v-for="post in shown" :key="post.url">
      <a :href="post.url">
        <span class="blog-date">{{ post.frontmatter.date }}</span>
        {{ post.frontmatter.title }}
      </a>
      <p class="blog-desc">{{ post.frontmatter.description }}</p>
      <p class="blog-tags">{{ (post.frontmatter.tags as string[]).join(' · ') }}</p>
    </li>
  </ul>
</template>

<style scoped>
.blog-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
.blog-filter button {
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  padding: 0.15em 0.8em;
  background: transparent;
  cursor: pointer;
  font-size: 0.85em;
}
.blog-filter button.on {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}
.blog-list {
  list-style: none;
  padding-left: 0;
}
.blog-date {
  display: inline-block;
  margin-right: 0.6em;
  font-size: 0.85em;
  opacity: 0.7;
}
.blog-desc {
  margin: 0.2em 0 0;
  opacity: 0.85;
}
.blog-tags {
  margin: 0.1em 0 0.8em;
  font-size: 0.8em;
  opacity: 0.6;
}
</style>
