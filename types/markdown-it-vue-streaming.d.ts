import { DefineComponent } from 'vue'
import { MarkdownItVueOptions } from './markdown-it-vue'

/**
 * Props for the MarkdownItVueStreaming component
 */
export interface MarkdownItVueStreamingProps {
  /** Markdown plain text content */
  content: string
  /** Whether streaming is active. When set to false, finalizes the rendering */
  streaming?: boolean
  /** Character to display as the streaming cursor */
  cursorChar?: string
  /** Options for markdown-it and plugins */
  options?: MarkdownItVueOptions
}

/**
 * Events emitted by the MarkdownItVueStreaming component
 */
export interface MarkdownItVueStreamingEmits {
  /** Emitted when rendering is complete (streaming set to false) */
  'render-complete': () => void
  /** Emitted after each chunk is rendered */
  'chunk-rendered': () => void
}

/**
 * Exposed methods from the MarkdownItVueStreaming component
 */
export interface MarkdownItVueStreamingExpose {
  /** Use a markdown-it plugin */
  use: (plugin: unknown, options?: unknown) => void
  /** Get the markdown-it instance */
  get: () => unknown
}

/**
 * MarkdownItVueStreaming Vue component for real-time markdown rendering
 * optimized for AI conversation-style streaming content.
 */
export const MarkdownItVueStreaming: DefineComponent<
  MarkdownItVueStreamingProps,
  object,
  object,
  object,
  object,
  object,
  object,
  MarkdownItVueStreamingEmits,
  string,
  {},
  {},
  {},
  MarkdownItVueStreamingExpose
>
