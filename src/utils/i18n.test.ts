import { describe, it, expect } from "vitest";
import { getTrans } from "./i18n";

describe("getTrans", () => {
    it("returns primitive values directly", () => {
        expect(getTrans("hello", "en")).toBe("hello");
        expect(getTrans(42, "pt")).toBe(42);
        expect(getTrans(true, "fr")).toBe(true);
        expect(getTrans(null, "es")).toBe(null);
        expect(getTrans(undefined, "zh")).toBe(undefined);
    });

    it("returns the exact matching locale", () => {
        const content = { en: "Hello", pt: "Olá", fr: "Bonjour" };
        expect(getTrans(content, "pt")).toBe("Olá");
        expect(getTrans(content, "fr")).toBe("Bonjour");
        expect(getTrans(content, "en")).toBe("Hello");
    });

    it("falls back to 'en' when the exact locale is not found", () => {
        const content = { en: "Hello", fr: "Bonjour" };
        // "pt" is not in the object, should fall back to "en"
        expect(getTrans(content, "pt")).toBe("Hello");
    });

    it("falls back to the first available translation when neither exact nor 'en' is found", () => {
        const content = { pt: "Olá", fr: "Bonjour" };
        // "es" is not in object, "en" is not in object, should fall back to "Olá" (the first key)
        expect(getTrans(content, "es")).toBe("Olá");
    });

    it("recursively processes nested objects that are not translation objects", () => {
        const content = {
            title: { en: "My Title", pt: "Meu Título" },
            metadata: {
                description: { en: "Description", fr: "La description" },
                author: "John Doe"
            }
        };

        const resultPt = getTrans(content, "pt");
        expect(resultPt).toEqual({
            title: "Meu Título",
            metadata: {
                description: "Description", // falls back to 'en'
                author: "John Doe" // primitive value
            }
        });

        const resultFr = getTrans(content, "fr");
        expect(resultFr).toEqual({
            title: "My Title", // falls back to 'en'
            metadata: {
                description: "La description",
                author: "John Doe"
            }
        });
    });

    it("handles deeply nested translation objects correctly", () => {
        const content = {
            a: {
                b: {
                    c: {
                        en: "Deep English",
                        pt: "Deep Portuguese"
                    }
                }
            }
        };

        expect(getTrans(content, "pt")).toEqual({
            a: {
                b: {
                    c: "Deep Portuguese"
                }
            }
        });
    });
});
