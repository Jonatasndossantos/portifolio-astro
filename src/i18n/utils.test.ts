import { describe, it, expect, vi } from "vitest";
import { getLangFromUrl, getPathWithoutLocale, useTranslatedPath } from "./utils";

vi.mock("astro:i18n", () => {
    return {
        getRelativeLocaleUrl: (locale: string, path: string) => {
            return `/${locale}/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
        }
    };
});

describe("i18n utils", () => {
    describe("getLangFromUrl", () => {
        it("should return the locale from a URL", () => {
            const url = new URL("https://example.com/pt/about");
            expect(getLangFromUrl(url)).toBe("pt");
        });

        it("should return the default locale if no locale is present in the URL", () => {
            const url = new URL("https://example.com/about");
            expect(getLangFromUrl(url)).toBe("en");
        });

        it("should return the default locale if an invalid locale is in the URL", () => {
            const url = new URL("https://example.com/invalid/about");
            expect(getLangFromUrl(url)).toBe("en");
        });

        it("should return the default locale for the root URL", () => {
            const url = new URL("https://example.com/");
            expect(getLangFromUrl(url)).toBe("en");
        });

        it("should handle double slashes gracefully returning default if parsed poorly", () => {
            const url = new URL("https://example.com//pt/about");
            expect(getLangFromUrl(url)).toBe("en");
        });
    });

    describe("useTranslatedPath", () => {
        it("should return a function that translates paths for the given language", () => {
            const translatePath = useTranslatedPath("pt");
            expect(translatePath("about")).toBe("/pt/about");
        });

        it("should allow overriding the language for a specific path", () => {
            const translatePath = useTranslatedPath("pt");
            expect(translatePath("about", "es")).toBe("/es/about");
        });

        it("should strip leading slashes from paths", () => {
            const translatePath = useTranslatedPath("fr");
            expect(translatePath("/projects")).toBe("/fr/projects");
        });

        it("should handle empty paths", () => {
            const translatePath = useTranslatedPath("en");
            expect(translatePath("")).toBe("/en");
        });
    });

    describe("getPathWithoutLocale", () => {
        it("should strip a supported locale from the start of a path", () => {
            expect(getPathWithoutLocale("/pt/about")).toBe("/about");
            expect(getPathWithoutLocale("/en/projects")).toBe("/projects");
            expect(getPathWithoutLocale("/fr/contact")).toBe("/contact");
            expect(getPathWithoutLocale("/es/")).toBe("/");
            expect(getPathWithoutLocale("/zh/docs")).toBe("/docs");
            expect(getPathWithoutLocale("/ja/home")).toBe("/home");
            expect(getPathWithoutLocale("/en-GB/")).toBe("/");
        });

        it("should return the original path if it does not start with a locale", () => {
            expect(getPathWithoutLocale("/about")).toBe("/about");
            expect(getPathWithoutLocale("/projects")).toBe("/projects");
            expect(getPathWithoutLocale("/")).toBe("/");
            expect(getPathWithoutLocale("/unknown/about")).toBe("/unknown/about");
        });

        it("should return the original path if the locale is not at the start", () => {
            expect(getPathWithoutLocale("/about/pt")).toBe("/about/pt");
            expect(getPathWithoutLocale("/projects/en/details")).toBe("/projects/en/details");
        });

        it("should handle empty paths", () => {
            expect(getPathWithoutLocale("")).toBe("/");
        });

        it("should handle just the locale", () => {
            expect(getPathWithoutLocale("/pt")).toBe("/");
        });

        it("should ensure returning root path when stripping leaves it empty", () => {
            // this matches the logic return stripped === "" ? "/" : stripped;
            expect(getPathWithoutLocale("/pt")).toBe("/");
        });
    });
});
