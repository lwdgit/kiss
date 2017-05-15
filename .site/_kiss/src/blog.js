import md from './md.js'
import m from 'mithril'
import './theme/hljs.css'
import './theme/md.less'
import './theme/style.less'

const meta = (function () {
  const _meta = {
    title: document.title
  }
  Array.prototype.forEach.call(document.querySelectorAll('meta'), function (item) {
    if (item.name) {
      _meta[item.name] = item.content
    }
  })
  return _meta
}())

const domain = window.location.hostname === '127.0.0.1' ? './.site' : ~meta.base.indexOf('{{') ? './data' : meta.base

const Layout = function (category, content, title) {
  return m('.container', [
    Header(category, title),
    m('main.' + category, content),
    Footer
  ])
}

let showMenu = false
const Header = (category, title = (meta.title || '极简博客')) => {
  document.title = title
  return m('header', [
    m('nav.navigation', [
      m('.menu.kissfont .kiss-menu', {
        onclick: () => { showMenu = true }
      }),
      m('.title', title),
      m('label.wrap', { class: showMenu && 'show', onclick: () => { showMenu = false } }, m('aside', [
        m('.header', [
          m('img', { src: meta.logo })
        ]),
        m('a', { href: '/', oncreate: m.route.link, class: category === 'posts' && 'active' }, [
          m('i.kissfont.kiss-home'),
          '首页'
        ]),
        m('a', { href: '/projects', oncreate: m.route.link, class: category === 'project' && 'active' }, [
          m('i.kissfont.kiss-project'),
          '项目'
        ]),
        m('a', { href: '/about', oncreate: m.route.link, class: category === 'about' && 'active' }, [
          m('i.kissfont.kiss-about'),
          '关于'
        ])
      ]))
    ])
  ])
}

const Footer = m('footer', [
  m('a.copy-right', { href: 'https://github.com/lwdgit/kiss' }, '© 2017 Kiss Blog'),
  m('.links', [
    m('a', { href: meta.github }, 'Github'),
    m('a', { href: 'mailto:' + meta.mail + '?subject=Hello world' }, 'Mail')
  ])
])

const Post = {
  inited: false,
  post: {},
  oninit: function (vnode, id) {
    m.request(domain + '/' + (!id ? 'post/' + vnode.attrs.category + '/' + vnode.attrs.id : vnode))
    .then(function (ret) {
      Post.post = ret
    })
  },
  view: function () {
    return Layout('post', [
      m('banner', [
        m('h3', m('.title', this.post.title))
      ]),
      m('.meta', [
        m('span.date', this.post.date),
        m('span.category', this.post.category)
      ]),
      m('article.markdown-body', m.trust(md(this.post.content || ''))),
      m('nav', [
        this.post.prev ? m('a', {href: '#!/' + this.post.prev.url, onclick: this.oninit.bind(null, this.post.prev.url)}, '上一篇:' + this.post.prev.title) : null,
        this.post.next ? m('a', {href: '#!/' + this.post.next.url, onclick: this.oninit.bind(null, this.post.next.url)}, '下一篇:' + this.post.next.title) : null
      ])
    ], this.post.title)
  }
}

const Posts = {
  posts: [],
  getData: function () {
    m.request(domain + '/page/', {mode: 'no-cors'}).then(function (ret) {
      Posts.posts = ret.posts
    })
  },
  oninit: function () {
    this.getData()
  },
  view: function (vnode) {
    return Layout('posts', this.posts.map(function (item) {
      return m('.cell', {
        'data-url': item.url
      }, [
        m('.head', [
          m('h3', [
            m('a.title', {
              href: '/' + item.url,
              oncreate: m.route.link
            }, item.title)
          ])
        ]),
        m('.text.markdown-body', m.trust(md(item.summary))),
        m('.meta', [
          m('span.date', item.date),
          m('span.category', item.category)
        ])
      ])
    }))
  }
}

m.route(document.body, '/', {
  '/': Posts,
  '/post/:category/:id': Post,
  '/about': {
    about: null,
    oninit () {
      const self = this
      m.request({
        url: domain + '/about.md',
        deserialize: ret => ret
      })
      .then(function (ret) {
        self.about = md(ret)
      })
    },
    view () {
      return Layout('about',
        m('.about.markdown-body', m.trust(this.about))
      )
    }
  },
  '/projects': {
    oninit () {
      window.location.href = meta.github + '?utf8=%E2%9C%93&tab=repositories&q=&type=source&language='
    },
    view () {}
  },
  '/slides': {
    oninit () {},
    view () {
      return Layout('This is undefined')
    }
  }
})
