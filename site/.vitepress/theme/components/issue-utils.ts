// Issue 看板共用的小工具：时间格式、摘要收口、标签归类。
// 数据从 GitHub 接口现取，字段定义见 issue-live.ts。

import type { IssueRecord } from './issue-live'

export const DAY = 86_400_000

/** 快照生成时间就是“现在”，相对时间以它为基准，避免读起来一直在变 */
export function relativeTime(iso: string, nowMs: number, en: boolean): string {
  const diff = Math.max(0, nowMs - new Date(iso).getTime())
  const d = Math.floor(diff / DAY)
  if (d === 0) return en ? 'today' : '今天'
  if (d === 1) return en ? 'yesterday' : '昨天'
  if (d < 30) return en ? `${d}d ago` : `${d} 天前`
  return shortDate(iso, nowMs)
}

/** 今年只写月-日，跨年补年份 */
export function shortDate(iso: string, nowMs: number): string {
  const d = new Date(iso)
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const sameYear = d.getUTCFullYear() === new Date(nowMs).getUTCFullYear()
  return sameYear ? `${mm}-${dd}` : `${d.getUTCFullYear()}-${mm}-${dd}`
}

/** 卡片上显示的日期：近一个月给相对时间，更早给日期 */
export function displayDate(iso: string, nowMs: number, en: boolean): string {
  return relativeTime(iso, nowMs, en)
}

/**
 * 摘要取正文第一段（跳过标题行、表格行），在句号处截断，最多 150 字。
 * 清洗在 issue-live.parseBody 里做，这里只管展示层的收口。
 */
export function excerptOf(text: string, limit = 150): string {
  const firstLine =
    text
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.length > 0 && !l.startsWith('#') && !l.startsWith('|')) ?? ''
  const s = firstLine.replace(/\s+/g, ' ')
  if (s.length <= limit) return s
  const head = s.slice(0, limit)
  const cut = Math.max(head.lastIndexOf('。'), head.lastIndexOf('！'), head.lastIndexOf('？'))
  if (cut > limit * 0.45) return head.slice(0, cut + 1)
  return `${head.replace(/[，,、\s]+\S*$/, '')}…`
}

export type LabelKind = 'doc' | 'enh' | 'help' | 'first' | 'bug' | 'feat' | 'misc'

/** 标签按语义归类，颜色在 IssueCard.vue 里给 */
export function labelKind(name: string): LabelKind {
  const n = name.toLowerCase()
  if (n.includes('doc')) return 'doc'
  if (n.includes('enhance') || n.includes('improve')) return 'enh'
  if (n.includes('help')) return 'help'
  if (n.includes('good first') || n.includes('beginner')) return 'first'
  if (n.includes('bug') || n.includes('fix')) return 'bug'
  if (n.includes('feature')) return 'feat'
  return 'misc'
}

/** 子任务按钮上的文案 */
export function kidsLabel(i: IssueRecord, expanded: boolean, en: boolean): string {
  const done = i.completedChildren
  if (expanded) return en ? `hide ${i.childTotal}` : `收起 ${i.childTotal} 个`
  if (en) return `${i.childTotal} sub-issues${done ? ` · ${done} done` : ''}`
  return `${i.childTotal} 个子任务${done ? ` · ${done} 已完成` : ''}`
}
