import { useRouter } from 'vitepress'
import { nextTick, onMounted } from 'vue'
import { openMermaidLightbox } from './mermaid-lightbox'

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, text: string) => Promise<{ svg: string }>
}

let mermaidPromise: Promise<MermaidApi> | null = null

function loadMermaid(): Promise<MermaidApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('SSR 环境不加载 Mermaid'))
  }

  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => {
      const mermaid = ((mod as { default?: MermaidApi }).default ??
        (mod as unknown as MermaidApi))

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default',
        flowchart: {
          htmlLabels: true,
          nodeSpacing: 38,
          rankSpacing: 42,
          padding: 12,
        },
        themeVariables: {
          fontSize: '15px',
        },
      })

      return mermaid
    })
  }

  return mermaidPromise
}

function escapeHtml(source: string): string {
  return source
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function renderMermaidDiagrams(): Promise<void> {
  if (typeof window === 'undefined') return

  await nextTick()
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>('.mermaid-diagram[data-rendered="false"]'),
  )
  if (nodes.length === 0) return

  let mermaid: MermaidApi
  try {
    mermaid = await loadMermaid()
  } catch (error) {
    console.error('[mermaid] 客户端加载失败', error)
    return
  }

  for (let index = 0; index < nodes.length; index++) {
    const element = nodes[index]
    const encoded = element.dataset.mermaid
    if (!encoded) continue

    const source = decodeURIComponent(encoded)
    const id = `mermaid-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`

    try {
      const { svg } = await mermaid.render(id, source)
      element.innerHTML = svg
      element.dataset.rendered = 'true'
      attachMaximize(element, source)
    } catch (error) {
      console.error('[mermaid] 图表渲染失败', error)
      element.innerHTML = `<pre class="mermaid-error">${escapeHtml(source)}</pre>`
      element.dataset.rendered = 'error'
    }
  }
}

const MAXIMIZE_ICON =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>' +
  '<line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'

function attachMaximize(element: HTMLElement, source: string): void {
  const svg = element.querySelector('svg')
  if (!svg) return

  element.classList.add('mermaid-diagram--zoomable')

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'mermaid-maximize-btn'
  button.setAttribute('aria-label', '放大查看图表')
  button.title = '放大查看图表'
  button.innerHTML = MAXIMIZE_ICON
  button.addEventListener('click', () => {
    openMermaidLightbox({ svg, source, trigger: button })
  })
  element.appendChild(button)
}

export function setupMermaid(): void {
  const router = useRouter()
  const render = () => {
    renderMermaidDiagrams().catch((error) => {
      console.error('[mermaid] 页面渲染失败', error)
    })
  }

  onMounted(render)
  router.onAfterRouteChange = render
}
