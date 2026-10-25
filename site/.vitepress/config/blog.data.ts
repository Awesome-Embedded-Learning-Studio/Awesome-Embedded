// 文章列表的数据源：document/blog/ 下全部文章（含 weekly/ 等子目录，不含索引页）。
// fail loud：文章头缺 title / description / date / tags，或日期格式非法，构建即停并指明文件。
// YAML 会把 2026-07-25 自动解析成 Date，这里统一归一化成 YYYY-MM-DD 字符串再交给页面。
import { createContentLoader } from 'vitepress'

const loader = createContentLoader('../document/blog/**/*.md', {
  exclude: ['../document/blog/index.md'],
  render: false,
  excerpt: true,
})

export default {
  async load() {
    const raw = (await loader.load()).filter((post) => !/^\/blog\/?$/.test(post.url))
    if (raw.length === 0) throw new Error('blog: 文章列表为空，检查 createContentLoader 的 glob 路径')

    const posts = raw.map((post) => {
      const fm = post.frontmatter as Record<string, unknown>
      const date =
        fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date ?? '')
      for (const field of ['title', 'description', 'tags'] as const) {
        if (!fm[field]) throw new Error(`blog: ${post.url} 缺文章头字段 ${field}（title/description/date/tags 全部必填）`)
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`blog: ${post.url} 的 date 必须是 YYYY-MM-DD，当前是 ${date}`)
      }
      if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
        throw new Error(`blog: ${post.url} 的 tags 必须是非空数组，周报固定含「周报」`)
      }
      return { ...post, frontmatter: { ...fm, date } }
    })

    return posts.sort((a, b) =>
      String((b.frontmatter as Record<string, unknown>).date).localeCompare(
        String((a.frontmatter as Record<string, unknown>).date),
      ),
    )
  },
}
