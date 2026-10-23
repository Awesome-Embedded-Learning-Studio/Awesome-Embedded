// 站点地址的唯一来源。project.config.ts 提供默认值(当前 Pages 部署),
// 环境变量 SITE_ORIGIN / SITE_BASE 可覆盖(本地预览、非默认子路径部署)。
// 非法值在构建启动时直接抛错,不等产物里才发现地址拼错。
import projectConfig from '../../../project.config'

const ORIGIN_PATTERN = /^https?:\/\/[^/]+$/ // https://example.github.io,无路径无尾斜杠
const BASE_PATTERN = /^\/(?:[A-Za-z0-9._~-]+\/)*$/ // /Awesome-Embedded/ 或 /,前后斜杠都不能少

function invalid(name: string, value: string, expected: string): never {
  throw new Error(
    `site-env: ${name} is invalid, got "${value}". ${expected}. ` +
      `Fix the ${name} env variable or the corresponding field in project.config.ts.`,
  )
}

const origin = process.env.SITE_ORIGIN || projectConfig.siteOrigin
if (!ORIGIN_PATTERN.test(origin)) {
  invalid(
    'SITE_ORIGIN',
    origin,
    'Expected an http(s) origin like https://example.github.io, without trailing slash or path',
  )
}

const base = process.env.SITE_BASE || projectConfig.base
if (!BASE_PATTERN.test(base)) {
  invalid('SITE_BASE', base, 'Expected a base path with leading and trailing slashes, like /Awesome-Embedded/ or /')
}

/** 站内路径拼上 base,如 '/roadmap/' → '/Awesome-Embedded/roadmap/' */
export function withBase(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return base.replace(/\/$/, '') + p
}

/** 站内路径拼成绝对地址,OG / canonical / sitemap(以及第二批 RSS)共用这一处拼接 */
export function absoluteUrl(path: string): string {
  return origin + withBase(path)
}

export const siteOrigin = origin
export const siteBase = base
