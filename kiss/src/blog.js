import md from './md.js'
import m from 'mithril'
import './theme/hljs.css'
import './theme/md.less'
import './theme/style.less'

const domain = window.location.hostname === '127.0.0.1' ? './.site' : '.'

const Layout = function (content) {
  return m('.container', [
    Header,
    m('main', content),
    Footer
  ])
}

const Header = m('header', [
  m('nav.navigation', [
    m('.menu', m.trust('<svg aria-hidden="true" class="octicon octicon-three-bars" height="24" version="1.1" viewBox="0 0 12 16" width="18"><path fill-rule="evenodd" d="M11.41 9H.59C0 9 0 8.59 0 8c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zm0-4H.59C0 5 0 4.59 0 4c0-.59 0-1 .59-1H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1h.01zM.59 11H11.4c.59 0 .59.41.59 1 0 .59 0 1-.59 1H.59C0 13 0 12.59 0 12c0-.59 0-1 .59-1z"></path></svg>')),
    m('img[src="https://avatars2.githubusercontent.com/u/5530205?v=3&s=20"]', {style: {height: '27px', width: '27px'}}),
    m('input[type=checkbox].dummy#show-menu', {style: {opacity: 0}}),
    m('label.wrap[for="show-menu"]', m('aside', [
      m('a', { href: '/', oncreate: m.route.link }, '首页'),
      m('a', { href: '/projects', oncreate: m.route.link }, '项目'),
      m('a', { href: '/slides', oncreate: m.route.link }, 'Slides'),
      m('a', { href: '/about', oncreate: m.route.link }, '关于')
    ]))
  ])
])

const Footer = m('footer', [
  m('.copy-right', '© 2017 lwdgit'),
  m('.links', [
    m('a', { href: 'https://github.com/lwdgit/' }, 'Github'),
    m('a', { href: 'mailto:lwdggm@gmail.com?subject=Hello world' }, 'Gmail')
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
    return Layout([
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
    ])
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
    return Layout(this.posts.map(function (item) {
      return m('.posts', {}, [
        m('.cell', {}, [
          m('.head', [
            m('h3', [
              m('a.title', {href: '/' + item.url, oncreate: m.route.link}, item.title)
            ])
          ]),
          m('.meta', [
            m('span.date', item.date),
            m('span.category', item.category)
          ]),
          m('.text.markdown-body', m.trust(md(item.summary)))
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
      return Layout(
        m('.about.markdown-body', m.trust(this.about))
      )
    }
  },
  '/projects': {
    oninit () {
      window.location.href = 'https://github.com/lwdgit?utf8=%E2%9C%93&tab=repositories&q=&type=source&language='
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
