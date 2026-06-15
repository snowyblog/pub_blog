# pub_blog — Astro 静态博客

## 项目概述

- **pub_blog**（公开仓库）：Astro v6 构建的静态博客站点，部署到 Cloudflare Pages
- **pri_blog**（私有仓库）：通过 git submodule 引入的 MDX 文章内容仓库，位于 `src/content/blog/`

## 技术栈

- **框架**：Astro v6（静态生成模式 SSG）
- **内容**：MDX（兼容 Markdown + JSX 组件）
- **样式**：极简文字风，CSS 变量驱动，留好暗色模式扩展点
- **部署**：Cloudflare Pages（HTTPS 子模块自动拉取）
- **子模块**：`https://github.com/snowyblog/pri_blog.git` → `src/content/blog/`

## 项目结构

```
pub_blog/
├── src/
│   ├── pages/
│   │   ├── index.astro          # / 首页文章列表
│   │   ├── [slug].astro         # /:slug 文章详情动态路由
│   │   └── rss.xml.js           # /rss.xml RSS 订阅
│   ├── content/
│   │   ├── blog/                # submodule → pri_blog（MDX 文章）
│   │   └── config.ts            # 博客 collection schema 定义
│   ├── components/
│   │   └── PostCard.astro       # 首页文章卡片组件
│   ├── layouts/
│   │   └── Base.astro           # 全站页面外壳（head/导航/footer）
│   └── styles/
│       └── global.css           # 全局样式 + CSS 变量
├── astro.config.mjs             # Astro 配置（集成、站点 URL、代码高亮）
├── package.json
└── tsconfig.json
```

## 内容仓库结构（pri_blog）

```
pri_blog/
├── 2024/
│   ├── hello-world.mdx
│   └── intro.mdx
└── 2025/
    └── new-post.mdx
```

年份文件夹自动被 Astro collection 递归扫描，无需额外注册。

## 文章 Frontmatter 规范

```yaml
---
title: "文章标题"           # 必填
slug: "article-slug"        # 必填，决定 URL /article-slug
date: 2024-03-15            # 必填，发布日期
tags: ["tech", "astro"]     # 可选，标签列表
description: "文章简介"     # 可选，首页卡片展示
hidden: false               # 可选，true 时不在首页列表出现
draft: false                 # 可选，true 时不生成页面
---
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 构建生产版本 → `dist/` |
| `npm run preview` | 预览构建结果 |

## 更新内容流程

1. 在 pri_blog 仓库添加/编辑 MDX 文章
2. Push 到 GitHub
3. 在 pub_blog 本地运行 `git submodule update --remote`
4. Push 后 CF Pages 自动构建部署

或在 pri_blog 仓库添加 GitHub Action，push 时通过 CF Deploy Hook 自动触发重建。

## 代码约定

- 所有代码注释使用中文
- 组件命名用 PascalCase，文件用 .astro
- 样式优先使用 CSS 变量（`--color-*`），便于后续主题切换
- 新增功能先在 `src/components/` 放组件，页面只做组装

## 未来扩展预留

| 功能 | 预留位置 | 状态 |
|------|----------|------|
| 暗色模式 | CSS 变量 `:root` 覆盖 | 样式层已就绪 |
| 标签筛选页 | `/tags/[tag].astro` | 待实现 |
| 加密文章 | frontmatter `encrypted: true` + JS 解密组件 | 待实现 |
| 统计后台 | `/analytics` + `/functions/` + CF D1 | 待实现 |
| 评论系统 | CF D1 + `/functions/comments/` | 待实现 |
| 全文搜索 | Pagefind 或 Fuse.js | 待评估 |
