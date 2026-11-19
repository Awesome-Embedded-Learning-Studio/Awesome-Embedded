<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

type Copy = readonly [label: string, note: string]
type Entry = {
  href: string
  enHref?: string
  zh: Copy
  en: Copy
}
type Group = {
  id: string
  zh: string
  en: string
  primary: Entry
  secondary: Entry[]
}

const groups: Group[] = [
  {
    id: 'learn', zh: '想开始学习', en: 'Start learning',
    primary: {
      href: '/roadmap/',
      zh: ['学习关系详情', '到专页看各分支的说明和建议。'],
      en: ['Learning roadmap', 'Read the notes and recommendations for each branch.'],
    },
    secondary: [
      { href: '/guide/', zh: ['入门指南', '第一次来'], en: ['Getting started', 'For new readers'] },
      { href: '/blog/', enHref: 'https://aels.hashnode.dev', zh: ['文章', '教程与笔记'], en: ['Articles', 'Tutorials and notes'] },
      { href: 'https://github.com/Awesome-Embedded-Learning-Studio/aels-prism', zh: ['视频', 'aels-prism'], en: ['Videos', 'aels-prism'] },
    ],
  },
  {
    id: 'projects', zh: '想了解项目', en: 'Explore projects',
    primary: {
      href: '/projects/',
      zh: ['仓库目录', '看组织有哪些项目、各仓库做什么。'],
      en: ['Project catalog', 'See what the studio builds and what each repository is for.'],
    },
    secondary: [
      { href: '/plans/', zh: ['项目规划', '各项目的下一步'], en: ['Project plans', 'What each project is planning'] },
      { href: '/ranking/', zh: ['项目热度', 'GitHub 星标'], en: ['Project popularity', 'GitHub stars'] },
    ],
  },
  {
    id: 'participate', zh: '想跟进或参与', en: 'Follow or contribute',
    primary: {
      href: '/issues/', enHref: '/en/issues/',
      zh: ['Issue 看板', '按技术主题找开放 Issue，查看子任务进度。'],
      en: ['Issue board', 'Find open issues by topic and see sub-issue progress.'],
    },
    secondary: [
      { href: '/todo/', zh: ['工作室计划', '跨仓方向与站点建设'], en: ['Studio plans', 'Cross-repo and website work'] },
      { href: '/blog/?tag=周报', zh: ['周报', '最近做了什么'], en: ['Weekly reports', 'What happened recently'] },
      { href: '/contributing/', zh: ['贡献指南', '反馈或提交改动'], en: ['Contributing guide', 'Report a problem or submit a change'] },
      { href: '/maintainers/', zh: ['维护者', '找负责的人'], en: ['Maintainers', 'Find the people responsible'] },
    ],
  },
]

const { lang } = useData()
const locale = computed(() => lang.value.startsWith('en') ? 'en' : 'zh')
const destination = (entry: Entry) => locale.value === 'en' ? (entry.enHref ?? entry.href) : entry.href
const isExternal = (entry: Entry) => destination(entry).startsWith('https://')
const link = (entry: Entry) => isExternal(entry) ? destination(entry) : withBase(destination(entry))
const chineseOnly = (entry: Entry) => locale.value === 'en' && !entry.enHref
</script>

<template>
  <section class="home-navigation" aria-labelledby="home-navigation-heading">
    <h2 id="home-navigation-heading">{{ locale === 'en' ? 'Explore the site' : '站内导航' }}</h2>
    <nav class="navigation-grid" aria-labelledby="home-navigation-heading">
      <section v-for="group in groups" :key="group.id" class="navigation-card">
        <h3>{{ group[locale] }}</h3>
        <a class="primary-link" :href="link(group.primary)">
          <span class="link-name">
            <strong>{{ group.primary[locale][0] }}</strong>
            <span v-if="chineseOnly(group.primary)" class="language">Chinese</span>
          </span>
          <span class="link-arrow" aria-hidden="true">→</span>
          <span class="primary-note">{{ group.primary[locale][1] }}</span>
        </a>
        <ul class="secondary-links" role="list">
          <li v-for="entry in group.secondary" :key="entry.href">
            <a :href="link(entry)">
              <span class="link-name">
                <span>{{ entry[locale][0] }}</span>
                <span v-if="chineseOnly(entry)" class="language">Chinese</span>
                <span v-if="isExternal(entry)" class="link-arrow" aria-hidden="true">↗</span>
              </span>
              <span class="secondary-note">{{ entry[locale][1] }}</span>
            </a>
          </li>
        </ul>
      </section>
    </nav>
  </section>
</template>

<style scoped>
.home-navigation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 22px 32px 0;
}
.home-navigation h2 {
  margin: 0 0 14px;
  color: var(--vp-c-text-1);
  font-size: 21px;
  font-weight: 700;
}
.navigation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}
.navigation-card {
  min-width: 0;
  padding: 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--aels-radius-lg);
  background: var(--vp-c-bg-soft);
}
.navigation-card h3 {
  margin: 0 0 9px;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 650;
}
.primary-link {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-content: start;
  gap: 4px 8px;
  min-height: 80px;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--aels-radius-md);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}
.link-name {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0 5px;
  min-width: 0;
  overflow-wrap: anywhere;
}
.primary-link strong { font-size: 15px; line-height: 1.4; }
.primary-note { grid-column: 1 / -1; }
.primary-note, .secondary-note { color: var(--vp-c-text-2); font-size: 12px; line-height: 1.5; }
.language { color: var(--vp-c-text-2); font-size: 10px; }
.link-arrow { color: var(--vp-c-brand-1); }
.secondary-links { margin: 6px 0 0; padding: 0; list-style: none; }
.secondary-links li + li { border-top: 1px solid var(--vp-c-divider); }
.secondary-links a {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  min-height: 36px;
  gap: 8px;
  padding: 7px 4px;
  color: var(--vp-c-text-1);
  font-size: 13px;
  line-height: 1.5;
}
.secondary-note { text-align: end; }
.primary-link:hover, .secondary-links a:hover { color: var(--vp-c-brand-1); }
.primary-link:hover { border-color: var(--vp-c-brand-2); }
.secondary-links a:hover .link-name { text-decoration: underline; text-underline-offset: 3px; }
.navigation-card a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; border-radius: var(--aels-radius-md); }
@media (max-width: 767px) {
  .home-navigation { padding: 18px 16px 0; }
  .navigation-grid { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .primary-link { min-height: 0; }
}
</style>
