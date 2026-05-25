import type MarkdownIt from 'markdown-it'
import type { ProjectConfig } from '../config/schema'
import { languageAliasPlugin } from './language-aliases'

export function resolvePlugins(md: MarkdownIt, config: ProjectConfig): void {
  md.use(languageAliasPlugin)
}
