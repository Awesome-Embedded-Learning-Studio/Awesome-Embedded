import type MarkdownIt from 'markdown-it'
import type { PluginSimple } from 'markdown-it'

export const mermaidPlugin: PluginSimple = (md: MarkdownIt) => {
  // Mermaid 代码块由客户端渲染，不交给 Shiki 当作普通代码高亮。
  md.core.ruler.push('mermaid_block', (state) => {
    for (const token of state.tokens) {
      if (token.type === 'fence' && token.info.trim() === 'mermaid') {
        token.type = 'mermaid_diagram'
        token.tag = ''
        token.nesting = 0
      }
    }
    return true
  })

  md.renderer.rules.mermaid_diagram = (tokens, idx) => {
    const encoded = encodeURIComponent(tokens[idx].content.trim())
    return `<div class="mermaid-diagram" data-mermaid="${encoded}" data-rendered="false"></div>`
  }
}
