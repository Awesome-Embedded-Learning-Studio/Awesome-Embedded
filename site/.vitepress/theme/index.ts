import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import HomeTipBanner from './components/HomeTipBanner.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import OrgStats from './components/OrgStats.vue'
import RankingTable from './components/RankingTable.vue'
import projectConfig from '../../../project.config.ts'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-before': () => h(HomeTipBanner, { config: projectConfig }),
    })
  },
  enhanceApp({ app }) {
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectGrid', ProjectGrid)
    app.component('OrgStats', OrgStats)
    app.component('RankingTable', RankingTable)
  },
} satisfies Theme
