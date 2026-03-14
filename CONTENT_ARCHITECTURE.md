# Verdant Visual: Content Architecture & Second Brain Graph

This document details the architectural decisions, Astro Content Collections setup, and the interactive Knowledge Graph implementation powering the portfolio.

## Core Philosophy

Verdant Visual moves beyond traditional software developer portfolios (which typically organize by rigid "Frontend" or "Backend" categories) towards an interconnected **Second Brain**. By using a flexible taxonomy of `topics` and `tags`, the portfolio functions like an Obsidian vault, dynamically generating relationships and visualizing them via a D3.js Knowledge Graph.

## 1. Directory Structure

The content is statically generated using **Astro Content Collections** stored in `src/content/`:

- `projects/`: Showcases of work (Case Studies).
- `blog/`: Articles, tutorials, and Second Brain notes.
- `services/`: Professional offerings (e.g., "Cloud Architecture", "Fullstack Development").
- `topics/`: High-level domains (e.g., "Software Engineering", "Artificial Intelligence").
- `tags/`: Specific technologies or tools (e.g., "React", "AWS").

## 2. Relationships & Taxonomy

We abandoned the numeric `relevance: { frontend: 10, backend: 8 }` system in favor of Astro's `reference()` API.

### How it works (Frontmatter):
Inside any `.mdx` file, you link entities using arrays of IDs.

```yaml
---
title: "Public Docs AI"
relatedTopics:
  - "software-engineering"
  - "artificial-intelligence"
tags:
  - "react"
  - "aws"
relatedServices:
  - "cloud-architecture"
---
```

Because these are explicit Astro references, `getEntry()` or `getEntries()` guarantees type-safety and builds actual data relationships.

## 3. The Interactive Knowledge Graph (D3.js)

The interactive Knowledge Graph visually maps the entire markdown ecosystem.

### A. The JSON API (`src/pages/graph.json.ts`)
This Build-Time (SSG) endpoint iterates through every single item in the `src/content/` folder using `getCollection()`.

It returns a strict JSON payload required by Graphing libraries:
- **`nodes`**: Each Markdown file is a node with an `id`, `group`, `label`, and automatically calculated `weight`.
- **`links`**: The explicit connections extracted from the Frontmatter (e.g., A Project linked to a Topic).

***Mathematical Weight***: The API automatically counts how many `links` point to or from a specific node (`weight`). This makes popular technologies naturally appear larger in the UX.

### B. The Component (`src/components/GraphIsland.astro`)
This Astro Island runs exclusively on the Client-Side.

- **Library**: `d3-force` and `d3-zoom` (from the `d3` package).
- **Physics**: It uses a physical simulation (`forceManyBody`, `forceLink`) to repel disconnected nodes and attract related ones.
- **Node Sizing Math**: Uses `8 + Math.sqrt(weight) * 4` (The exact algorithm used in popular Second Brain vaults like `ssp.sh`) to scale node radius non-linearly.
- **Coloring**: Nodes and Links are colored using explicit Hex Strings mapped by their `group` to avoid SVG browser CSS-Variable limitations.

## 4. Wiki-Links (Obsidian Style)

The application uses `remark-wiki-link` inside `astro.config.mjs`.

When writing content inside MDX files, you can use the syntax `[[Link Name]]` instead of standard markdown links `[Link Name](/path)`. Astro will automatically parse this during the build phase and convert it into a functional anchor tag pointing to the correct Second Brain node, enabling frictionless, thought-driven writing.

## 5. Internationalization (i18n)

We employ a dual-strategy for translations to maximize Developer Experience (DX) while keeping the bundle at zero JS.

### A. Small UI Strings (JSON Dictionaries)
For buttons, nav items, and generic UI text we use a custom Laravel-style `__` translator. These strings are stored in `src/dictionaries/ui/[locale].json`.

```astro
---
import { useTranslator } from "@i18n";
const __ = await useTranslator(Astro.props.lang);
---
<a href="/">{__('Home')}</a>
```

### B. Deep Content (Astro Content Collections & Markdown)
Articles, Service Pages, and Projects are written purely in `.md` or `.mdx` separated by locale folders (`src/content/blog/pt/my-post.md` & `src/content/blog/en/my-post.md`).

**The Fallback System**: To never punish users with 404 pages natively, Astro is configured to gracefully fallback if a translation is missing. If an English user requests an untranslated Portuguese post, they will see the Portuguese content with a warning alert banner at the top, ensuring the website feels fully cohesive even while translations are pending.
