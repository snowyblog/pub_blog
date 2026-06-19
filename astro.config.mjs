// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  // Astro v6 中 static 默认即 hybrid 行为：
  // 所有页面默认静态预渲染，加 export const prerender = false 的页面走服务端
  output: "static",
  // 部署到 Cloudflare Pages（D1 / KV 绑定后续按需添加）
  adapter: cloudflare({
    // 图片在构建时预处理，不依赖 CF Images 绑定
    imageService: "compile",
  }),
  // 部署后替换为你的 CF Pages 域名
  site: "https://pub-blog.pages.dev",
  integrations: [mdx({
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: "light",
    },
  }), sitemap(), preact()],
});