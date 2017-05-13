import marked from 'marked'
import hljs from './third_party/highlight.js'

const renderer = new marked.Renderer()

renderer.listitem = function (text) {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    text = text
    .replace(/^\s*\[ \]\s*/, '<input type="checkbox" disabled class="empty checkbox"> ')
    .replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked disabled class="checked checkbox icon"> ')
    return '<li style="list-style: none">' + text + '</li>'
  } else {
    return '<li>' + text + '</li>'
  }
}

marked.setOptions({
  renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight (code, lang) {
    if (!hljs) return
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value
      } catch (__) {}
    }
  }
})

// import MarkdownIt from 'markdown-it'
// import hljs from 'highlight.js'
// import MarkdownItLists from 'markdown-it-task-lists'
// import './hljs.css'

// const md = MarkdownIt({
//   html: true, // Enable HTML tags in source
//   xhtmlOut: true, // Use '/' to close single tags (<br />).
//   // This is only for full CommonMark compatibility.
//   breaks: true, // Convert '\n' in paragraphs into <br>
//   langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
//   // useful for external highlighters.
//   linkify: true, // Autoconvert URL-like text to links

//   // Enable some language-neutral replacement + quotes beautification
//   typographer: true,

//   // Double + single quotes replacement pairs, when typographer enabled,
//   // and smartquotes on. Could be either a String or an Array.
//   //
//   // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
//   // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
//   // quotes: '“”‘’',

//   // Highlighter function. Should return escaped HTML,
//   // or '' if the source string is not changed and should be escaped externaly.
//   // If result starts with <pre... internal wrapper is skipped.
//   highlight: function (str, lang) {
//     if (lang && hljs.getLanguage(lang)) {
//       try {
//         return hljs.highlight(lang, str).value
//       } catch (__) {}
//     }

//     return '' // use external default escaping
//   }
// }).use(MarkdownItLists)
// export default md.render.bind(md)
export default function (text) {
  return marked(text)
}
