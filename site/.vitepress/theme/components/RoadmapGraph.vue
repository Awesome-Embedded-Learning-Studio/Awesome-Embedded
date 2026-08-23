<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import {
  ROADMAP_BANDS,
  roadmapEdges,
  roadmapNodes,
  type RoadmapNode,
} from '../../roadmap-graph'
import { useStars } from '../composables/useStars'

/* ─────────── 文案（zh/en） ─────────── */
const { lang } = useData()
const en = computed(() => lang.value.startsWith('en'))
const t = {
  title: computed(() => (en.value ? 'Learning is a tree, not a pipeline' : '学习是一棵树，不是流水线')),
  note: computed(() => (en.value ? 'Drag nodes to arrange your bench · Hover to trace paths · Click a node for its project page' : '拖动节点布置你的工位 · 悬停看路径 · 点击看项目页')),
  reset: computed(() => (en.value ? '⟲ Reset layout' : '⟲ 重置布局')),
  allRepos: computed(() => (en.value ? '⌗ All repos →' : '⌗ 全部仓库 →')),
  lgSolid: computed(() => (en.value ? 'Recommended next' : '建议继续')),
  lgDash: computed(() => (en.value ? 'Deepen on demand' : '按需深化')),
  lgDot: computed(() => (en.value ? 'Support: verify · build · stable replay' : '支撑：验证 · 构建 · 稳定重放')),
  lgHere: computed(() => (en.value ? 'Start here' : '起点')),
  lgGhost: computed(() => (en.value ? '▫ Dashed chip = planned' : '▫ 虚线框 = 规划中')),
  lgBadge: computed(() => (en.value ? 'Badge 01–04 = four site sections' : '角标 01–04 = 站点四区')),
}

/* ─────────── 状态：节点位置（SSG 直出种子值） ─────────── */
interface LiveNode extends RoadmapNode {}
const nodes: LiveNode[] = reactive(roadmapNodes.map((n) => ({ ...n })))
const byId = new Map(nodes.map((n) => [n.id, n]))

/* 父链（悬停高亮用）：只依 solid + dash 边建立，同活稿 */
const PARENT: Record<string, string> = {}
for (const e of roadmapEdges) {
  if (e.kind === 'solid' || e.kind === 'dash') {
    if (!PARENT[e.to]) PARENT[e.to] = e.from
  }
}

/* 网格点阵（静态，照活稿 34 间距 / 每 3 个一点） */
const VB_W = 1330
const VB_H = 1010
const GRID: Array<[number, number]> = []
for (let gx = 30; gx < VB_W; gx += 34)
  for (let gy = 26; gy < VB_H; gy += 34)
    if ((gx / 34 + gy / 34) % 3 === 0) GRID.push([gx, gy])

/* ─────────── PCB 走线：正交 + 45° 倒角 + 过孔（照活稿移植） ─────────── */
interface Pt { x: number; y: number }
function anchors(f: LiveNode, t: LiveNode): [number, number, number, number] {
  const below = t.y > f.y + 34
  const above = t.y < f.y - 34
  if (below) return [f.x, f.y + f.h / 2, t.x, t.y - t.h / 2]
  if (above) return [f.x, f.y - f.h / 2, t.x, t.y + t.h / 2]
  const right = t.x > f.x
  return right
    ? [f.x + f.w / 2, f.y, t.x - t.w / 2, t.y]
    : [f.x - f.w / 2, f.y, t.x + t.w / 2, t.y]
}
function route(f: LiveNode, t: LiveNode): { d: string; via: Pt } {
  const [x1, y1, x2, y2] = anchors(f, t)
  const vert = Math.abs(y2 - y1) > 24
  if (vert) {
    const my = (y1 + y2) / 2
    const dx = x2 - x1
    if (Math.abs(dx) < 10) return { d: `M${x1} ${y1} L${x2} ${y2}`, via: { x: x1, y: my } }
    const c = Math.min(20, Math.abs(dx) / 2, Math.abs(my - y1) / 2, Math.abs(y2 - my) / 2) || 8
    const s = Math.sign(dx)
    return {
      d: `M${x1} ${y1} L${x1} ${my - c} L${x1 + s * c} ${my} L${x2 - s * c} ${my} L${x2} ${my + c} L${x2} ${y2}`,
      via: { x: (x1 + x2) / 2, y: my },
    }
  }
  const mx = (x1 + x2) / 2
  const dy = y2 - y1
  if (Math.abs(dy) < 10) return { d: `M${x1} ${y1} L${x2} ${y2}`, via: { x: mx, y: y1 } }
  const c = Math.min(18, Math.abs(dy) / 2)
  const s = Math.sign(dy)
  return {
    d: `M${x1} ${y1} L${mx - c} ${y1} L${mx} ${y1 + s * c} L${mx} ${y2 - s * c} L${mx + c} ${y2} L${x2} ${y2}`,
    via: { x: mx, y: (y1 + y2) / 2 },
  }
}

