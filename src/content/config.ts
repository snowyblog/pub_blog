import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    hidden: z.boolean().default(false),
    draft: z.boolean().default(false),
    recommend: z.boolean().default(true),
  }),
});

export const collections = { blog };
