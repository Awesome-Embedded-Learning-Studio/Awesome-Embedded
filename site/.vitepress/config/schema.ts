import type { DefaultTheme } from 'vitepress'

// ── Types ──────────────────────────────────────────────────

export interface LocaleConfig {
  code: string
  label: string
  default?: boolean
  prefix?: string
  dir?: string
}

export interface VolumeConfig {
  name: string
  srcDir: string
  urlPrefix: string
}

export interface ProjectConfig {
  name: string
  title: Record<string, string>
  description: Record<string, string>
  /** 部署的绝对地址,不带尾斜杠,默认 Pages。环境变量 SITE_ORIGIN 可覆盖 */
  siteOrigin: string
  /** URL 子路径,前后带斜杠,如 '/Awesome-Embedded/'。环境变量 SITE_BASE 可覆盖 */
  base: string
  copyright: string

  documentsDir: string
  siteDir: string

  locales: LocaleConfig[]

  nav: Record<string, DefaultTheme.NavItem[]>
  sidebar: {
    volumes: VolumeConfig[]
    extra?: Record<string, DefaultTheme.SidebarItem[]>
  }

  github: {
    owner: string
    repo: string
    branch: string
    documentsPath: string
  }

  build: {
    concurrency?: number
    cacheDir?: string
    rootAssets?: string[]
    rootPages?: string[]
  }

  plugins: {
    cppTemplateEscape?: boolean
    kbd?: boolean
    math?: boolean
  }

  /** 图标文件名,不含 base 前缀,构建时自动拼上 */
  favicon?: string
}

// ── defineProject ──────────────────────────────────────────

export function defineProject(config: ProjectConfig): ProjectConfig {
  const primaryLocale = config.locales.find(l => l.default)
  if (!primaryLocale) {
    throw new Error('project.config.ts: exactly one locale must have default: true')
  }
  if (!config.title[primaryLocale.code]) {
    throw new Error(`project.config.ts: title missing for primary locale "${primaryLocale.code}"`)
  }
  return config
}
