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

const domain = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'https://lwdgit.github.io/kiss/' : ~(meta.base || '').indexOf('{{') ? './data' : meta.base

let firstLanuch = true
const Layout = function (category, content, title, index) {
  return m('.page', [
    Header(category, title, index),
    m('main.' + category, content),
    Footer
  ])
}

const store = {
  showMenu: false,
  post: {}
}

const Header = (category, title = (meta.title || '极简博客'), index = 0) => {
  document.title = title
  if (firstLanuch && category === 'post') {
    firstLanuch = false
  }

  return m('header', [
    m('nav.navigation', [
      m('.menu.kissfont', {
        class: index === 0 ? 'kiss-menu' : 'kiss-arrow-back',
        onclick: (e) => {
          if (index === 0) {
            store.showMenu = true
          } else {
            window.history.back()
          }
        }
      }),
      m('.title', title),
      m('label.wrap', {
        class: store.showMenu && 'show',
        onclick: () => {
          store.showMenu = false
        }
      }, m('aside', [
        m('.header', [
          m('img', { src: meta.logo })
        ]),
        m('a', {
          href: '/',
          oncreate: m.route.link,
          class: category === 'posts' && 'active'
        }, [
          m('i.kissfont.kiss-home'),
          '首页'
        ]),
        m('a', {
          href: '/about',
          oncreate: m.route.link,
          class: category === 'about' && 'active'
        }, [
          m('i.kissfont.kiss-about'),
          '关于'
        ]),
        m('a', {
          href: './admin'
        }, [
          m('i.kissfont.kiss-menu'),
          '管理'
        ])
      ]))
    ])
  ])
}

const links = []
if (meta.github) {
  links.push(m('a', {
      href: meta.github
  }, 'Github'))
}
if (meta.mail) {
  links.push(m('a', {
    href: 'mailto:' + meta.mail + '?subject=Hello world'
  }, 'Mail'))
}
links.push(m('a', {
  href: './admin'
}, '登录'))

const Footer = m('footer', [
  m('.links.left', [
    m('a.copy-right', {
      href: 'https://github.com/lwdgit/kiss'
    }, '© 2017 Kiss Blog')
  ]),
  m('.links', links)
])

const requestPost = function (attrs) {
  return m.request(domain + '/post/' + attrs.category + '/' + attrs.id)
  .then(ret => {
    store.post = ret
  })
}

const Post = {
  inited: false,
  view (vnode) {
    return Layout('post', [
      m('banner', [
        m('h3', m('.title', store.post.title))
      ]),
      m('.meta', [
        m('span.date', store.post.date),
        m('span.category', store.post.category)
      ]),
      m('article.markdown-body', m.trust(md(store.post.content || ''))),
      m('nav', [
        store.post.prev ? m('a', {
          href: '/' + store.post.prev.url,
          oncreate: m.route.link
        }, '上一篇:' + store.post.prev.title) : null,
        store.post.next ? m('a', {
          href: '/' + store.post.next.url,
          oncreate: m.route.link
        }, '下一篇:' + store.post.next.title) : null
      ])
    ], store.post.title, 1)
  }
}

const Posts = {
  posts: [],
  next: '/page/',
  loading: true,
  getData: function () {
    this.loading = true
    if (!this.next) return
    m.request(domain + this.next + '?' + Math.random(), {mode: 'no-cors'})
    .then((ret) => {
      this.posts = [...this.posts, ...ret.posts]
      this.next = ret.next
      this.loading = false
    })
  },
  onscrollEnd () {
    let container
    window.addEventListener('scroll', (e) => {
      if (this.loading) return
      container = container || document.querySelector('.posts')
      if (!container) {
        return
      }
      if (container.clientHeight + container.scrollTop > container.scrollHeight - 10) {
        this.getData()
      }
      document.body.scrollTop = 0
    })
  },
  oninit () {
    this.getData()
    this.onscrollEnd()
  },
  view (vnode) {
    const posts = this.posts.map(function (item) {
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
    })

    posts.push(
      m('.indicator', {
        style: {
          display: this.next ? '' : 'none'
        }
      }, m.trust(`
        <svg viewBox="0 0 32 32" width="32" height="32">
          <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
        </svg>
      `))
    )
    return Layout('posts', posts)
  }
}

const About = {
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
}

const Projects = {
  oninit () {
    window.location.href = meta.github + '?utf8=%E2%9C%93&tab=repositories&q=&type=source&language='
  },
  view () {}
}

m.route(document.body, '/', {
  '/': Posts,
  '/post/:category/:id': {
    onmatch (attrs) {
      requestPost(attrs)
    },
    render (vnode) {
      return m(Post)
    }
  },
  '/about': About,
  '/projects': Projects
})
