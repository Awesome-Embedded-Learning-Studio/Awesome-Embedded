<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="mermaid-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="放大查看图表"
    >
      <div class="mermaid-lightbox__toolbar" role="toolbar" aria-label="图表缩放控制">
        <button
          ref="firstBtnRef"
          type="button"
          class="mermaid-lightbox__btn"
          title="放大"
          @click="zoomIn"
        >
          放大
        </button>
        <button
          type="button"
          class="mermaid-lightbox__btn"
          title="缩小"
          @click="zoomOut"
        >
          缩小
        </button>
        <button
          type="button"
          class="mermaid-lightbox__btn"
          title="复位 / 适应窗口"
          @click="reset"
        >
          复位
        </button>
        <span class="mermaid-lightbox__hint">滚轮缩放 · 拖拽平移 · 双指缩放</span>
        <button
          type="button"
          class="mermaid-lightbox__btn mermaid-lightbox__close"
          title="关闭 (Esc)"
          aria-label="关闭"
          @click="close"
        >
          ✕
        </button>
      </div>
      <div
        ref="stageRef"
        class="mermaid-lightbox__stage"
        @click.self="close"
      >
        <div ref="targetRef" class="mermaid-lightbox__target" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import {
  registerMermaidLightboxOpener,
  type MermaidLightboxPayload,
} from '../mermaid-lightbox'

interface PanzoomInstance {
  zoomIn: (options?: unknown) => void
  zoomOut: (options?: unknown) => void
  reset: (options?: unknown) => void
  zoomWithWheel: (event: WheelEvent) => void
  destroy: () => void
}

const open = ref(false)
const stageRef = ref<HTMLElement | null>(null)
const targetRef = ref<HTMLElement | null>(null)
const firstBtnRef = ref<HTMLElement | null>(null)

let panzoom: PanzoomInstance | null = null
let payload: MermaidLightboxPayload | null = null
let wheelHandler: ((event: WheelEvent) => void) | null = null
let keyHandler: ((event: KeyboardEvent) => void) | null = null
let previousOverflow = ''

const unregister = registerMermaidLightboxOpener((nextPayload) => {
  payload = nextPayload
  openDialog()
})

function openDialog(): void {
  open.value = true
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  keyHandler = (event: KeyboardEvent) => {
    if (!open.value) return

    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      trapFocus(event)
    }
  }
  window.addEventListener('keydown', keyHandler)

  void nextTick(() => {
    void mountDiagram().then(() => firstBtnRef.value?.focus())
  })
}

async function mountDiagram(): Promise<void> {
  if (!payload || !stageRef.value || !targetRef.value) return

  const svg = payload.svg.cloneNode(true) as SVGElement
  targetRef.value.innerHTML = ''
  targetRef.value.appendChild(svg)

  svg.removeAttribute('style')
  const viewBox = svg.getAttribute('viewBox')
  let viewBoxWidth = 0
  let viewBoxHeight = 0

  if (viewBox) {
    const values = viewBox.trim().split(/[\s,]+/).map(Number)
    if (
      values.length >= 4 &&
      Number.isFinite(values[2]) &&
      Number.isFinite(values[3])
    ) {
      viewBoxWidth = values[2]
      viewBoxHeight = values[3]
    }
  }

  if (viewBoxWidth > 0 && viewBoxHeight > 0) {
    const maxWidth = Math.max(160, stageRef.value.clientWidth * 0.75)
    const maxHeight = Math.max(160, stageRef.value.clientHeight * 0.75)
    const scale = Math.min(maxWidth / viewBoxWidth, maxHeight / viewBoxHeight, 1)
    svg.setAttribute('width', String(Math.round(viewBoxWidth * scale)))
    svg.setAttribute('height', String(Math.round(viewBoxHeight * scale)))
  }
  svg.style.display = 'block'

  const { default: createPanzoom } = await import('@panzoom/panzoom')
  panzoom = createPanzoom(targetRef.value, {
    maxScale: 8,
    minScale: 0.3,
    step: 0.25,
    cursor: 'grab',
  })

  wheelHandler = (event: WheelEvent) => panzoom?.zoomWithWheel(event)
  stageRef.value.addEventListener('wheel', wheelHandler, { passive: false })
}

function trapFocus(event: KeyboardEvent): void {
  const root = stageRef.value?.parentElement
  if (!root) return

  const focusable = Array.from(
    root.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null)
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function close(): void {
  if (!open.value) return

  open.value = false
  teardown()
  payload?.trigger.focus()
  payload = null
}

function teardown(): void {
  if (wheelHandler && stageRef.value) {
    stageRef.value.removeEventListener('wheel', wheelHandler)
  }
  wheelHandler = null

  panzoom?.destroy()
  panzoom = null

  if (keyHandler) {
    window.removeEventListener('keydown', keyHandler)
    keyHandler = null
  }

  document.body.style.overflow = previousOverflow
  if (targetRef.value) targetRef.value.innerHTML = ''
}

function zoomIn(): void {
  panzoom?.zoomIn()
}

function zoomOut(): void {
  panzoom?.zoomOut()
}

function reset(): void {
  panzoom?.reset()
}

onBeforeUnmount(() => {
  unregister()
  if (open.value) teardown()
})
</script>
