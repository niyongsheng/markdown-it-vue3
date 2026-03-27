import MarkdownIt from 'markdown-it'

/**
 * State returned by streaming renderer methods
 */
export interface StreamingRendererState {
  /** The rendered HTML content */
  html: string
  /** Incomplete markdown text that hasn't been rendered yet */
  pending: string
  /** Whether the stream has been finalized */
  isComplete: boolean
}

/**
 * Streaming renderer instance for incremental markdown rendering.
 * Handles append-only rendering optimized for AI conversation-style streaming.
 */
export interface StreamingRenderer {
  /**
   * Append a chunk of markdown content
   * @param chunk - New markdown content to append
   * @returns Current state after appending
   */
  append(chunk: string): StreamingRendererState

  /**
   * Finalize the stream and render any remaining content
   * @returns Final state with all content rendered
   */
  finalize(): StreamingRendererState

  /**
   * Reset the renderer state, clearing all content
   */
  reset(): void

  /**
   * Get current state without modification
   * @returns Current renderer state
   */
  getState(): StreamingRendererState
}

/**
 * Creates a streaming renderer instance for incremental markdown rendering.
 *
 * @param md - markdown-it instance with plugins configured
 * @returns StreamingRenderer instance with append, finalize, reset, and getState methods
 *
 * @example
 * ```ts
 * import MarkdownIt from 'markdown-it'
 * import { createStreamingRenderer } from 'markdown-it-vue3'
 *
 * const md = new MarkdownIt()
 * const renderer = createStreamingRenderer(md)
 *
 * // Append chunks as they arrive
 * const state1 = renderer.append('Hello ')
 * const state2 = renderer.append('**World**\n')
 *
 * // Finalize when stream ends
 * const final = renderer.finalize()
 * console.log(final.html) // Fully rendered HTML
 * ```
 */
export function createStreamingRenderer(md: MarkdownIt): StreamingRenderer

export default createStreamingRenderer
