# Mission Day China

mdc.17173.com 的全站纯静态备份，备份时间 2022-02-11+08:00，对网页文件作出了以下调整：

1. 去除了所有页面底部指向 http://js.17173.com/ping.js 与 http://log.17173.com/ping.gif 的 html tag
2. 保留了动态加载文章的功能，原文章列表获取接口所有数据以 json 文件形式缓存于 [menus](./menus) 目录。由于未缓存文章分类，所以去除了文章列表页的分类筛选功能
3. 缓存了网页中使用 `lh3.googleusercontent.com` `i*.17173cdn.com` `ue8.17173.itc.cn` 域名存储的静态资源文件
4. 修改 [article.js](./static/js/article.js#L70-L71) ，关闭了瀑布流动态加载的效果，以兼容竖屏设备的正常浏览
5. 将所有网页中使用域名调用的静态资源改为使用本地相对路径

备份者: 
- [@jshensh](https://github.com/jshensh)
