// RSS：构建收尾时从 document/blog/ 直接读文章生成 /feed.xml，与列表共用同一套必填字段约定。
// 指路页（document/weekly/index.md）不在 blog 目录里，天然不进源。
import type { Plugin } from 'vite'
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, basename, join } from 'node:path'
import { absoluteUrl, withBase } from './site-env'

interface PostFm {
  title: string
  description: string
  date: string
  tags?: string[]
}

function parseFrontmatter(raw: string): PostFm | null {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!block) return null
  const fm: Record<string, string | string[]> = {}
  for (const line of block[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/)
    const arr = line.match(/^tags:\s*\[(.+)\]$/)
    if (arr) fm.tags = arr[1].split(',').map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
    else if (kv) fm[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
  }
  return fm as unknown as PostFm
}

export function rssPlugin(): Plugin {
  return {
    name: 'aels-rss',
    buildEnd() {
      const blogDir = resolve(process.cwd(), 'document/blog')
      const posts = readdirSync(blogDir)
        .filter((f) => f.endsWith('.md') && f !== 'index.md')
        .map((f) => ({ f, fm: parseFrontmatter(readFileSync(join(blogDir, f), 'utf8')) }))
        .filter((p): p is { f: string; fm: PostFm } => p.fm !== null && !!p.fm.title && !!p.fm.date)
        .sort((a, b) => b.fm.date.localeCompare(a.fm.date))

      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      const items = posts
        .map((p) => {
          const slug = basename(p.f, '.md')
          return [
            '    <item>',
            `      <title>${esc(p.fm.title)}</title>`,
            `      <link>${absoluteUrl(`/blog/${slug}`)}</link>`,
            `      <pubDate>${new Date(`${p.fm.date}T00:00:00Z`).toUTCString()}</pubDate>`,
            `      <description>${esc(p.fm.description || '')}</description>`,
            '    </item>',
          ].join('\n')
        })
        .join('\n')

      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n' +
        `    <title>Awesome-Embedded 文章</title>\n` +
        `    <link>${absoluteUrl('/blog/')}</link>\n` +
        `    <description>AELS 的长文、随笔与周报</description>\n` +
        `${items}\n  </channel>\n</rss>\n`

      const outDir = resolve(process.cwd(), 'site/.vitepress/dist')
      mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'feed.xml'), xml)
    },
  }
}
