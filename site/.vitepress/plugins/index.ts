import type MarkdownIt from 'markdown-it'
import type { ProjectConfig } from '../config/schema'
import { languageAliasPlugin } from './language-aliases'
import { mermaidPlugin } from './mermaid'

export function resolvePlugins(md: MarkdownIt, config: ProjectConfig): void {
  md.use(languageAliasPlugin)
  md.use(mermaidPlugin)
}
