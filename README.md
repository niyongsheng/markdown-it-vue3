# markdown-it-vue3

> Vue 3 markdown rendering library based on [markdown-it](https://github.com/markdown-it/markdown-it)

## Install

```bash
npm install markdown-it-vue3
```

## Usage

```vue
<template>
  <markdown-it-vue :content="content" />
</template>

<script>
import MarkdownItVue from 'markdown-it-vue3'
import 'markdown-it-vue3/dist/markdown-it-vue3.css'

export default {
  components: { MarkdownItVue },
  data() {
    return { content: '# Hello World' }
  }
}
</script>
```

## Light Version

Smaller bundle without Mermaid, ECharts, Flowchart:

```javascript
import MarkdownItVueLight from 'markdown-it-vue3/dist/markdown-it-vue3-light'
import 'markdown-it-vue3/dist/markdown-it-vue3-light.css'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | String | `''` | Markdown content |
| options | Object | `{}` | Configuration |

## Options

```javascript
{
  markdownIt: { linkify: true },
  katex: { throwOnError: false },
  githubToc: { tocFirstLevel: 2, tocLastLevel: 3 },
  mermaid: { theme: 'default' },
  image: { viewer: true }
}
```

## Features

- Emoji, Subscript, Superscript, Footnotes
- Task lists, Definition lists
- KaTeX/LaTeX math
- Mermaid, ECharts, Flowchart diagrams
- Code highlighting
- Image viewer
- Alert containers: `::: success/info/warning/error`

## License

[MIT](https://github.com/niyongsheng/markdown-it-vue3/blob/main/LICENSE)
