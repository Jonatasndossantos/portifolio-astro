import { locales, defaultLocale } from './config';

export const showDefaultLang = false;

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (locales.includes(lang as any)) return lang;
    return defaultLocale;
}

export function useTranslatedPath(lang: string) {
    return function translatePath(path: string, l: string = lang) {
        return !showDefaultLang && l === defaultLocale ? path : `/${l}${path}`
    }
}

// Note: getRelativeLocaleUrl(locale, path)
// If path is already relative or absolute, we might need to be careful.
// Ideally usage: getRelativeLocaleUrl("pt", "about") -> /pt/about
// If current path is /en/about, we want /pt/about.
// Astro.url.pathname includes the locale if it's in the URL.
// We need to strip current locale from pathname before passing to getRelativeLocaleUrl, OR just pass the clean path.
// A simple regex to strip locale prefix might be safest if we aren't using named routes.
export function getPathWithoutLocale(pathname: string) {
    const localePattern = /^\/(?:en|pt|fr|es|zh|ja|en-GB)(?:\/|$)/;
    const stripped = pathname.replace(localePattern, "/");
    return stripped === "" ? "/" : stripped;
}