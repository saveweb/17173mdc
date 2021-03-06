# Mission Day China

mdc.17173.com 的全站纯静态备份，备份时间 2022-02-11+08:00，对网页文件作出了以下调整：

1. 去除了所有页面底部指向 `http://js.17173.com/ping.js` 与 `http://log.17173.com/ping.gif` 的 html tag
2. 保留了动态加载文章的功能，原文章列表获取接口所有数据以 json 文件形式缓存于 [menus](./menus) 目录。由于未缓存文章分类，所以去除了文章列表页的分类筛选功能
3. 缓存了网页中使用 `lh3.googleusercontent.com` `i*.17173cdn.com` `ue8.17173.itc.cn` 域名存储的静态资源文件
4. 修改 [article.js](./static/js/article.js#L70-L71) ，关闭了瀑布流动态加载的效果，以兼容竖屏设备的正常浏览
5. 将所有网页中使用域名调用的静态资源改为使用本地相对路径

浏览存档网页:
- http://mdc.17173.imjs.work/ on @jshensh's server.
- https://17173mdc.archive.othing.xyz/ on Github Pages(sync this repo).
- https://archive-ingress-mdc.of.sb/  host by @laosb 

备份者: 
- [@jshensh](https://github.com/jshensh)

---
## 什么是 Ingress？

《Ingress》是Niantic工作室于2013年推出的基于位置服务（LBS）的增强虚拟现实（AR）游戏，载体为移动终端（手机、平板电脑等）。玩家在游戏中扮演一名特工（Agent），选择加入相互对抗的两个阵营之一，为了地球的未来而战斗。由于玩家需要频繁在户外活动并经常与其他玩家交互，可以实现强身健体并结识更多朋友的目的。绝大多数玩家表示借助Ingress认识到了许多前所未见的新风景。

## 什么是 Mission Day？

这是Ingress官方与活动当地旅游局共同组织的大型活动，玩家来到指定城市，自行选择完成数个指定任务以获得相应奖牌（往往靠步行或骑行）。任务的目的地均为精心设计，在完成任务过程中你通常会欣赏到著名风景，或许还会结缘无名浪漫。

## 什么是 17173.com？

17173为游戏玩家提供导购、资讯、攻略、论坛等全游戏生命周期内的一站式服务，为游戏发行商提供综合营销解决方案，是面向游戏玩家、运营商、发行商的矩阵化、多平台、综合性游戏媒体群。 
