import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// 博客内容集合 — 扫描 src/content/blog/ 下所有 .mdx 文件
const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z.object({
    // 文章标题
    title: z.string(),
    // URL slug，手动指定，全局唯一
    slug: z.string(),
    // 发布日期
    date: z.date(),
    // 标签列表，可选
    tags: z.array(z.string()).default([]),
    // 文章简介，用于首页列表展示
    description: z.string().optional(),
    // 隐藏文章：不在首页列表中出现，但可通过 URL 直接访问
    hidden: z.boolean().default(false),
    // 草稿：完全不生成页面，开发环境也不显示
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