const routedEdges = computed(() =>
  roadmapEdges.map((e) => {
    const f = byId.get(e.from)!
    const tn = byId.get(e.to)!
    return { ...e, ...route(f, tn) }
  }),
)

/* ─────────── 悬停高亮：根 → 当前路径点亮，其余压暗 ─────────── */
const hoverId = ref<string | null>(null)
const chain = computed<Set<string> | null>(() => {
  if (!hoverId.value) return null
  const set = new Set<string>([hoverId.value])
  let cur = hoverId.value
  while (PARENT[cur]) {
    cur = PARENT[cur]
    set.add(cur)
  }
  return set
})
function inChain(id: string): boolean {
  return !chain.value || chain.value.has(id)
}
function edgeHot(from: string, to: string): boolean {
  return !!chain.value && chain.value.has(to) && chain.value.has(from)
}

/* ─────────── stars：现拉优先，回落种子值 ─────────── */
const { getStars } = useStars()
function starOf(n: LiveNode): number | null {
  if (n.type === 'root') return null // 同活稿：root 不显示 star
  return getStars(n.repo ?? '') ?? n.seedStar
}

/* ─────────── 拖拽 + 布局记忆（localStorage 仅客户端） ─────────── */
const LAYOUT_KEY = 'aels-roadmap-layout-v1'
const svgEl = ref<SVGSVGElement | null>(null)

function svgXY(ev: PointerEvent): { x: number; y: number } {
  const svg = svgEl.value!
  const pt = svg.createSVGPoint()
  pt.x = ev.clientX
  pt.y = ev.clientY
  const p = pt.matrixTransform(svg.getScreenCTM()!.inverse())
  return { x: p.x, y: p.y }
}

let dragId: string | null = null
let dragOff: { x: number; y: number } | null = null
let saveTimer: ReturnType<typeof setTimeout> | null = null

/* 拖拽误触抑制：位移超阈值后置 suppressClick，click 时吞掉，
   否则每次拖完节点浏览器都会在同一 <a> 上合成 click 新开仓库标签页。 */
let downScreen: { x: number; y: number } | null = null
let suppressClick = false

function onPointerDown(ev: PointerEvent, n: LiveNode) {
  dragId = n.id
  const p = svgXY(ev)
  dragOff = { x: p.x - n.x, y: p.y - n.y }
  downScreen = { x: ev.clientX, y: ev.clientY }
  suppressClick = false
  ;(ev.currentTarget as Element).setPointerCapture(ev.pointerId)
}
function onPointerMove(ev: PointerEvent, n: LiveNode) {
  if (!dragId || dragId !== n.id || !dragOff) return
  if (
    downScreen &&
    Math.hypot(ev.clientX - downScreen.x, ev.clientY - downScreen.y) > 4
  ) {
    suppressClick = true
  }
  const p = svgXY(ev)
  n.x = p.x - dragOff.x
  n.y = p.y - dragOff.y
}
function onClickGuard(ev: MouseEvent) {
  if (suppressClick) {
    ev.preventDefault()
    suppressClick = false
  }
}
function onPointerUp() {
  if (!dragId) return
  dragId = null
  dragOff = null
  scheduleSave()
}
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(saveLayout, 200)
}
function saveLayout() {
  try {
    const data: Record<string, { x: number; y: number }> = {}
    for (const n of nodes) data[n.id] = { x: Math.round(n.x), y: Math.round(n.y) }
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(data))
  } catch {
    /* storage 不可用时静默放弃记忆 */
  }
}
function resetLayout() {
  roadmapNodes.forEach((seed, i) => {
    nodes[i].x = seed.x
    nodes[i].y = seed.y
  })
  try {
    localStorage.removeItem(LAYOUT_KEY)
  } catch {
    /* ignore */
  }
}

