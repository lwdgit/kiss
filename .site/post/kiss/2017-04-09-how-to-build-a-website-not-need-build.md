{
    "title": "如何使用 git-pages 托管一个不用build的动态网站？",
    "date": "2017-04-09",
    "tags": ["kiss"],
    "category": "kiss",
    "url": "post/kiss/2017-04-09-how-to-build-a-website-not-need-build.md",
    "id": "post/kiss/how-to-build-a-website-not-need-build",
    "content": "如何使用 git-pages 托管一个不用build的动态网站？\n\n用过不少的开源搭建博客的网站，其中不乏功能很强大，样式很精美的。但是觉得发布一篇博客非得clone下来编译一下，再提交到github是一件令人很不舒服的事，而托管到第三方平台编译麻烦且不划算，于是便萌生了利用`gitpages`自身的编译能力，将md生成为json文件的想法。\n\n于是 **kiss** 诞生了，数据接口目前有以下两个:\n    * `/posts/:page/` 文章列表，默认20个一页，`:page`表示页码，第一页页不用加`:page`参数\n    * `/post/:url` 文章路径，路径可以在`/posts`列表里面获取到\n\n\n按照 `jekyll`的约定，我们不得不把文章写在`_post`下，同时我们还需要防止`jekyll`对默认标记进行特殊处理。所以，建议在写文章时，将文章内容放在 {% raw %}和{% endraw %} 之间，像本文一样，如:\n\n```\n{% raw %}\n\n# 你的文章title\n\n你的文章正文。。。。。\n\n{% endraw %}\n```\n\n* 为什么要费这么大劲绕这么大弯生成一个json数据，官方不是有api?\n\n> * 官方api默认有调用次数限制，所以有一定程度的限制 \n> * 官方api时而会有变更，这样会有后期维护成本，其实基于github api的blog有不少，但现在可以搜得到的基本上挂掉了。而本博客系统采用的标准方式实现，不存在这种问题。\n\n* 是否可以支持跨域？\n\n> 跨域需要支持jsonp，而目前很难做真正的jsonp数据，后期考虑封装一套类jsonp调用库。\n\n* 为什么改了文件没有生效？\n\n> jekyll编译需要时间，时间长短视文件多少而定，一般生效时间为1-5分钟左右。当然也有可能是你的文章里面写了特定代码刚好符合jeylly语法规则，但是又出现了语法错误，这样便会导致编译不通过（编译不通过时会收到邮件提醒），所以建议在写文章时，将文章内容放在 {% raw %}和{% endraw %} 之间。\n\n"
    , "next": {
        "url": "post/%E6%9C%AA%E5%BD%92%E7%B1%BB/2017-04-22-JAS%E4%BD%BF%E7%94%A8%E8%A7%84%E8%8C%83.md",
        "title": "Jas使用规范",
        "date": "2017-04-22",
        "description": null
    }
    
}