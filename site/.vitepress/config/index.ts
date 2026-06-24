import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { buildSidebar } from './sidebar'
import { resolvePlugins } from '../plugins'
import type { ProjectConfig } from './schema'
import { resolve } from 'path'

import projectConfig from '../../../project.config'

const primaryLocale = projectConfig.locales.find(l => l.default)!
const defaultTitle = projectConfig.title[primaryLocale.code]
const defaultDesc = projectConfig.description[primaryLocale.code]
const githubUrl = `https://github.com/${projectConfig.github.owner}/${projectConfig.github.repo}`
const editPatternBase = `${githubUrl}/edit/${projectConfig.github.branch}/${projectConfig.github.documentsPath}`

const docsRoot = new URL(`../../../${projectConfig.documentsDir}`, import.meta.url).pathname.replace(/\/$/, '')

function buildLocales(): Record<string, any> {
  const locales: Record<string, any> = {}

  for (const locale of projectConfig.locales) {
    const locKey = locale.default ? 'root' : (locale.prefix?.replace(/\//g, '') || locale.code)
    const title = projectConfig.title[locale.code]
    const desc = projectConfig.description[locale.code]

    const baseConfig: any = {
      label: locale.label,
      lang: locale.code,
      title,
      description: desc,
    }

    if (!locale.default && locale.prefix) {
      baseConfig.link = locale.prefix
    }

    if (!locale.default) {
      baseConfig.themeConfig = {
        nav: projectConfig.nav[locale.code] || [],
        editLink: {
          pattern: `${editPatternBase}/:path`,
          text: `Edit this page on GitHub`,
        },
      }
    }

    locales[locKey] = baseConfig
  }

  return locales
}

// ── SEO / Open Graph ───────────────────────────────────────
// Locale-aware: zh_CN for Chinese (root) pages now; auto en_US once an /en/ locale is added later.
// No twitter:* tags by request — Open Graph covers WeChat / Feishu / DingTalk / Juejin / Zhihu / Slack / Discord previews.
const SITE_ORIGIN = 'https://awesome-embedded-learning-studio.github.io'
const OG_IMAGE = `${SITE_ORIGIN}${projectConfig.base}images/og/aels-og.png`

function transformHead(ctx: any) {
  const fm = (ctx.pageData && ctx.pageData.frontmatter) || {}
  const rel = ctx.page || ''                       // srcDir-relative md path: 'index.md' | 'about.md' | 'en/about.md'
  const isEn = rel.startsWith('en/')
  const title = fm.title || (ctx.pageData && ctx.pageData.title) || ctx.title || defaultTitle
  const description = fm.description || (ctx.pageData && ctx.pageData.description) || ctx.description || defaultDesc
  const path = rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
  const url = `${SITE_ORIGIN}${projectConfig.base}${path}`
  return [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: isEn ? (projectConfig.title['en'] || defaultTitle) : defaultTitle }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: '1731' }],
    ['meta', { property: 'og:image:height', content: '909' }],
    ['meta', { property: 'og:image:alt', content: 'Awesome Embedded Learning Studio' }],
    ['meta', { property: 'og:locale', content: isEn ? 'en_US' : primaryLocale.code.replace('-', '_') }],
    ['meta', { property: 'og:locale:alternate', content: isEn ? 'zh_CN' : 'en_US' }],
  ]
}

export default defineConfig({
  srcDir: `../${projectConfig.documentsDir}`,
  title: defaultTitle,
  description: defaultDesc,
  lang: primaryLocale.code,
  base: projectConfig.base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => tag.includes('-') || tag.includes('.'),
      },
    },
  },

  locales: buildLocales(),

  head: [
    ['link', { rel: 'icon', href: projectConfig.favicon || `${projectConfig.base}favicon.ico` }],
  ],

  transformHead,

  sitemap: {
    // VitePress resolves each <loc> via new URL(pagePath, hostname), so hostname MUST end with a
    // trailing slash (keep projectConfig.base's trailing '/') — otherwise the base segment is
    // treated as a filename and eaten by sub-page paths. Verified via dist/sitemap.xml.
    hostname: `${SITE_ORIGIN}${projectConfig.base}`,
  },

  markdown: {
    lineNumbers: true,
    math: projectConfig.plugins.math ?? false,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      resolvePlugins(md, projectConfig)
    },
  },

  vite: {
    publicDir: resolve(__dirname, '../public'),
    build: {
      chunkSizeWarningLimit: 5000,
    },
  },

  themeConfig: {
    nav: projectConfig.nav[primaryLocale.code] || [],
    sidebar: buildSidebar(docsRoot, projectConfig),

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: `${editPatternBase}/:path`,
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Built with VitePress',
      copyright: projectConfig.copyright,
    },

    socialLinks: [
      { icon: 'github', link: githubUrl },
    ],
  } satisfies DefaultTheme.Config,
})
