webpackJsonp([5,3],{0:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.router=void 0;var o=n(3),a=r(o),i=n(203),s=r(i),u=n(94),l=r(u);n(108);var c=n(193),d=r(c),f=n(76),h=r(f);n(110),a.default.use(s.default),a.default.use(l.default);var m=t.router=new s.default({routes:h.default,mode:"hash",linkActiveClass:"active"});m.beforeEach(function(e,t,n){if(e.matched.some(function(e){return e.meta.requiresAuth})){var r=localStorage.getItem("user")||sessionStorage.getItem("user");r||n({path:"/login",query:{redirect:e.fullPath}})}n()}),new a.default({render:function(e){return e(d.default)},router:m}).$mount("#app")},23:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(){localStorage.clear(),sessionStorage.clear()}Object.defineProperty(t,"__esModule",{value:!0}),t.user=t.repo=t.octo=void 0;var a=n(20),i=n(35),s=r(i),u={},l=null,c=null;try{t.user=u=JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"))}catch(e){o()}t.user=u=u||{},u.name?(t.octo=l=new s.default({username:u.name,password:a.Base64.decode(u.password)}),t.repo=c=l.repos(u.name,"blog")):o(),t.octo=l,t.repo=c,t.user=u},76:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(3),a=r(o),i=a.default.component("root",{template:"<router-view></router-view>"}),s=[{path:"/login",component:function(e){return n.e(1,function(t){var n=[t(197)];e.apply(null,n)}.bind(this))},name:"login",meta:{hidden:!0}},{path:"/404",component:function(e){return n.e(2,function(t){var n=[t(194)];e.apply(null,n)}.bind(this))},name:"404",meta:{requiresAuth:!0}},{path:"/",name:"root",component:i,meta:{requiresAuth:!0},children:[{path:"/",component:function(e){return n.e(0,function(t){var n=[t(196)];e.apply(null,n)}.bind(this))}},{path:"*",iconClass:"el-icon-document",type:"filelist"}]},{path:"*",redirect:{path:"/404"}}],u=s.length;s[u-2].children.forEach(function(e){e.children&&(e.meta||(e.meta={}),e.meta.children=e.children)}),t.default=s},77:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(195),a=r(o);t.default={data:function(){return{user:{name:"",avatar:""},activeMenu:""}},components:{Filelist:a.default},created:function(){this.activeMenu=this.$route.name,this.user=JSON.parse(localStorage.getItem("user"))||{}},watch:{$route:function(e,t){this.activeMenu=this.$route.name,this.user=JSON.parse(localStorage.getItem("user"))}},methods:{logout:function(){var e=this;this.$confirm("确定要注销吗?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"info"}).then(function(){localStorage.removeItem("user"),e.$router.push({path:"/login"})}).catch(function(){})}}}},78:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(23);t.default={data:function(){return{filelist:[],loading:!1}},created:function(){this.fetchFiles()},methods:{fetchFiles:function(){var e=this;this.loading=!0,r.octo.fromUrl("https://api.github.com/repos/"+r.user.name+"/blog/git/trees/gh-pages?recursive=1").fetch().then(function(e){return e.tree.filter(function(e){return/^_posts\/[^.].+\.md$/.test(e.path)})}).then(function(t){e.loading=!1,e.filelist=t.reverse()}).catch(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e.loading=!1,e.$message.error(/"message": "([^"]+)/m.test(t.message)&&RegExp.$1||t.toString())})},removeFile:function(e){var t=this;return this.$confirm("是否要删除此文章？").then(function(){return r.repo.contents(e.path).remove({message:"remove file",sha:e.sha})}).then(function(){return t.fetchFiles()}).catch(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.loading=!1,t.$message.error(/"message": "([^"]+)/m.test(e.message)&&RegExp.$1||e.toString())})},editFile:function(e){this.$router.push({path:"/",query:{path:e.path}})}},watch:{"$route.query":function(e){var t=this,n=e.path,r=e.update;r&&(setTimeout(function(){return t.fetchFiles()},800),this.$router.replace({path:"/",query:{path:n}}))}}}},108:function(e,t){},110:function(e,t){},111:function(e,t){},112:function(e,t){},193:function(e,t,n){n(112);var r=n(8)(n(77),n(200),null,null);e.exports=r.exports},195:function(e,t,n){n(111);var r=n(8)(n(78),n(198),null,null);e.exports=r.exports},198:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-table",{directives:[{name:"loading",rawName:"v-loading.body",value:e.loading,expression:"loading",modifiers:{body:!0}}],staticClass:"table",attrs:{data:e.filelist,height:"100%"}},[n("el-table-column",{attrs:{label:"我的文件夹"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-row",{attrs:{type:"flex",justify:"space-between"}},[n("div",{on:{click:function(n){e.editFile(t.row)}}},[e._v(e._s(t.row.path.split("/").slice(1).join("/")))]),e._v(" "),n("el-button",{attrs:{size:"small",icon:"delete",type:"text"},on:{click:function(n){e.removeFile(t.row)}}})],1)]}}])})],1)},staticRenderFns:[]}},200:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"db"},[e.$route.meta.hidden?[n("router-view")]:[n("header",{staticClass:"db-header"},[n("router-link",{staticClass:"logo",attrs:{to:{path:"/"}}},[e._v("Kiss博客管理系统")]),e._v(" "),e.user.name?n("div",{staticClass:"user-info"},[n("el-dropdown",{attrs:{trigger:"click"}},[n("span",{staticClass:"el-dropdown-link"},[n("span",[e._v(e._s(e.user.name))]),n("i",{staticClass:"el-icon-caret-bottom el-icon--right"})]),e._v(" "),n("el-dropdown-menu",{slot:"dropdown"},[n("el-dropdown-item",{nativeOn:{click:function(t){e.logout(t)}}},[e._v("注销")])],1)],1)],1):e._e()],1),e._v(" "),n("div",{staticClass:"db-body"},[n("aside",{staticClass:"db-menu-wrapper"},[n("el-menu",{staticClass:"db-menu-bar",attrs:{"default-active":e.activeMenu,router:""}},[e._l(e.$router.options.routes[e.$router.options.routes.length-2].children,function(t,r){return[t.children&&t.name?[n("el-submenu",{attrs:{index:t.name}},[n("template",{slot:"title"},[n("i",{class:t.iconClass}),e._v(e._s(t.name))]),e._v(" "),e._l(t.children,function(t,r){return n("el-menu-item",{key:t.name,attrs:{index:t.name,route:t}},[e._v(e._s(t.name))])})],2)]:e._e(),e._v(" "),!t.children&&t.name?[n("el-menu-item",{attrs:{index:t.name,route:t}},[n("i",{class:t.iconClass}),e._v(e._s(t.name))])]:e._e(),e._v(" "),"filelist"===t.type?[n("filelist")]:e._e()]})],2)],1),e._v(" "),n("div",{staticClass:"db-content-wrapper"},[n("section",{staticClass:"db-content"},[n("router-view")],1)])])]],2)},staticRenderFns:[]}}});
//# sourceMappingURL=app.3e1cab3b0c3075c9cc47.js.map