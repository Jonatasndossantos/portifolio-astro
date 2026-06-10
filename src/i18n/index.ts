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
    let file;
    try {
        file = await import(`../dictionaries/${key}/${locale}.json`);
    } catch {
        return fallback.default as T;
    }
    
    const mergeDeep = (target: any, source: any) => {
        const result = { ...target };
        for (const k of Object.keys(source)) {
            if (source[k] instanceof Object && !Array.isArray(source[k])) {
                result[k] = mergeDeep(result[k] || {}, source[k]);
            } else {
                result[k] = source[k] !== undefined ? source[k] : result[k];
            }
        }
        return result;
    };
    return mergeDeep(fallback.default, file.default) as T;
}

/**
 * Laravel-style translation helper for small UI strings.
 * Usage:
 *   const __ = await useTranslator(locale);
 *   __('Home')
 *   __('Welcome, :name', { name: 'Jhon' })
 */

const translatorCache = new Map<string, Record<string, any>>();

export async function useTranslator(locale: string) {
    if (!translatorCache.has(locale)) {
        const loadDict = async (name: string) => {
            try {
                return (await import(`../dictionaries/${name}/${locale}.json`)).default;
            } catch {
                return {};
            }
        };

        const ui = await loadDict('ui');
        const portfolio = await loadDict('portfolio');
        const profile = await loadDict('profile');

        const flattenObj = (ob: any, prefix = '') => {
            let result: any = {};
            for (const i in ob) {
                if ((typeof ob[i]) === 'object' && ob[i] !== null) {
                    Object.assign(result, flattenObj(ob[i], prefix + i + '.'));
                } else {
                    result[prefix + i] = ob[i];
                }
            }
            return result;
        };

        const mergedDict = { 
            ...flattenObj(ui), 
            ...flattenObj(portfolio), 
            ...flattenObj(profile) 
        };

        translatorCache.set(locale, mergedDict);
    }
    
    const mergedDict = translatorCache.get(locale)!;

    return function __(text: string, replacements?: Record<string, string>) {
        let result = mergedDict[text] || text;
        if (replacements) {
            for (const [key, value] of Object.entries(replacements)) {
                result = result.replace(new RegExp(`:${key}`, 'g'), value);
            }
        }
        return result;
    }
}
