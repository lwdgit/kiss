# Kiss Blog

Kiss(Keep it simple stupid.)极简博客系统。

访问路径: https://lwdgit.github.io/kiss 。

## 特色

1. 极易使用, fork过去就行
2. 文章发布时无需编译，只接上传github仓库就行
3. 对前端极其友好，无需了解Jekyll(ruby)语法，即可进行二次开发。
4. 支持PWA特性。(添加到桌面，离线缓存，全屏启动）PWA特性评分100分。详见 :https://pwa-directory.appspot.com/pwas/5743532287459328
5. 易于拓展。以github.io做为数据后台，可以方便地为App提供数据接口。目前已经实现微信小程序版。微信搜索: 夜第七章 即可体验。

## 实现方式

  利用GitPages自身的编译能力，将markdown文件转义成便于传输与解析的json文件。


## 开发

> git clone https://github.com/lwdgit/kiss
> cd kiss
> yarn start
> yarn run open http://127.0.0.1:8080/app.html

## LICENSE

[MIT](./LICENSE)