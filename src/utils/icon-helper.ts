import fs from 'node:fs';
import path from 'node:path';

/**
 * Utility to handle robust icon resolution and normalization for technology icons.
 * Handles common tech aliases, case sensitivity, and falls back gracefully between
 * different icon sets (simple-icons, logos, lucide).
 */

const COMMON_ALIASES: Record<string, string> = {
    "azure": "microsoftazure",
    "c#": "csharp",
    "c++": "cplusplus",
    "nodejs": "nodedotjs",
    "node.js": "nodedotjs",
    "node": "nodedotjs",
    "next.js": "nextdotjs",
    "nextjs": "nextdotjs",
    "vue.js": "vuedotjs",
    "vuejs": "vuedotjs",
    "reactjs": "react",
    "tailwind": "tailwindcss",
    "sass": "sass",
    "postgres": "postgresql",
    "postgresql": "postgresql",
    "mysql": "mysql",
    "mongodb": "mongodb",
    "express": "express",
    "nestjs": "nestjs",
    "dotenv": "dotenv",
    "laravel": "laravel",
    "symfony": "symfony",
    "google-cloud": "googlecloud",
    "gcp": "googlecloud",
    "aws": "amazonaws",
    // AI Aliases
    "gemini": "googlegemini",
    "chatgpt": "openai",
    "claude": "anthropic",
};

/**
 * Cache for icon set keys to avoid re-reading large JSON files
 */
const iconSetsCache: Record<string, Set<string>> = {};

/**
 * Resolves path to the icons.json file in node_modules
 */
function findIconSetPath(packageName: string): string {
    const pathsToTry = [
        path.join(process.cwd(), 'node_modules', `@iconify-json`, packageName, 'icons.json'),
        path.join(process.cwd(), '..', '..', 'node_modules', `@iconify-json`, packageName, 'icons.json'),
    ];
    return pathsToTry.find(p => fs.existsSync(p)) || '';
}

/**
 * Reads and parses the keys from icons.json
 */
function readIconSetKeys(filePath: string): Set<string> {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    return new Set(Object.keys(data.icons || {}));
}

/**
 * Lazily loads icon keys from an @iconify-json package
 */
export function getIconSet(packageName: string): Set<string> | null {
    if (iconSetsCache[packageName]) {
        return iconSetsCache[packageName];
    }

    try {
        const filePath = findIconSetPath(packageName);
        if (!filePath) return null;
        
        const keys = readIconSetKeys(filePath);
        iconSetsCache[packageName] = keys;
        return keys;
    } catch (e) {
        console.warn(`[icon-helper] Failed to load icon set: ${packageName}`, e);
        return null;
    }
}

/**
 * Maps a category to a default Lucide icon fallback
 */
export const getFallbackIcon = (category: string): string => {
    switch (category?.toLowerCase()) {
        case "language":
            return "lucide:cpu";
        case "framework":
            return "lucide:globe";
        case "tool":
            return "lucide:terminal";
        case "cloud":
            return "lucide:cloud";
        case "data":
            return "lucide:database";
        case "ai":
            return "lucide:bot";
        default:
            return "lucide:cpu";
    }
};

interface IconProps {
    icon?: string;
    id: string;
    title: string;
    category: string;
}

/**
 * Normalizes user-facing icon name using common aliases
 */
export function normalizeIconName(icon?: string, id?: string, title?: string): string {
    const raw = (icon || id || title || "").toLowerCase();
    const clean = raw.replace(/\s+/g, "").replace(/\.js$/, "").replace(/\.ts$/, "");
    return COMMON_ALIASES[clean] || clean;
}

/**
 * Searches the loaded icon libraries for a normalized icon name
 */
function searchIconLibraries(normalizedName: string): string | null {
    const libraries = ["simple-icons", "logos", "lucide"];
    for (const lib of libraries) {
        const iconSet = getIconSet(lib);
        if (iconSet?.has(normalizedName)) {
            return `${lib}:${normalizedName}`;
        }
    }
    return null;
}

/**
 * Returns a safe icon name with the appropriate library prefix.
 * Tries simple-icons first, then logos, then lucide.
 */
export const getSafeIcon = ({ icon, id, title, category }: IconProps): string => {
    if (icon && icon.includes(":")) {
        return icon;
    }

    const normalized = normalizeIconName(icon, id, title);
    const resolved = searchIconLibraries(normalized);
    
    return resolved || getFallbackIcon(category);
};

/**
 * Returns a CDN URL for the resolved icon.
 * Useful for client-side rendering (e.g. D3/SVG image tags).
 */
export const getIconUrl = (resolvedIcon: string): string | undefined => {
    if (!resolvedIcon) return undefined;

    const [set, name] = resolvedIcon.split(':');
    return `https://api.iconify.design/${set}/${name}.svg?color=white`;
};
