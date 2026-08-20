import { describe, it, expect, vi } from "vitest";
import { getLangFromUrl, getPathWithoutLocale, useTranslatedPath, showDefaultLang } from "./utils";

vi.mock("astro:i18n", () => {
    return {
        getRelativeLocaleUrl: (locale: string, path: string) => {
            return `/${locale}/${path}`;
        }
    };
});

describe("i18n utils", () => {
    describe("showDefaultLang", () => {
        it("should be false", () => {
            expect(showDefaultLang).toBe(false);
        });
    });

    describe("getLangFromUrl", () => {
        it("should return the correct language for supported locales", () => {
            const url = new URL("https://example.com/pt/about");
            expect(getLangFromUrl(url)).toBe("pt");
        });

        it("should return default locale (en) if locale is not supported", () => {
            const url = new URL("https://example.com/de/about");
            expect(getLangFromUrl(url)).toBe("en");
        });

        it("should return default locale (en) for root path", () => {
            const url = new URL("https://example.com/");
            expect(getLangFromUrl(url)).toBe("en");
        });
    });

    describe("useTranslatedPath", () => {
        it("should translate path correctly", () => {
            const translatePath = useTranslatedPath("pt");
            expect(translatePath("about")).toBe("/pt/about");
        });

        it("should remove leading slash before passing to getRelativeLocaleUrl", () => {
            const translatePath = useTranslatedPath("es");
            expect(translatePath("/contact")).toBe("/es/contact");
        });

        it("should use a different locale if passed", () => {
            const translatePath = useTranslatedPath("pt");
            expect(translatePath("about", "fr")).toBe("/fr/about");
        });
    });

    describe("getPathWithoutLocale", () => {
        it("should remove valid locale from path", () => {
            expect(getPathWithoutLocale("/en/about")).toBe("/about");
            expect(getPathWithoutLocale("/pt/blog/post")).toBe("/blog/post");
            expect(getPathWithoutLocale("/fr/")).toBe("/");
        });

        it("should return root when path is just a valid locale", () => {
            expect(getPathWithoutLocale("/en")).toBe("/");
            expect(getPathWithoutLocale("/pt")).toBe("/");
        });

        it("should handle en-GB locale", () => {
            expect(getPathWithoutLocale("/en-GB/contact")).toBe("/contact");
        });

        it("should not remove invalid locale or unrelated path segment", () => {
            expect(getPathWithoutLocale("/de/about")).toBe("/de/about");
            expect(getPathWithoutLocale("/english/about")).toBe("/english/about");
        });

        it("should return the same path if there is no locale prefix", () => {
            expect(getPathWithoutLocale("/about")).toBe("/about");
            expect(getPathWithoutLocale("/")).toBe("/");
            expect(getPathWithoutLocale("about")).toBe("about");
        });

        it("should not strip locale appearing later in the path", () => {
            expect(getPathWithoutLocale("/about/pt")).toBe("/about/pt");
            expect(getPathWithoutLocale("/projects/en/main")).toBe("/projects/en/main");
        });
    });
});
