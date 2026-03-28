<template>
  <div class="streaming-markdown">
    <div
      class="markdown-body"
      ref="markdownRef"
      @click="hdlClick"
    >
      <div v-html="renderedHtml" class="streaming-rendered"></div>
      <span v-if="pendingText && streaming" class="streaming-pending">{{ pendingText }}</span>
      <span v-if="streaming" class="streaming-cursor">{{ cursorChar }}</span>
    </div>
    <image-viewer
      v-if="showViewer"
      :url-list="urlList"
      v-model:index="index"
      :on-close="closeViewer"
    />
  </div>
</template>

<script>
import { defineComponent, ref, watch, nextTick, reactive, computed, onMounted, onUnmounted, toRefs } from 'vue'
import MarkdownIt from 'markdown-it'
import { full as MarkdownItEmoji } from 'markdown-it-emoji'
import MarkdownItSubscript from 'markdown-it-sub'
import MarkdownItSuperscript from 'markdown-it-sup'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItAbbreviation from 'markdown-it-abbr'
import MarkdownItInsert from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItLatex from 'markdown-it-latex'
import MarkdownItContainer from 'markdown-it-container'
import MarkdownItGithubToc from 'markdown-it-github-toc'
import MarkdownItSourceMap from 'markdown-it-source-map'
import MarkdownItLinkAttributes from './markdown-it-link-attributes'
import MarkdownItEcharts from './markdown-it-plugin-echarts'
import MarkdownItMermaid from './markdown-it-plugin-mermaid'
import MarkdownItFlowchart from './markdown-it-plugin-flowchart'
import MarkdownItHighlight, { setupCodeCopy } from './markdown-it-highlight'
import MarkdownItFontAwsome from './markdown-it-font-awsome'
import MarkdownItImage from './markdown-it-image'
import 'markdown-it-latex/dist/index.css'
import './markdown-it-copy.css'

import * as echarts from 'echarts'
import mermaid from 'mermaid'
import flowchart from 'flowchart.js'
import ImageViewer from './markdown-it-image/image-viewer.vue'
import { createStreamingRenderer } from './streaming-renderer.js'

// Dynamic theme stylesheet loader (shared with markdown-it-vue.vue)
const THEME_CSS_ID = 'markdown-theme-css'

// Import CSS content at build time using raw-loader
const cssContent = {
  light: require('!!raw-loader!github-markdown-css/github-markdown-light.css').default,
  dark: require('!!raw-loader!github-markdown-css/github-markdown-dark.css').default,
  default: require('!!raw-loader!github-markdown-css/github-markdown.css').default
}

const loadThemeStylesheet = (theme) => {
  // Remove existing stylesheet by ID
  const existing = document.getElementById(THEME_CSS_ID)
  if (existing) {
    existing.remove()
  }

  // Create style tag with inlined CSS content
  const style = document.createElement('style')
  style.id = THEME_CSS_ID
  style.textContent = cssContent[theme] || cssContent.default
  document.head.appendChild(style)
}

const DEFAULT_OPTIONS_LINK_ATTRIBUTES = {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
}
const DEFAULT_OPTIONS_KATEX = { throwOnError: false, errorColor: '#cc0000' }
const DEFAULT_OPTIONS_TASKLISTS = null
const DEFAULT_OPTIONS_GITHUBTOC = {
  tocFirstLevel: 2,
  tocLastLevel: 3,
  tocClassName: 'toc',
  anchorLinkSymbol: '',
  anchorLinkSpace: false,
  anchorClassName: 'anchor',
  anchorLinkSymbolClassName: 'octicon octicon-link'
}
const DEFAULT_OPTIONS_MERMAID = {
  theme: 'default'
}
const DEFAULT_OPTIONS_IMAGE = {
  hAlign: 'left',
  viewer: true
}


