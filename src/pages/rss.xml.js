// rss.xml.js — 生成 RSS 订阅源
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Blog",
    description: "雪的日记",
    site: "https://blog.snowptr.top",
    items: posts.map((post) => ({
      title: post.data.title,
      link: `/${post.data.slug}`,
      description: post.data.description ?? "",
      pubDate: post.data.date,
      categories: post.data.tags,
    })),
  });
}
