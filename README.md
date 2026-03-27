# markdown-it-vue3
[![npm version](https://img.shields.io/npm/v/markdown-it-vue3)](https://www.npmjs.com/package/markdown-it-vue3)
[![license](https://img.shields.io/npm/l/markdown-it-vue3)](https://www.npmjs.com/package/markdown-it-vue3)
[![vue 3](https://img.shields.io/badge/vue-3.x-42b883)](https://vuejs.org/)


> A Vue 3 markdown rendering component support streaming, built on top of [markdown-it](https://github.com/markdown-it/markdown-it)<br>
> Vue3 版本的 markdown 渲染组件支持流式输出，基于 markdown-it，参考 [ravenq/markdown-it-vue](https://github.com/ravenq/markdown-it-vue)

## Features

- Emoji, Subscript, Superscript, Footnotes
- Task lists, Definition lists
- KaTeX/LaTeX math
- Mermaid, ECharts, Flowchart diagrams
- Code highlighting
- Image viewer
- Alert containers: `::: success/info/warning/error`
- **Streaming support** for AI chat scenarios

* Demo: https://niyongsheng.github.io/markdown-it-vue3/

## Install

```bash
npm install markdown-it-vue3
```

## Usage

### Static Markdown

```vue
<template>
  <MarkdownItVue :content="content" />
</template>

<script setup>
import MarkdownItVue from 'markdown-it-vue3'
import 'markdown-it-vue3/dist/markdown-it-vue3.css'

const content = '# Hello World'
</script>
```

### Streaming Markdown (AI Chat)

```vue
<template>
  <MarkdownItVueStreaming
    :content="streamContent"
    :streaming="isStreaming"
    @render-complete="onComplete"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MarkdownItVueStreaming } from 'markdown-it-vue3'
import 'markdown-it-vue3/dist/markdown-it-vue3.css'

const streamContent = ref('')
const isStreaming = ref(false)
</script>
```

> 📖 **See [example](./example) for complete implementation**

## License

[MIT](https://github.com/niyongsheng/markdown-it-vue3/blob/main/LICENSE)
