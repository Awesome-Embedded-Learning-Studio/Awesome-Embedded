export interface MermaidLightboxPayload {
  svg: SVGElement
  source: string
  trigger: HTMLElement
}

type Opener = (payload: MermaidLightboxPayload) => void

let opener: Opener | null = null

export function registerMermaidLightboxOpener(fn: Opener): () => void {
  opener = fn
  return () => {
    if (opener === fn) opener = null
  }
}

export function openMermaidLightbox(payload: MermaidLightboxPayload): void {
  opener?.(payload)
}
