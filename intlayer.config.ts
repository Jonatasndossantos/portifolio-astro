import type { IntlayerConfig } from "intlayer";
import { syncJSON } from "@intlayer/sync-json-plugin";
import { locales, defaultLocale } from "./src/i18n/config";

const config: IntlayerConfig = {
    internationalization: {
        locales: [...locales],
        defaultLocale: defaultLocale,
    },
    plugins: [
        /**
         * Syncs and auto-translates the flat JSON files in src/dictionaries/.
         *
         * Source of truth: src/dictionaries/<namespace>.json
         * Format: { "en": {...}, "pt": {...}, ... }
         *
         * Run `npx intlayer fill` to auto-translate empty locales via AI.
         * Run `npx intlayer dictionaries list` to verify discovered files.
         */
        syncJSON({
            /**
             * Maps: key=concept path, locale=locale code
             * Result: src/dictionaries/fullstack/hero/en.json
             *         src/dictionaries/shared/theme/pt.json
             *
             * intlayer dictionaries list  → lists all discovered JSON files
             * intlayer dictionaries fill  → auto-translates missing locales
             * intlayer dictionaries push  → pushes to Intlayer CMS
             * intlayer dictionaries pull  → pulls from Intlayer CMS
             */
            source: ({ key, locale }) => `./src/dictionaries/${key}/${locale}.json`,
        }),
    ],
    ai: {
        provider: "openai",
        model: "gpt-4o",
        apiKey: process.env.OPENAI_API_KEY,
    },
};

export default config;