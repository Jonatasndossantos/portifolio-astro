import { describe, it, expect, vi } from "vitest";

// Mock astro:i18n package which is virtual in Astro
vi.mock("astro:i18n", () => {
    return {
        getRelativeLocaleUrl: (locale: string, path: string) => {
            return `/${locale}/${path}`;
        }
    };
});

// Mock the JSON dictionary files
vi.mock("../dictionaries/ui/en.json", () => ({ default: { "welcome": "Welcome", "nested": { "title": "Dashboard" } } }));
vi.mock("../dictionaries/portfolio/en.json", () => ({ default: { "project": "Project" } }));
vi.mock("../dictionaries/profile/en.json", () => ({ default: { "greeting": "Hello, :name" } }));

import { mergeDeep, flattenObject, useTranslator } from "./index";

describe("i18n module", () => {
    describe("mergeDeep", () => {
        it("should merge nested objects without mutating parameters", () => {
            const target = { a: 1, nested: { b: 2, c: 3 } };
            const source = { nested: { c: 4, d: 5 } };
            const result = mergeDeep(target, source);
            expect(result).toEqual({ a: 1, nested: { b: 2, c: 4, d: 5 } });
            expect(target.nested.c).toBe(3);
        });
    });

    describe("flattenObject", () => {
        it("should flatten deep objects using dot notation", () => {
            const obj = {
                a: "value",
                nested: {
                    b: "value2",
                    deep: {
                        c: "value3"
                    }
                }
            };
            const flat = flattenObject(obj);
            expect(flat).toEqual({
                "a": "value",
                "nested.b": "value2",
                "nested.deep.c": "value3"
            });
        });
    });

    describe("useTranslator", () => {
        it("should load and merge dictionary values", async () => {
            const __ = await useTranslator("en");
            expect(__("welcome")).toBe("Welcome");
            expect(__("nested.title")).toBe("Dashboard");
            expect(__("project")).toBe("Project");
        });

        it("should interpolate replacement variables", async () => {
            const __ = await useTranslator("en");
            expect(__("greeting", { name: "Jhon" })).toBe("Hello, Jhon");
        });

        it("should return the key if translation is missing", async () => {
            const __ = await useTranslator("en");
            expect(__("missing.key")).toBe("missing.key");
        });
    });
});
