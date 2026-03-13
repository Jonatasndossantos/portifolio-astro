# Jõnatas — Portfolio

Welcome to the **Portfolio**! This is a cutting-edge, highly optimized, and interactive developer portfolio built with modern web standards.

## ✨ Key Features

- **🚀 Astro Built**: Zero-JS by default architecture for incredible SEO and load times.
- **🎨 DaisyUI 5 & TailwindCSS**: A beautifully crafted UI system featuring a native **Theme Controller**. Switch instantly between dozens of themes (Light, Dark, Cyberpunk, Retro, etc.) with a single click.
- **🌍 Native Internationalization (i18n)**: Fully translated paths and localized JSON dictionaries. Supports English, Portuguese, Spanish, French, Chinese, Japanese, and British English out of the box.
- **📱 Fully Responsive & Accessible (A11y)**: Features a robust DaisyUI mobile `drawer` navigation. Passes strict Axe-core accessibility audits with semantic HTML, `aria-labels`, and screen-reader optimizations.
- **🧊 Interactive 3D (Spline)**: Uses the native Vanilla JS / Web Component `<spline-viewer>` for loading interactive 3D assets natively on the canvas, keeping bundle sizes tiny compared to heavy React wrappers.
- **📜 Smooth Scrolling**: Powered by `Lenis` (Studio Freight) for a buttery-smooth, hardware-accelerated scroll experience natively injected into the Astro Layout.

## 🗂️ Project Structure

The project relies on an organized `src/` directory to manage its assets, dictionaries, and layouts:

```text
/src
├── assets/          # Global CSS and Tailwind directives
├── components/      # UI Components (Islands, Layouts)
│   ├── islands/     # Interactive sections like the Hero
│   └── layout/      # Core app shell components (NavBar, Footer, Icons)
├── dictionaries/    # Content strings separated by language (en.json, pt.json...)
├── i18n/            # Internationalization helper utilities
├── layouts/         # High-level HTML structure (Lenis setup, Meta tags)
└── pages/           # Astro file-based routing and localized dynamic routes
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs all project dependencies.               |
| `npm run dev`             | Starts the local dev server at `localhost:4321`. |
| `npm run build`           | Builds the production static site to `./dist/`.  |
| `npm run preview`         | Previews your build locally before deploying.    |
| `npm run astro ...`       | Run CLI commands like `astro add` or `astro check`. |

## 🛠️ Modifying the Content

1. **Translations**: To edit bio, roles, or names, update the files inside `src/dictionaries/[locale].json`.
2. **Themes**: Open `src/components/ui/ThemeToggle.astro` to add or remove DaisyUI themes from the dropdown list.
3. **3D Models**: Open `Hero.astro` and swap the URL inside the `<spline-viewer>` component.

---
*Built with Astro, Tailwind, DaisyUI, and a lot of ☕.*