onMounted(() => {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY)
    if (!raw) return
    const data = JSON.parse(raw) as Record<string, { x: number; y: number }>
    for (const n of nodes) {
      const saved = data[n.id]
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        n.x = saved.x
        n.y = saved.y
      }
    }
  } catch {
    /* 记忆损坏则用种子布局 */
  }
})
onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
})

function nodeHref(n: LiveNode): string | null {
  if (n.type === 'ghost') return null
  if (!n.href) return null
  // 站内路径（/projects/<slug>/）补 base 后同窗跳转；http 外链才开新页
  return n.href.startsWith('http') ? n.href : withBase(n.href)
}
function nodeExternal(n: LiveNode): boolean {
  return !!n.href && n.href.startsWith('http')
}
</script>

<template>
  <div class="rg-section">
    <div class="rg-plaque">
      <span class="rg-plaque__tag">§ ROADMAP</span>
      <span class="rg-plaque__title">{{ t.title.value }}</span>
      <span class="rg-plaque__note">{{ t.note.value }}</span>
    </div>

    <div class="rg-wrap">
      <div class="rg-ctl">
        <button type="button" @click="resetLayout">{{ t.reset.value }}</button>
        <a :href="withBase('/projects/')">{{ t.allRepos.value }}</a>
      </div>

      <!-- 移动端：rg-scroll 横向滚动 + svg min-width，保证节点文字可读 -->
      <div class="rg-scroll">
        <svg
          ref="svgEl"
          class="rg-svg"
          :viewBox="`0 0 ${VB_W} ${VB_H}`"
          xmlns="http://www.w3.org/2000/svg"
        >
        <!-- 网格点阵 -->
        <circle
          v-for="([gx, gy], i) in GRID"
          :key="`grid-${i}`"
          :cx="gx"
          :cy="gy"
          r="0.9"
          class="rg-grid"
        />

        <!-- 层带 -->
        <g v-for="(b, i) in ROADMAP_BANDS" :key="`band-${i}`">
          <rect
            class="rg-band"
            x="14"
            :y="b.top"
            width="1302"
            :height="b.bottom - b.top"
            rx="10"
          />
          <text class="rg-band-label" x="26" :y="b.top + 18">{{ b.label }}</text>
        </g>

        <!-- 边（走线 + 过孔） -->
        <g v-for="(e, i) in routedEdges" :key="`edge-${i}`">
          <circle class="rg-via" :cx="e.via.x" :cy="e.via.y" r="3" />
          <path class="rg-edge" :class="[`rg-edge--${e.kind}`, { 'rg-edge--hot': edgeHot(e.from, e.to) }]" :d="e.d" />
        </g>

        <!-- 节点 -->
        <template v-for="n in nodes" :key="n.id">
          <component
            :is="nodeHref(n) ? 'a' : 'g'"
            :href="nodeHref(n) ?? undefined"
            :target="nodeExternal(n) ? '_blank' : undefined"
            :rel="nodeExternal(n) ? 'noopener' : undefined"
            class="rg-node"
            :class="{ 'rg-node--ghost': n.type === 'ghost', 'rg-dim': !inChain(n.id) }"
            :transform="`translate(${n.x - n.w / 2},${n.y - n.h / 2})`"
            @pointerdown="onPointerDown($event, n)"
            @pointermove="onPointerMove($event, n)"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @click="onClickGuard"
            @pointerenter="hoverId = n.id"
            @pointerleave="hoverId = null"
          >
            <!-- 引脚（root/proj 芯片感） -->
            <template v-if="n.type === 'root' || n.type === 'proj'">
              <line
                v-for="i in 3"
                :key="`pl-${i}`"
                class="rg-pin"
                x1="-7"
                :y1="(n.h * i) / 4"
                x2="0"
                :y2="(n.h * i) / 4"
              />
              <line
                v-for="i in 3"
                :key="`pr-${i}`"
                class="rg-pin"
                :x1="n.w"
                :y1="(n.h * i) / 4"
                :x2="n.w + 7"
                :y2="(n.h * i) / 4"
              />
            </template>

            <rect
              class="rg-chip"
              :class="[`rg-chip--${n.type}`]"
              x="0"
              y="0"
              :width="n.w"
              :height="n.h"
              :rx="n.type === 'sup' ? 8 : 10"
            />
            <text
              class="rg-name"
              :class="{ 'rg-name--onroot': n.type === 'root', 'rg-name--ghost': n.type === 'ghost' }"
              :x="n.w / 2"
              :y="n.type === 'sup' ? 21 : 24"
              text-anchor="middle"
            >{{ n.name }}</text>
            <text
              v-if="n.type !== 'sup'"
              class="rg-sub"
              :class="{ 'rg-sub--onroot': n.type === 'root' }"
              :x="n.w / 2"
              y="41"
              text-anchor="middle"
            >{{ n.sub }}</text>
            <text
              class="rg-badge"
              :class="{ 'rg-badge--onroot': n.type === 'root' }"
              x="8"
              y="15"
            >{{ n.badge }}</text>
            <text
              v-if="starOf(n) !== null"
              class="rg-star"
              :x="n.w - 8"
              y="15"
              text-anchor="end"
            >★{{ starOf(n) }}</text>
            <circle v-if="n.type === 'root'" class="rg-here" cx="-16" :cy="n.h / 2" r="5" />
          </component>
        </template>
      </svg>
      </div>

      <div class="rg-legend">
        <span><svg width="26" height="8" viewBox="0 0 26 8"><line x1="0" y1="4" x2="26" y2="4" class="rg-edge rg-edge--solid" /></svg>{{ t.lgSolid.value }}</span>
        <span><svg width="26" height="8" viewBox="0 0 26 8"><line x1="0" y1="4" x2="26" y2="4" class="rg-edge rg-edge--dash" /></svg>{{ t.lgDash.value }}</span>
        <span><svg width="26" height="8" viewBox="0 0 26 8"><line x1="0" y1="4" x2="26" y2="4" class="rg-edge rg-edge--dot" /></svg>{{ t.lgDot.value }}</span>
        <span><svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" class="rg-here" /></svg>{{ t.lgHere.value }}</span>
        <span>{{ t.lgGhost.value }}</span>
        <span class="rg-legend__right">{{ t.lgBadge.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 区块外壳 ── */
.rg-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 32px 8px;
}
.rg-plaque {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}
.rg-plaque__tag {
  font-family: var(--aels-font-mono);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--aels-copper);
  border: 1px solid var(--aels-copper);
  border-radius: 6px;
  padding: 3px 10px;
  background: color-mix(in srgb, var(--aels-copper) 10%, transparent);
}
.rg-plaque__title {
  font-size: 21px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.rg-plaque__note {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

/* ── 图卡 ── */
.rg-wrap {
  position: relative;
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 1px 3px rgba(16, 32, 24, 0.06), 0 1px 2px rgba(16, 32, 24, 0.08);
  overflow: hidden;
}
.rg-svg {
  display: block;
  width: 100%;
  height: auto;
  touch-action: pan-y; /* 移动端页面滚动优先，节点仍可横向拖 */
  user-select: none;
}
.rg-ctl {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  gap: 8px;
  z-index: 5;
}
.rg-ctl button,
.rg-ctl a {
  font-family: var(--aels-font-mono);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  cursor: pointer;
  text-decoration: none;
}
.rg-ctl button:hover,
.rg-ctl a:hover {
  border-color: var(--aels-copper);
  color: var(--aels-copper);
}

/* ── 图例 ── */
.rg-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  padding: 12px 18px;
  border-top: 1px dashed var(--vp-c-divider);
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  font-family: var(--aels-font-mono);
}
.rg-legend svg {
  vertical-align: -2px;
  margin-right: 6px;
}
.rg-legend :deep(.rg-edge) {
  fill: none;
  stroke-width: 2;
}
.rg-legend :deep(.rg-edge--solid) {
  stroke: var(--aels-copper);
  opacity: 0.6;
}
.rg-legend :deep(.rg-edge--dash) {
  stroke: var(--aels-copper);
  opacity: 0.5;
  stroke-dasharray: 7 5;
}
.rg-legend :deep(.rg-edge--dot) {
  stroke: var(--vp-c-text-3);
  opacity: 0.5;
  stroke-dasharray: 2 5;
  stroke-linecap: round;
}
.rg-legend :deep(.rg-here) {
  fill: var(--aels-amber);
}
.rg-legend__right {
  margin-left: auto;
}

/* ── 图内元素 ── */
.rg-band {
  fill: color-mix(in srgb, var(--aels-copper) 7%, transparent);
  opacity: 0.35;
}
.rg-band-label {
  font-family: var(--aels-font-mono);
  font-size: 11px;
  fill: var(--vp-c-text-3);
  letter-spacing: 1.5px;
}
.rg-grid {
  fill: var(--vp-c-text-3);
  opacity: 0.18;
}
.rg-edge {
  fill: none;
  stroke-width: 2;
  transition: opacity 0.15s;
}
.rg-edge--solid {
  stroke: var(--aels-copper);
  opacity: 0.6;
}
.rg-edge--dash {
  stroke: var(--aels-copper);
  opacity: 0.5;
  stroke-dasharray: 7 5;
}
.rg-edge--dot {
  stroke: var(--vp-c-text-3);
  opacity: 0.5;
  stroke-dasharray: 2 5;
  stroke-linecap: round;
}
.rg-edge--hot {
  opacity: 1;
  stroke-width: 3;
  filter: drop-shadow(0 0 4px var(--aels-amber));
}
.rg-via {
  fill: var(--vp-c-bg);
  stroke: var(--aels-copper);
  stroke-width: 1.6;
  opacity: 0.6;
}
.rg-node {
  cursor: grab;
  transition: opacity 0.15s;
}
.rg-node:active {
  cursor: grabbing;
}
.rg-node.rg-dim {
  opacity: 0.22;
}
.rg-node--ghost {
  cursor: default;
}
.rg-chip {
  fill: var(--vp-c-bg-elv);
  stroke: var(--vp-c-brand-1);
  stroke-width: 1.8;
}
.rg-chip--root {
  fill: var(--vp-c-brand-1);
}
.rg-chip--ghost {
  stroke-dasharray: 5 4;
  stroke: var(--vp-c-text-3);
  fill: var(--vp-c-bg-soft);
}
.rg-chip--sup {
  stroke: var(--vp-c-text-3);
  stroke-width: 1.4;
}
.rg-pin {
  stroke: var(--aels-copper);
  stroke-width: 1.6;
  opacity: 0.7;
}
.rg-name {
  font-size: 13.5px;
  font-weight: 700;
  fill: var(--vp-c-text-1);
}
.rg-name--onroot {
  fill: var(--vp-c-bg-elv);
}
.rg-name--ghost {
  fill: var(--vp-c-text-3);
}
.rg-sub {
  font-size: 10.5px;
  fill: var(--vp-c-text-2);
}
.rg-sub--onroot {
  fill: color-mix(in srgb, var(--vp-c-bg-elv) 85%, transparent);
}
.rg-badge {
  font-family: var(--aels-font-mono);
  font-size: 9px;
  fill: var(--vp-c-brand-1);
  letter-spacing: 0.5px;
}
.rg-badge--onroot {
  fill: color-mix(in srgb, var(--vp-c-bg-elv) 80%, transparent);
}
.rg-star {
  font-family: var(--aels-font-mono);
  font-size: 9.5px;
  fill: var(--aels-amber);
}
.rg-here {
  fill: var(--aels-amber);
}

.rg-scroll {
  overflow-x: auto;
}

@media (max-width: 640px) {
  .rg-section {
    padding: 36px 16px 8px;
  }
  .rg-plaque__note {
    display: none;
  }
  /* 窄屏不再等比缩成缩略图：保最小宽度横向滚 + 允许双指缩放，
     页面纵向滚动优先（pan-y） */
  .rg-svg {
    min-width: 960px;
    touch-action: pan-x pan-y pinch-zoom;
  }
}
</style>
