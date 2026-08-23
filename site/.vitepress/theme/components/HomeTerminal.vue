<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 首页 Hero 右侧的琥珀荧光"设备屏"。挂在 theme/index.ts 的 home-hero-image 槽。
// 颜色全部走全局 token（custom.css 的 --aels-term-*），明暗模式下终端自成一个整体不变。

const body = ref<HTMLElement | null>(null)

const LINES: Array<{ html: string; hot?: boolean }> = [
  { html: '[<span class="t">    0.000000</span>] Booting AELS Studio on i.MX6ULL...' },
  { html: '[<span class="t">    0.412000</span>] memory: learning notes mapped OK' },
  { html: '[<span class="t">    0.883000</span>] roadmap: tree topology detected' },
  { html: '[<span class="t">    1.204000</span>] evidence: 人审→编译→测试→QEMU→真板' },
  { html: '[<span class="t">    1.512000</span>] aels: welcome, friend :)', hot: true },
]

onMounted(() => {
  const el = body.value
  if (!el) return
  // 打字机对 reduced-motion 用户直接整屏呈现
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.innerHTML = LINES.map(l => `<div class="term__line${l.hot ? ' term__line--hot' : ''}">${l.html}</div>`).join('')
    return
  }
  let i = 0
  let cur = document.createElement('div')
  cur.className = 'term__line'
  el.appendChild(cur)
  const tick = () => {
    if (i >= LINES.length) {
      const c = document.createElement('span')
      c.className = 'term__cursor'
      el.appendChild(c)
      return
    }
    cur.innerHTML = LINES[i].html
    if (LINES[i].hot) cur.classList.add('term__line--hot')
    i++
    cur = document.createElement('div')
    cur.className = 'term__line'
    el.appendChild(cur)
    window.setTimeout(tick, i === 1 ? 260 : 190)
  }
  window.setTimeout(tick, 420)
})
</script>

<template>
  <div class="term" aria-label="AELS Studio boot log">
    <div class="term__bar">
      <span class="term__dot" /><span class="term__dot" /><span class="term__dot" />
      <span class="term__title">aels@studio: ~ (i.MX6ULL)</span>
    </div>
    <div ref="body" class="term__body" />
  </div>
</template>

<style scoped>
.term {
  background: var(--aels-term-bg);
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--aels-term-fg) 16%, transparent);
  box-shadow: var(--aels-shadow-lift);
  overflow: hidden;
  text-align: left;
}

.term__bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  background: color-mix(in srgb, var(--aels-term-fg) 4%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--aels-term-fg) 12%, transparent);
}

.term__dot { width: 11px; height: 11px; border-radius: 50%; }
.term__dot:nth-child(1) { background: #ff5f56; }
.term__dot:nth-child(2) { background: #ffbd2e; }
.term__dot:nth-child(3) { background: #27c93f; }

.term__title {
  margin-left: 8px;
  font-family: var(--aels-font-mono);
  font-size: 11px;
  color: var(--aels-term-dim);
  letter-spacing: 1px;
}

.term__body {
  padding: 18px 20px 22px;
  font-family: var(--aels-font-mono);
  font-size: 15px;
  font-weight: 500;
  line-height: 2;
  min-height: 196px;
}

.term__line {
  color: var(--aels-term-fg);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.term__line :deep(.t) { color: var(--aels-term-dim); }
.term__line--hot { color: var(--aels-term-hi); }

.term__cursor {
  display: inline-block;
  width: 8px;
  height: 15px;
  background: var(--aels-term-fg);
  vertical-align: -2px;
  animation: term-blink 1.05s steps(1) infinite;
}

@keyframes term-blink { 50% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .term__cursor { animation: none; }
}
</style>
