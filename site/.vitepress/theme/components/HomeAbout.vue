<script setup lang="ts">
import { useData, withBase } from 'vitepress'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AboutZh from './home-about.zh.md'
import AboutEn from './home-about.en.md'
import HomePlaque from './HomePlaque.vue'

const { lang } = useData()
// Locale-aware: render the about section in the page's language.
const About = computed(() => (lang.value.startsWith('en') ? AboutEn : AboutZh))
const plaque = computed(() =>
  lang.value.startsWith('en')
    ? { tag: '§ ABOUT', title: 'The Porch' }
    : { tag: '§ ABOUT', title: '门廊' },
)

/* ── 门廊分节弹射 ────────────────────────────────────────────
   每节（一个 h2 加它后面的内容）包成 .porch-sec，滚到就整张卡弹上来，
   划走就收回去，来回滚都跟着走。
   方向跟着滚动走：从下面上来从下沿顶，从上面下来从上沿压。
   边界一条：直接定位到深处时，目标以上的节必须一起显出来，不能留白；
   锚点跳转、前进后退、带 hash 打开，走"立即显示"这条路，不播动画。 */
const rootEl = ref<HTMLElement | null>(null)
const sections: HTMLElement[] = []
let ticking = false

/* 把 h2 及其后的兄弟节点包成一节。
   Markdown 组件渲染出来会再套一层 div，所以真正装 h2 的是它的父节点。 */
function wrapSections(inner: HTMLElement) {
  const firstH2 = inner.querySelector('h2')
  if (!firstH2) return
  const host = firstH2.parentElement as HTMLElement
  const heads = (Array.from(host.children) as HTMLElement[]).filter(
    (el) => el.tagName === 'H2',
  )
  for (const head of heads) {
    const moving: Element[] = [head]
    let cur: Element | null = head.nextElementSibling
    while (cur && cur.tagName !== 'H2') {
      moving.push(cur)
      cur = cur.nextElementSibling
    }
    const wrap = document.createElement('div')
    wrap.className = 'porch-sec'
    host.insertBefore(wrap, head)
    for (const el of moving) wrap.appendChild(el)
    sections.push(wrap)
  }
}

function showNow(el: HTMLElement) {
  if (!el.classList.contains('is-shown')) el.classList.add('is-shown')
  el.classList.add('no-anim')
  /* 只压一帧：这一帧直接到位，之后照常参与进出动画 */
  requestAnimationFrame(() => el.classList.remove('no-anim'))
}

function showAnimated(el: HTMLElement) {
  if (el.classList.contains('is-shown')) return
  el.classList.add('is-shown')
}

/* 视口内、以及视口以上（已经划过去）的节，一次性全部显出来 */
function showAbove(limit = window.innerHeight) {
  for (const el of sections) {
    if (el.getBoundingClientRect().top < limit) showNow(el)
  }
}

let raf = 0
function scheduleShowAbove() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => showAbove())
}

onMounted(async () => {
  await nextTick()
  const inner = rootEl.value?.querySelector('.home-about__inner') as HTMLElement | null
  if (!inner) return
  wrapSections(inner)

  /* 带 hash 打开（或者锚点跳过来、前进后退），目标以上的节不播动画直接出现。
     这里按 DOM 顺序数到目标那一节为止，不依赖滚动是否已经落位。 */
  if (window.location.hash) {
    showUpToTarget()
  } else {
    showAbove()
  }

  /* 自己量和视口的关系，不用 IntersectionObserver：
     滚动时按 rAF 节流重算，进出都跟得上，也不会漏掉退出。 */
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)

  window.addEventListener('hashchange', onJump)
  window.addEventListener('popstate', onJump)
  document.addEventListener('click', onClickAnchor, true)
})

/* 一张卡什么时候算"到了"：上沿进到视口 88% 以内，且下沿还没划出顶边 */
function update() {
  ticking = false
  const vh = window.innerHeight
  for (const el of sections) {
    const rect = el.getBoundingClientRect()
    const visible = rect.top < vh * 0.88 && rect.bottom > 0
    const shown = el.classList.contains('is-shown')
    if (visible === shown) continue
    if (visible) {
      /* 从视口上方滚回来的，从上沿压下来；从下方上来的，从下沿顶上去 */
      el.classList.toggle('from-top', rect.top < 0)
      showAnimated(el)
    } else {
      el.classList.remove('is-shown')
    }
  }
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(update)
}

/* 显到目标那一节为止：目标以上的节一个都不能留白 */
function showUpToTarget() {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!id) {
    showAbove()
    return
  }
  const target = document.getElementById(id)
  if (!target) {
    showAbove()
    return
  }
  let upto = sections.length - 1
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].contains(target) || sections[i] === target) {
      upto = i
      break
    }
  }
  for (let i = 0; i <= upto; i++) showNow(sections[i])
}

function onJump() {
  showUpToTarget()
  scheduleShowAbove()
  onScroll()
}

function onClickAnchor(ev: MouseEvent) {
  if (!(ev.target instanceof Element)) return
  const link = ev.target.closest('a[href^="#"]')
  if (!link) return
  scheduleShowAbove()
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.removeEventListener('hashchange', onJump)
  window.removeEventListener('popstate', onJump)
  document.removeEventListener('click', onClickAnchor, true)
})
</script>

<template>
  <section id="about" ref="rootEl" class="home-about">
    <img
      class="porch-mark"
      :src="withBase('/brand/aels-mark.png')"
      width="256"
      height="256"
      alt=""
      aria-hidden="true"
      decoding="async"
    />
    <HomePlaque v-bind="plaque" center />
    <div class="vp-doc home-about__inner">
      <component :is="About" />
    </div>
  </section>
</template>

<style scoped>
.home-about {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 64px;
}

/* 首页"关于"段沿用全站正文字号，不再单独放大。
   列宽/分节/高亮等门廊排版见 custom.css 的 Home About 段。 */
.home-about__inner {
  font-size: 1rem;
  line-height: 1.9;
}
</style>
