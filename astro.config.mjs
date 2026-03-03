// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import remarkWikiLink from "remark-wiki-link";

import { locales, defaultLocale } from "./src/i18n/config";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321", // Placeholder, change to actual domain
  redirects: {
    "/en/": "/en/fullstack",
  },
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: defaultLocale,
    locales: [...locales],
    routing: {
      prefixDefaultLocale: true
    }
  },
  image: {
    domains: ["github.com", "images.unsplash.com"],
  },
  markdown: {
    remarkPlugins: [
      [remarkWikiLink, { pathFormat: 'relative', wikiLinkClassName: 'wiki-link text-primary underline' }]
    ]
  },
  integrations: [sitemap(), react(), mdx()]
});