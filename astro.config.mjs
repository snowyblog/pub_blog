// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // 部署后替换为你的 CF Pages 域名，例如 https://pub-blog.pages.dev
  site: "https://pub-blog.pages.dev",
  integrations: [
    mdx({
      // MDX 内代码块语法高亮
      syntaxHighlight: "shiki",
      shikiConfig: {
        theme: "github-light",
      },
    }),
    sitemap(),
  ],
});
