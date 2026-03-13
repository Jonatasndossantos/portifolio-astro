import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Taxonomy Collections (The main nodes of our Graph)
const topics = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/topics" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional()
    })
});

const tags = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tags" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        category: z.enum([
            "language",
            "framework",
            "tool",
            "cloud",
            "data",
            "ai"
        ]),
        relevance: z.record(z.string(), z.number()).optional() // e.g. { fullstack: 10, frontend: 2 }
    })
});

// Main Content Collections
const projects = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        repoUrl: z.string().url().optional(),
        demoUrl: z.string().url().optional(),
        heroImage: z.string().optional(),

        // Obsidian-like Connections (The Edges)
        relatedTopics: z.array(reference('topics')).optional(),
        tags: z.array(reference('tags')).optional(),

        // Direct References
        relatedServices: z.array(reference('services')).optional(),
        relatedPosts: z.array(reference('blog')).optional(),
    })
});

const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        draft: z.boolean().default(false),

        // Obsidian-like Connections
        relatedTopics: z.array(reference('topics')).optional(),
        tags: z.array(reference('tags')).optional(),

        // Direct References
        relatedProject: reference('projects').optional(),
        ctaService: reference('services').optional(),
    })
});

const services = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/services" }),
    schema: z.object({
        title: z.string(),
        icon: z.string().optional(),
        priceStartingAt: z.number().optional(),

        // Obsidian-like Connections
        relatedTopics: z.array(reference('topics')).optional(),
    })
});

export const collections = {
    topics,
    tags,
    projects,
    blog,
    services
};
