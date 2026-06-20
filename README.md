# 个人作品集与博客

一个无需构建工具的静态个人网站，可直接部署到 Cloudflare Pages。

## 本地预览

直接打开 `index.html`，或在当前目录启动任意静态文件服务器。

## 修改内容

- 个人介绍、作品与文章：编辑 `index.html`
- 三篇文章正文：编辑 `posts/` 目录下对应的 HTML 文件
- 全部文章归档：编辑 `articles.html`；新增文章时在这里补一条文章记录
- 全部作品与分类：编辑 `works.html`，摄影图片存放在 `assets/works/`
- 作品浮窗中的标题、说明、图片与项目信息：编辑 `works.js` 顶部的 `projects`
- 文章阅读页样式：编辑 `article.css`
- 颜色、字体和布局：编辑 `styles.css` 顶部的变量
- 将示例中的 `hello@example.com`、社交链接与 `#` 替换为你的真实信息

## Cloudflare Pages 部署

连接这个代码仓库后，将构建命令留空，输出目录填写 `/` 即可。
