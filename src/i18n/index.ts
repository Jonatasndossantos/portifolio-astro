/**
 * i18n utility — loads dictionaries from src/dictionaries/<key>/<locale>.json
 *
 * Usage in .astro pages:
 *   import { getTranslations } from '@i18n';
 *   const nav     = await getTranslations(locale, 'nav');
 *   const profile = await getTranslations(locale, 'profile');
 *
 * Folder structure (FLAT — no subfolders, key = folder name directly):
 *   src/dictionaries/
 *     nav/
 *       en.json   ← { "title": "Multiverse Portfolio", ... }
 *       pt.json
 *     profile/
 *       en.json   ← { "greeting": "Hi", "bio": { "fullstack": "..." }, ... }
 *       pt.json
 */

export * from './config';
export * from './utils';

type FlatDictionary = Record<string, unknown>;

/**
 * Deep merges a source dictionary into a target dictionary.
 * Does not mutate parameters.
 *
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 */
export function mergeDeep(target: FlatDictionary, source: FlatDictionary): FlatDictionary {
    const result = { ...target };
    for (const k of Object.keys(source)) {
        const sourceVal = source[k];
        const targetVal = result[k];
        if (sourceVal instanceof Object && !Array.isArray(sourceVal)) {
            const nestedTarget = (targetVal instanceof Object && !Array.isArray(targetVal)) ? targetVal as FlatDictionary : {};
            result[k] = mergeDeep(nestedTarget, sourceVal as FlatDictionary);
        } else {
            result[k] = sourceVal !== undefined ? sourceVal : targetVal;
        }
    }
    return result;
}

/**
 * Returns the translated dictionaries for a given locale and namespace key.
 * Falls back to 'en' if the requested locale file doesn't exist.
 *
 * @param locale    - BCP 47 locale code matching the filename (e.g. 'pt', 'en', 'en-GB')
 * @param key       - Concept path inside src/dictionaries/ (e.g. 'fullstack/hero', 'shared/nav')
 */
export async function getTranslations<T extends FlatDictionary = FlatDictionary>(
    locale: string,
    key: string
): Promise<T> {
    const fallback = await import(`../dictionaries/${key}/en.json`);
    try {
        const file = await import(`../dictionaries/${key}/${locale}.json`);
        return mergeDeep(fallback.default, file.default) as T;
    } catch {
        return fallback.default as T;
    }
}

/**
 * Flattens a nested object into a flat key-value dictionary with dot-notation keys.
 *
 * @param ob - The object to flatten
 * @param prefix - Prefix for nested keys
 */
export function flattenObject(ob: FlatDictionary, prefix = ''): Record<string, string> {
    let result: Record<string, string> = {};
    for (const i in ob) {
        if (Object.prototype.hasOwnProperty.call(ob, i)) {
            const val = ob[i];
            if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                Object.assign(result, flattenObject(val as FlatDictionary, `${prefix}${i}.`));
            } else {
                result[`${prefix}${i}`] = String(val ?? '');
            }
        }
    }
    return result;
}

/**
 * Asynchronously loads a namespace dictionary for a specific locale.
 * Falls back to an empty object if loading fails.
 */
async function loadLocaleDictionary(name: string, locale: string): Promise<FlatDictionary> {
    try {
        const module = await import(`../dictionaries/${name}/${locale}.json`);
        return module.default as FlatDictionary;
    } catch {
        return {};
    }
}

/**
 * Laravel-style translation helper for small UI strings.
 * Usage:
 *   const __ = await useTranslator(locale);
 *   __('Home')
 *   __('Welcome, :name', { name: 'Jhon' })
 */

const translatorCache = new Map<string, Record<string, string>>();

export async function useTranslator(locale: string): Promise<(text: string, replacements?: Record<string, string>) => string> {
    if (!translatorCache.has(locale)) {
        const ui = await loadLocaleDictionary('ui', locale);
        const portfolio = await loadLocaleDictionary('portfolio', locale);
        const profile = await loadLocaleDictionary('profile', locale);
        translatorCache.set(locale, {
            ...flattenObject(ui),
            ...flattenObject(portfolio),
            ...flattenObject(profile)
        });
    }
    const mergedDict = translatorCache.get(locale)!;
    return (text: string, replacements?: Record<string, string>): string => {
        let result = mergedDict[text] || text;
        if (!replacements) return result;
        for (const [key, value] of Object.entries(replacements)) {
            result = result.replace(new RegExp(`:${key}`, 'g'), value);
        }
        return result;
    };
}
