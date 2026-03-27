import 'highlight.js/styles/atom-one-light.css'
import hljs from 'highlight.js/lib/core'
import Bash from 'highlight.js/lib/languages/bash'
import C from 'highlight.js/lib/languages/c'
import Cpp from 'highlight.js/lib/languages/cpp'
import Csharp from 'highlight.js/lib/languages/csharp'
import Css from 'highlight.js/lib/languages/css'
import Dart from 'highlight.js/lib/languages/dart'
import Dockerfile from 'highlight.js/lib/languages/dockerfile'
import Fsharp from 'highlight.js/lib/languages/fsharp'
import Go from 'highlight.js/lib/languages/go'
import Groovy from 'highlight.js/lib/languages/groovy'
import Handlebars from 'highlight.js/lib/languages/handlebars'
import Haskell from 'highlight.js/lib/languages/haskell'
import Ini from 'highlight.js/lib/languages/ini'
import Java from 'highlight.js/lib/languages/java'
import Javascript from 'highlight.js/lib/languages/javascript'
import Json from 'highlight.js/lib/languages/json'
import Julia from 'highlight.js/lib/languages/julia'
import Kotlin from 'highlight.js/lib/languages/kotlin'
import Lisp from 'highlight.js/lib/languages/lisp'
import Lua from 'highlight.js/lib/languages/lua'
import Makefile from 'highlight.js/lib/languages/makefile'
import Markdown from 'highlight.js/lib/languages/markdown'
import Matlab from 'highlight.js/lib/languages/matlab'
import Objectivec from 'highlight.js/lib/languages/objectivec'
import Perl from 'highlight.js/lib/languages/perl'
import Php from 'highlight.js/lib/languages/php'
import Plaintext from 'highlight.js/lib/languages/plaintext'
import Powershell from 'highlight.js/lib/languages/powershell'
import Python from 'highlight.js/lib/languages/python'
import R from 'highlight.js/lib/languages/r'
import Ruby from 'highlight.js/lib/languages/ruby'
import Rust from 'highlight.js/lib/languages/rust'
import Scala from 'highlight.js/lib/languages/scala'
import Scheme from 'highlight.js/lib/languages/scheme'
import Shell from 'highlight.js/lib/languages/shell'
import Sql from 'highlight.js/lib/languages/sql'
import Swift from 'highlight.js/lib/languages/swift'
import Typescript from 'highlight.js/lib/languages/typescript'
import Xml from 'highlight.js/lib/languages/xml'
import Yaml from 'highlight.js/lib/languages/yaml'
import Diff from 'highlight.js/lib/languages/diff'

// Register languages
hljs.registerLanguage('bash', Bash)
hljs.registerLanguage('c', C)
hljs.registerLanguage('cpp', Cpp)
hljs.registerLanguage('c++', Cpp)
hljs.registerLanguage('csharp', Csharp)
hljs.registerLanguage('cs', Csharp)
hljs.registerLanguage('css', Css)
hljs.registerLanguage('dart', Dart)
hljs.registerLanguage('dockerfile', Dockerfile)
hljs.registerLanguage('fsharp', Fsharp)
hljs.registerLanguage('fs', Fsharp)
hljs.registerLanguage('go', Go)
hljs.registerLanguage('golang', Go)
hljs.registerLanguage('groovy', Groovy)
hljs.registerLanguage('handlebars', Handlebars)
hljs.registerLanguage('hbs', Handlebars)
hljs.registerLanguage('haskell', Haskell)
hljs.registerLanguage('hs', Haskell)
hljs.registerLanguage('ini', Ini)
hljs.registerLanguage('toml', Ini)
hljs.registerLanguage('java', Java)
hljs.registerLanguage('javascript', Javascript)
hljs.registerLanguage('js', Javascript)
hljs.registerLanguage('json', Json)
hljs.registerLanguage('julia', Julia)
hljs.registerLanguage('kotlin', Kotlin)
hljs.registerLanguage('kt', Kotlin)
hljs.registerLanguage('lisp', Lisp)
hljs.registerLanguage('lua', Lua)
hljs.registerLanguage('makefile', Makefile)
hljs.registerLanguage('mk', Makefile)
hljs.registerLanguage('markdown', Markdown)
hljs.registerLanguage('md', Markdown)
hljs.registerLanguage('matlab', Matlab)
hljs.registerLanguage('objectivec', Objectivec)
hljs.registerLanguage('objc', Objectivec)
hljs.registerLanguage('perl', Perl)
hljs.registerLanguage('pl', Perl)
hljs.registerLanguage('php', Php)
hljs.registerLanguage('plaintext', Plaintext)
hljs.registerLanguage('text', Plaintext)
hljs.registerLanguage('powershell', Powershell)
hljs.registerLanguage('ps1', Powershell)
hljs.registerLanguage('python', Python)
hljs.registerLanguage('py', Python)
hljs.registerLanguage('r', R)
hljs.registerLanguage('ruby', Ruby)
hljs.registerLanguage('rb', Ruby)
hljs.registerLanguage('rust', Rust)
hljs.registerLanguage('rs', Rust)
hljs.registerLanguage('scala', Scala)
hljs.registerLanguage('scheme', Scheme)
hljs.registerLanguage('shell', Shell)
hljs.registerLanguage('sh', Shell)
hljs.registerLanguage('sql', Sql)
hljs.registerLanguage('swift', Swift)
hljs.registerLanguage('typescript', Typescript)
hljs.registerLanguage('ts', Typescript)
hljs.registerLanguage('xml', Xml)
hljs.registerLanguage('html', Xml)
hljs.registerLanguage('xhtml', Xml)
hljs.registerLanguage('svg', Xml)
hljs.registerLanguage('yaml', Yaml)
hljs.registerLanguage('yml', Yaml)
hljs.registerLanguage('diff', Diff)
hljs.registerLanguage('patch', Diff)

const COPY_ICON_SVG = `<svg class="copy-icon" viewBox="0 0 16 16" width="16" height="16">
  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
  <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
</svg>`

const CHECK_ICON_SVG = `<svg class="check-icon" viewBox="0 0 16 16" width="16" height="16" style="display:none">
  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
</svg>`

const highlightPlugin = md => {
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const code = token.content
    const lang = token.info
    const langObj = hljs.getLanguage(lang)
    let cnt
    if (langObj) {
      cnt = hljs.highlight(lang, code).value
    } else {
      cnt = hljs.highlightAuto(code).value
    }

    const copyBtn = `<button class="code-copy-btn" type="button" aria-label="Copy code">${COPY_ICON_SVG}${CHECK_ICON_SVG}</button>`

    return `<pre class="hljs">${copyBtn}<code>${cnt}</code></pre>`
  }
}

export default highlightPlugin
