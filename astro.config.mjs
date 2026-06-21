// @ts-check
import { defineConfig, sessionDrivers } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import preact from "@astrojs/preact";
import { remarkContainer } from "./src/plugins/remark-container.mjs";

// https://astro.build/config
export default defineConfig({
  // Astro v6 中 static 默认即 hybrid 行为：
  // 所有页面默认静态预渲染，加 export const prerender = false 的页面走服务端
  output: "static",
  // 部署到 Cloudflare Pages（D1 / KV 绑定后续按需添加）
  adapter: cloudflare({
    imageService: "compile",
  }),
  session: {
    driver: sessionDrivers.lruCache(),
  },

  site: "https://blog.snowptr.top",
  integrations: [mdx({
    remarkPlugins: [remarkMath, remarkContainer],
    rehypePlugins: [rehypeKatex],
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