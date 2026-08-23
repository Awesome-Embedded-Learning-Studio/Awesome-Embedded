import { defineProject } from './site/.vitepress/config/schema'

export default defineProject({
  name: 'Awesome-Embedded',
  title: { 'zh-CN': 'Awesome-Embedded', 'en': 'Awesome Embedded Learning Studio' },
  description: {
    'zh-CN': 'Awesome-Embedded-Learning-Studio · C/C++ 系统软件与嵌入式工程实践学习导航',
    'en': 'Project-based engineering notes for embedded systems, modern C++, Linux, and operating systems.',
  },
  base: '/Awesome-Embedded/',
  copyright: 'Copyright © 2025-2026 Awesome-Embedded-Learning-Studio',

  documentsDir: 'document',
  siteDir: 'site',

  locales: [
    { code: 'zh-CN', label: '中文', default: true },
    { code: 'en', label: 'English', prefix: '/en/', dir: 'en' },
  ],

  nav: {
    'zh-CN': [
      { text: '首页', link: '/' },
      { text: '从这里开始', link: '/guide/' },
      { text: '学习关系', link: '/roadmap/' },
      { text: '仓库目录', link: '/projects/' },
      {
        text: '社区与参与',
        items: [
          { text: '周报', link: '/weekly/' },
          { text: '文章', link: '/blog/' },
          { text: '贡献指南', link: '/contributing/' },
          { text: '协作流程', link: '/workflow/' },
          { text: '维护者', link: '/maintainers/' },
          { text: '项目热度', link: '/ranking/' },
          { text: 'GitHub', link: 'https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded' },
        ],
      },
    ],
    'en': [
      { text: 'Home', link: '/en/' },
      { text: 'GitHub', link: 'https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded' },
      { text: 'Blog', link: 'https://aels.hashnode.dev' },
    ],
  },

  sidebar: {
    volumes: [
      { name: 'guide', srcDir: 'guide', urlPrefix: '/guide' },
      { name: 'roadmap', srcDir: 'roadmap', urlPrefix: '/roadmap' },
      { name: 'projects', srcDir: 'projects', urlPrefix: '/projects' },
      { name: 'contributing', srcDir: 'contributing', urlPrefix: '/contributing' },
      { name: 'workflow', srcDir: 'workflow', urlPrefix: '/workflow' },
      { name: 'maintainers', srcDir: 'maintainers', urlPrefix: '/maintainers' },
      { name: 'ranking', srcDir: 'ranking', urlPrefix: '/ranking' },
      { name: 'weekly', srcDir: 'weekly', urlPrefix: '/weekly' },
      { name: 'blog', srcDir: 'blog', urlPrefix: '/blog' },
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
})
