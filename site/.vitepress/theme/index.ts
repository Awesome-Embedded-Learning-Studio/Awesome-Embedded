import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import HomeTerminal from './components/HomeTerminal.vue'
import HomeMark from './components/HomeMark.vue'
import DataStrip from './components/DataStrip.vue'
import QQGroups from './components/QQGroups.vue'
import RoadmapGraph from './components/RoadmapGraph.vue'
import HomeAbout from './components/HomeAbout.vue'
import HomePlaque from './components/HomePlaque.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectCatalog from './components/ProjectCatalog.vue'
import OrgStats from './components/OrgStats.vue'
import RankingTable from './components/RankingTable.vue'
import MermaidLightbox from './components/MermaidLightbox.vue'
import BlogList from './components/BlogList.vue'
import TodoBoard from './components/TodoBoard.vue'
import IssueBoard from './components/IssueBoard.vue'
import { setupMermaid } from './mermaid-client'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(MermaidLightbox),
      // 首页门面：hero 右侧组织动图 → 数据带加交流群 → 琥珀终端
      // → 可拖拽学习树 → 方法论卡 → 门廊长文。
      // 四张学习卡（emoji 图标那组）已整组删掉，空出来的位置给了终端。
      'home-hero-image': () => h(HomeMark),
      // DataStrip 必须保持在第一位：它的 margin: -6px auto 0 是为紧贴 hero 设计的
      'home-hero-after': () => [h(DataStrip), h(QQGroups)],
      'home-features-after': () => [
        h(HomeTerminal),
        h(RoadmapGraph),
        h(HomePlaque, { tag: '§ APPROACH', title: '怎么学，怎么信' }),
        h(HomeAbout),
      ],
    })
  },
  setup() {
    setupMermaid()
  },
  enhanceApp({ app }) {
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectCatalog', ProjectCatalog)
    app.component('OrgStats', OrgStats)
    app.component('RankingTable', RankingTable)
    app.component('BlogList', BlogList)
    app.component('TodoBoard', TodoBoard)
    app.component('IssueBoard', IssueBoard)
  },
} satisfies Theme
