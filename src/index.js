import MarkdownItVue from './markdown-it-vue'
import MarkdownItVueStreaming from './markdown-it-vue-streaming.vue'
import { createStreamingRenderer } from './streaming-renderer'

const install = function (Vue) {
  Vue.component(MarkdownItVue.name, MarkdownItVue)
  Vue.component(MarkdownItVueStreaming.name, MarkdownItVueStreaming)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

MarkdownItVue.install = install
export default MarkdownItVue
export { MarkdownItVueStreaming, createStreamingRenderer }
