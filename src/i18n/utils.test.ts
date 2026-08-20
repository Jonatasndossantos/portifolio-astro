import { describe, it, expect, vi } from "vitest";
import { getLangFromUrl, useTranslatedPath, getPathWithoutLocale, showDefaultLang } from "./utils";
import { locales, defaultLocale } from "./config";

// Mock astro:i18n package which is virtual in Astro
vi.mock("astro:i18n", () => {
    return {
        getRelativeLocaleUrl: (locale: string, path: string) => {
            if (path === "") {
                return `/${locale}/`;
            }
            return `/${locale}/${path}`;
        }
    };
});

describe("i18n utils", () => {
    describe("getLangFromUrl", () => {
        it("should return the locale if it is present in the URL", () => {
            const supportedLocale = locales.find(l => l !== defaultLocale) || defaultLocale;
            const url = new URL(`https://example.com/${supportedLocale}/about`);
            expect(getLangFromUrl(url)).toBe(supportedLocale);
        });

        it("should return the default locale if the locale in URL is not supported", () => {
            const url = new URL("https://example.com/not-a-real-locale/about");
            expect(getLangFromUrl(url)).toBe(defaultLocale);
        });

        it("should return the default locale if there is no locale in the URL", () => {
            const url = new URL("https://example.com/about");
            expect(getLangFromUrl(url)).toBe(defaultLocale);
        });

        it("should return the default locale for the root URL", () => {
            const url = new URL("https://example.com/");
            expect(getLangFromUrl(url)).toBe(defaultLocale);
        });
    });

    describe("useTranslatedPath", () => {
        it("should return a function that translates paths", () => {
            const t = useTranslatedPath("en");
            expect(typeof t).toBe("function");
        });

        it("should translate path using the default provided locale", () => {
            const supportedLocale = locales.find(l => l !== defaultLocale) || defaultLocale;
            const t = useTranslatedPath(supportedLocale);
            expect(t("about")).toBe(`/${supportedLocale}/about`);
        });

        it("should strip leading slash from path before translation", () => {
            const t = useTranslatedPath("es");
            expect(t("/contact")).toBe("/es/contact");
        });

        it("should allow overriding the locale", () => {
            const t = useTranslatedPath("en");
            expect(t("about", "fr")).toBe("/fr/about");
        });

        it("should handle root paths properly", () => {
            const t = useTranslatedPath("ja");
            expect(t("/")).toBe("/ja/");
        });
    });

    describe("getPathWithoutLocale", () => {
        it("should strip supported locale from path", () => {
            const supportedLocale = locales.find(l => l !== defaultLocale) || defaultLocale;
            expect(getPathWithoutLocale(`/${supportedLocale}/about`)).toBe("/about");
            expect(getPathWithoutLocale("/en/contact")).toBe("/contact");
        });

        it("should handle paths that are exactly the locale", () => {
            expect(getPathWithoutLocale("/fr")).toBe("/");
            expect(getPathWithoutLocale("/ja/")).toBe("/");
        });

        it("should not strip unsupported locales", () => {
            expect(getPathWithoutLocale("/not-a-real-locale/about")).toBe("/not-a-real-locale/about");
        });

        it("should leave paths without locale intact", () => {
            expect(getPathWithoutLocale("/about")).toBe("/about");
            expect(getPathWithoutLocale("/")).toBe("/");
        });
    });

    describe("constants", () => {
        it("showDefaultLang should be false", () => {
            expect(showDefaultLang).toBe(false);
        });
    });
});
