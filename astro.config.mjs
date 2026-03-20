// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import remarkWikiLink from "remark-wiki-link";

import { locales } from "./src/i18n/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://jonatasndossantos.com", // Placeholder, change to actual domain
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: "en",
    locales: [...locales],
    routing: {
      prefixDefaultLocale: false
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
  integrations: [sitemap(), react(), mdx(), icon()]
});