export default defineComponent({
  name: 'MarkdownItVueStreaming',
  components: { ImageViewer },
  props: {
    content: {
      type: String,
      default: ''
    },
    streaming: {
      type: Boolean,
      default: true
    },
    cursorChar: {
      type: String,
      default: '▎'
    },
    theme: {
      type: String,
      default: 'auto',
      validator: (val) => ['light', 'dark', 'auto'].includes(val)
    },
    options: {
      type: Object,
      default() {
        return {
          markdownIt: {
            linkify: true
          },
          linkAttributes: DEFAULT_OPTIONS_LINK_ATTRIBUTES,
          katex: DEFAULT_OPTIONS_KATEX,
          tasklists: DEFAULT_OPTIONS_TASKLISTS,
          githubToc: DEFAULT_OPTIONS_GITHUBTOC,
          mermaid: DEFAULT_OPTIONS_MERMAID
        }
      }
    }
  },
  emits: ['render-complete', 'chunk-rendered'],
  setup(props, { emit, expose }){
    const options = computed(() => props.options || {});

    const markdownItOpts = computed(() => options.value?.markdownIt || { linkify: true });
    const linkAttributesOpts = computed(() => options.value?.linkAttributes || DEFAULT_OPTIONS_LINK_ATTRIBUTES);
    const katexOpts = computed(() => options.value?.katex || DEFAULT_OPTIONS_KATEX);
    const tasklistsOpts = computed(() => options.value?.tasklists ?? DEFAULT_OPTIONS_TASKLISTS);
    const githubTocOpts = computed(() => options.value?.githubToc || DEFAULT_OPTIONS_GITHUBTOC);
    const imageOpts = computed(() => options.value?.image || DEFAULT_OPTIONS_IMAGE);
    const mermaidOpts = computed(() => options.value?.mermaid || DEFAULT_OPTIONS_MERMAID);

    const markdownRef = ref(null);
    const index = ref(0);
    const showViewer = ref(false);
    const optImage = reactive({ ...(imageOpts.value || DEFAULT_OPTIONS_IMAGE) });
    optImage.urlSet = new Set();
    const optMermaid = mermaidOpts.value || DEFAULT_OPTIONS_MERMAID
    const data = reactive({
      urlList: [],
    });

    // Streaming state
    const renderedHtml = ref('')
    const pendingText = ref('')
    let lastContentLength = 0
    let streamingRenderer = null

    // Setup code copy functionality
    let cleanupCopy = null

    onMounted(() => {
      if (markdownRef.value) {
        cleanupCopy = setupCodeCopy(markdownRef.value)
      }
    })

    onUnmounted(() => {
      cleanupCopy?.()
    })

    // Watch for theme changes (immediate: true handles initial load)
    watch(() => props.theme, (newTheme) => {
      loadThemeStylesheet(newTheme)
    }, { immediate: true })

    const md = new MarkdownIt(markdownItOpts.value || {})
      .use(MarkdownItEmoji)
      .use(MarkdownItSubscript)
      .use(MarkdownItSuperscript)
      .use(MarkdownItFootnote)
      .use(MarkdownItDeflist)
      .use(MarkdownItAbbreviation)
      .use(MarkdownItInsert)
      .use(MarkdownItMark)
      .use(MarkdownItHighlight)
      .use(MarkdownItLatex)
      .use(MarkdownItSourceMap)
      .use(MarkdownItMermaid, optMermaid)
      .use(MarkdownItEcharts)
      .use(MarkdownItFlowchart)
      .use(MarkdownItLinkAttributes, linkAttributesOpts.value)
      .use(MarkdownItKatex, katexOpts.value)
      .use(MarkdownItTasklists, tasklistsOpts.value)
      .use(MarkdownItFontAwsome)
      .use(MarkdownItGithubToc, githubTocOpts.value)
      .use(MarkdownItImage, optImage)
      .use(MarkdownItContainer, 'warning', {
        validate: function(params) {
          return params.trim() === 'warning'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-warning"><svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-warning">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'info', {
        validate: function(params) {
          return params.trim() === 'info'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-info"><svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0 4.4-3.6 8-8 8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-info">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'success', {
        validate: function(params) {
          return params.trim() === 'success'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-success"><svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-success">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'error', {
        validate: function(params) {
          return params.trim() === 'error'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon = `<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-error"><svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>`
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-error">${icon}`
          } else {
            return '</div>'
          }
        }
      })

    // Initialize streaming renderer
    streamingRenderer = createStreamingRenderer(md)

    // Track processed elements to avoid re-processing
    const processedElements = new Set()

    // Helper to process dynamic content rendering (echarts, mermaid, flowchart)
    const processDynamicContent = () => {
      // render echarts
      document.querySelectorAll('.md-echarts').forEach(element => {
        if (processedElements.has(element)) return
        try {
          let options = JSON.parse(element.textContent)
          let chart = echarts.init(element)
          chart.setOption(options)
          processedElements.add(element)
        } catch (e) {
          // Don't show error for incomplete JSON during streaming - it will be re-rendered when complete
          if (!e.message.includes('Unexpected end')) {
            element.outerHTML = `<pre>echarts complains: ${e}</pre>`
          }
        }
      })
      // render mermaid - only process unprocessed elements
      const mermaidElements = document.querySelectorAll('.mermaid')
      const unprocessedMermaid = []
      mermaidElements.forEach(el => {
        if (!processedElements.has(el)) {
          unprocessedMermaid.push(el)
        }
      })
      if (unprocessedMermaid.length > 0) {
        try {
          mermaid.init(undefined, unprocessedMermaid)
          unprocessedMermaid.forEach(el => processedElements.add(el))
        } catch (e) {
          // Silently ignore mermaid errors during streaming
        }
      }
      // render flowchart
      document.querySelectorAll('.md-flowchart').forEach(element => {
        if (processedElements.has(element)) return
        try {
          let code = element.textContent
          let chart = flowchart.parse(code)
          element.textContent = ''
          chart.drawSVG(element)
          processedElements.add(element)
        } catch (e) {
          if (!e.message.includes('Unexpected end')) {
            element.outerHTML = `<pre>flowchart complains: ${e}</pre>`
          }
        }
      })
    }

    // Helper to update URL list for image viewer
    const updateUrlList = () => {
      let list = []
      for (const i of optImage.urlSet) {
        list.push(i)
      }
      data.urlList = list
    }

    // Watch content changes for streaming
    watch(() => props.content, (val) => {
      // Content was cleared - reset renderer
      if (val.length === 0) {
        optImage.urlSet.clear()
        processedElements.clear()
        renderedHtml.value = ''
        pendingText.value = ''
        lastContentLength = 0
        streamingRenderer.reset()
        return
      }

      // Content was replaced (shorter than before) - reset and re-render
      if (val.length < lastContentLength) {
        optImage.urlSet.clear()
        processedElements.clear()
        streamingRenderer.reset()
        lastContentLength = 0
        // Re-process entire content
        const result = streamingRenderer.append(val)
        renderedHtml.value = result.html
        pendingText.value = result.pending
        lastContentLength = val.length
        nextTick(() => {
          processDynamicContent()
          updateUrlList()
          emit('chunk-rendered')
        })
        return
      }

      // Normal streaming - append only new content
      const appended = val.slice(lastContentLength)
      lastContentLength = val.length

      if (appended) {
        const result = streamingRenderer.append(appended)
        renderedHtml.value = result.html
        pendingText.value = result.pending

        nextTick(() => {
          processDynamicContent()
          updateUrlList()
          emit('chunk-rendered')
        })
      }
    }, { immediate: true })

    // Watch streaming state - finalize when streaming ends
    watch(() => props.streaming, (isStreaming) => {
      if (!isStreaming) {
        const result = streamingRenderer.finalize()
        renderedHtml.value = result.html
        pendingText.value = ''

        nextTick(() => {
          processDynamicContent()
          updateUrlList()
          emit('render-complete')
        })
      }
    })

    // methods
    const use = (plugin, options) => {
      md.use(plugin, options)
    }

    const get = () => {
       return md
    }

    const closeViewer = () => {
      showViewer.value = false
    }

    const hdlClick = (e) => {
      if (optImage.viewer && e.target.tagName == 'IMG') {
        index.value = data.urlList.indexOf(e.target.src) || 0
        showViewer.value = true
      }
    }

    expose({
      use,
      get
    })

    return {
      markdownRef,
      showViewer,
      index,
      ...toRefs(data),
      hdlClick,
      closeViewer,
      renderedHtml,
      pendingText
    }
  }
})
</script>

<style lang="scss" scoped>
.streaming-markdown {
  position: relative;
}

.markdown-body {
  overflow-x: auto;
}

.streaming-cursor {
  display: inline-block;
  animation: blink 1s infinite;
  margin-left: 5px;
  vertical-align: text-bottom;
}

.streaming-pending {
  opacity: 0.5;
  font-style: italic;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}
</style>

<style lang="scss">
/* Global styles for alert containers (same as markdown-it-vue.vue) */
.markdown-it-vue-alter-info {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
}
.markdown-it-vue-alert-icon-info {
  color: #1890ff;
}
.markdown-it-vue-alter-success {
  border: 1px solid #b7eb8f;
  background-color: #f6ffed;
}
.markdown-it-vue-alert-icon-success {
  color: #52c41a;
}
.markdown-it-vue-alter-error {
  border: 1px solid #f5222d;
  background-color: #fff1f0;
}
.markdown-it-vue-alert-icon-error {
  color: #f5222d;
}
.markdown-it-vue-alter-warning {
  border: 1px solid #ffe58f;
  background-color: #fffbe6;
}
.markdown-it-vue-alert-icon-warning {
  color: #faad14;
}
.markdown-it-vue-alter {
  border-radius: 0;
  border: 0;
  margin-bottom: 0;
  display: inline-flex;
  font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  box-sizing: border-box;
  padding: 0;
  list-style: none;
  position: relative;
  padding: 8px 15px 8px 37px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
}
.markdown-it-vue-alter p {
  margin-bottom: 2px;
}

.markdown-it-vue-alert-icon {
  top: 11.5px;
  left: 16px;
  position: absolute;
}
</style>
