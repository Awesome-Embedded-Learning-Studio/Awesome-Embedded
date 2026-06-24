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
      { text: '项目', link: '/projects/' },
      { text: '排行榜', link: '/ranking/' },
      { text: '周报', link: '/weekly/' },
      { text: '文章', link: '/blog/' },
      { text: '路线图', link: '/roadmap/' },
      { text: '规划', link: '/planning/' },
      { text: '贡献', link: '/contributing/' },
      { text: '流程', link: '/workflow/' },
      { text: '维护者', link: '/maintainers/' },
      { text: 'GitHub', link: 'https://github.com/Awesome-Embedded-Learning-Studio/Awesome-Embedded' },
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
      { name: 'planning', srcDir: 'planning', urlPrefix: '/planning' },
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

  homeBanner: {
    'zh-CN': '欢迎来到 Awesome-Embedded 学习小屋！从现代 C++ 到 Embedded Linux、MCU、Qt 桌面与 x86_64 OS 实验——不知道从哪里开始，请查看 <a href="/Awesome-Embedded/guide/">新手引导</a>。',
    'en': 'Welcome to AELS — project-based engineering notes on embedded systems, modern C and C++, Linux and OS work. New here? Scroll to the <a href="/Awesome-Embedded/en/#about">About</a> section below.',
  },
})
