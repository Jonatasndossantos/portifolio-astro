import { describe, it, expect } from "vitest";
import { stripComments, slugify, extractHeadings } from "./headings";

describe("headings utility", () => {
    describe("stripComments", () => {
        it("should strip MDX comments", () => {
            const raw = "{/* this is a comment */}\n## Real Title";
            expect(stripComments(raw).trim()).toBe("## Real Title");
        });

        it("should strip HTML comments", () => {
            const raw = "<!-- comment -->## Real Title";
            expect(stripComments(raw).trim()).toBe("## Real Title");
        });
    });

    describe("slugify", () => {
        it("should normalize and slugify title text", () => {
            expect(slugify("Hello World!")).toBe("hello-world");
            expect(slugify("Ação e Reação")).toBe("acao-e-reacao");
        });
    });

    describe("extractHeadings", () => {
        it("should return empty list if body is empty or undefined", () => {
            expect(extractHeadings()).toEqual([]);
            expect(extractHeadings("")).toEqual([]);
        });

        it("should extract markdown headings at server time", () => {
            const markdown = `
# Heading 1 (ignored)
## Heading 2
Some text.
### Heading 3
            `;
            const result = extractHeadings(markdown);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ depth: 2, text: "Heading 2", slug: "heading-2" });
            expect(result[1]).toEqual({ depth: 3, text: "Heading 3", slug: "heading-3" });
        });

        it("should extract HTML/JSX headings", () => {
            const html = `
                <h2>JSX Heading 2</h2>
                <h3 class="some-class">JSX Heading 3</h3>
            `;
            const result = extractHeadings(html);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ depth: 2, text: "JSX Heading 2", slug: "jsx-heading-2" });
            expect(result[1]).toEqual({ depth: 3, text: "JSX Heading 3", slug: "jsx-heading-3" });
        });

        it("should keep the original order in headings output", () => {
            const mixed = `
                <h2>Second (HTML)</h2>
                ## First (MD)
            `;
            const result = extractHeadings(mixed);
            expect(result).toHaveLength(2);
            expect(result[0].text).toBe("Second (HTML)");
            expect(result[1].text).toBe("First (MD)");
        });
    });
});
