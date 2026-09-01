import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import HomeTerminal from './components/HomeTerminal.vue'
import DataStrip from './components/DataStrip.vue'
import QQGroups from './components/QQGroups.vue'
import RoadmapGraph from './components/RoadmapGraph.vue'
import HomeAbout from './components/HomeAbout.vue'
import HomePlaque from './components/HomePlaque.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import ProjectCatalog from './components/ProjectCatalog.vue'
import OrgStats from './components/OrgStats.vue'
import RankingTable from './components/RankingTable.vue'
import MermaidLightbox from './components/MermaidLightbox.vue'
import { setupMermaid } from './mermaid-client'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(MermaidLightbox),
      // 首页门面：hero 右侧琥珀终端 → 数据带 → 可拖拽学习树 → 方法论卡 → 门廊长文
      'home-hero-image': () => h(HomeTerminal),
      // DataStrip 必须保持在第一位：它的 margin: -6px auto 0 是为紧贴 hero 设计的
      'home-hero-after': () => [h(DataStrip), h(QQGroups)],
      'home-features-before': () => [
        h(RoadmapGraph),
        h(HomePlaque, { tag: '§ APPROACH', title: '怎么学，怎么信' }),
      ],
      'home-features-after': () => h(HomeAbout),
    })
  },
  setup() {
    setupMermaid()
  },
  enhanceApp({ app }) {
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectGrid', ProjectGrid)
    app.component('ProjectCatalog', ProjectCatalog)
    app.component('OrgStats', OrgStats)
    app.component('RankingTable', RankingTable)
  },
} satisfies Theme
