import { defineProject } from './site/.vitepress/config/schema'

export default defineProject({
  name: 'Awesome-Embedded',
  title: { 'zh-CN': 'Awesome-Embedded' },
  description: { 'zh-CN': 'Awesome-Embedded-Learning-Studio 嵌入式学习小屋导航中心' },
  base: '/Awesome-Embedded/',
  copyright: 'Copyright © 2025-2026 Awesome-Embedded-Learning-Studio',

  documentsDir: 'document',
  siteDir: 'site',

  locales: [
    { code: 'zh-CN', label: '中文', default: true },
  ],

  nav: {
    'zh-CN': [
      { text: '首页', link: '/' },
      { text: '项目', link: '/projects/' },
      { text: '路线图', link: '/roadmap/' },
      { text: '规划', link: '/planning/' },
      { text: '贡献', link: '/contributing/' },
      { text: '流程', link: '/workflow/' },
      { text: '维护者', link: '/maintainers/' },
      { text: 'GitHub', link: 'https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded' },
    ],
  },

  sidebar: {
    volumes: [
      { name: 'guide', srcDir: 'guide', urlPrefix: '/guide' },
      { name: 'roadmap', srcDir: 'roadmap', urlPrefix: '/roadmap' },
      { name: 'planning', srcDir: 'planning', urlPrefix: '/planning' },
      { name: 'projects', srcDir: 'projects', urlPrefix: '/projects' },
      { name: 'contributing', srcDir: 'contributing', urlPrefix: '/contributing' },
      { name: 'workflow', srcDir: 'workflow', urlPrefix: '/workflow' },
      { name: 'maintainers', srcDir: 'maintainers', urlPrefix: '/maintainers' },
    ],
  },

  github: {
    owner: 'Awesome-Embedded-Learning-Studio',
    repo: 'Awesome-Embedded',
    branch: 'main',
    documentsPath: 'document',
  },

  build: {
    concurrency: 4,
    rootPages: ['index.md'],
    rootAssets: [],
  },

  plugins: {
    cppTemplateEscape: false,
    kbd: false,
    math: false,
  },

  favicon: '/Awesome-Embedded/Awesome-Embedded.png',

  homeBanner: {
    'zh-CN': '欢迎来到 Awesome-Embedded 学习小屋！不知道从哪里开始？请查看 <a href="/Awesome-Embedded/guide/">新手引导</a>。',
  },
})
