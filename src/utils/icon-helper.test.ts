import { describe, it, expect, vi } from "vitest";
import { getFallbackIcon, normalizeIconName, getSafeIcon, getIconUrl, getIconSet } from "./icon-helper";

// Mock filesystem to simulate packages in node_modules
vi.mock("node:fs", () => {
    return {
        default: {
            existsSync: (p: string) => {
                return p.includes("simple-icons") || p.includes("logos") || p.includes("lucide") || p.includes("corrupted-package");
            },
            readFileSync: (p: string) => {
                if (p.includes("corrupted-package")) {
                    return "invalid json {";
                }
                if (p.includes("simple-icons")) {
                    return JSON.stringify({ icons: { "react": {}, "nodedotjs": {} } });
                }
                if (p.includes("logos")) {
                    return JSON.stringify({ icons: { "laravel": {} } });
                }
                if (p.includes("lucide")) {
                    return JSON.stringify({ icons: { "cpu": {}, "bot": {} } });
                }
                return "{}";
            }
        }
    };
});

describe("icon-helper utility", () => {
    describe("getFallbackIcon", () => {
        it("should return the correct fallback icon depending on category", () => {
            expect(getFallbackIcon("language")).toBe("lucide:cpu");
            expect(getFallbackIcon("ai")).toBe("lucide:bot");
            expect(getFallbackIcon("unknown")).toBe("lucide:cpu");
        });
    });

    describe("normalizeIconName", () => {
        it("should normalize name and apply aliases", () => {
            expect(normalizeIconName("ReactJS")).toBe("react");
            expect(normalizeIconName("Node.js")).toBe("nodedotjs");
            expect(normalizeIconName("Laravel")).toBe("laravel");
        });
    });

    describe("getSafeIcon", () => {
        it("should return directly if icon already has prefix", () => {
            expect(getSafeIcon({ icon: "custom:my-icon", id: "1", title: "My Icon", category: "tool" })).toBe("custom:my-icon");
        });

        it("should resolve simple-icons if key exists", () => {
            expect(getSafeIcon({ icon: "react", id: "1", title: "React", category: "framework" })).toBe("simple-icons:react");
        });

        it("should resolve logos if key exists", () => {
            expect(getSafeIcon({ icon: "laravel", id: "1", title: "Laravel", category: "framework" })).toBe("logos:laravel");
        });

        it("should resolve lucide as a fallback if key exists", () => {
            expect(getSafeIcon({ icon: "bot", id: "1", title: "Bot", category: "ai" })).toBe("lucide:bot");
        });

        it("should fall back to category default if not found in any library", () => {
            expect(getSafeIcon({ icon: "non-existent", id: "1", title: "None", category: "ai" })).toBe("lucide:bot");
        });
    });

    describe("getIconUrl", () => {
        it("should return correct API URL for resolved icon", () => {
            expect(getIconUrl("logos:laravel")).toBe("https://api.iconify.design/logos/laravel.svg?color=white");
            expect(getIconUrl("")).toBeUndefined();
        });
    });

    describe("getIconSet", () => {
        it("should successfully load an icon set", () => {
            const keys = getIconSet("logos");
            expect(keys).toBeInstanceOf(Set);
            expect(keys?.has("laravel")).toBe(true);
        });

        it("should return null for non-existent package", () => {
            const keys = getIconSet("non-existent-package");
            expect(keys).toBeNull();
        });

        it("should catch errors, log warning, and return null on invalid JSON", () => {
            const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
            const keys = getIconSet("corrupted-package");

            expect(consoleSpy).toHaveBeenCalledWith(
                "[icon-helper] Failed to load icon set: corrupted-package",
                expect.any(Error)
            );
            expect(keys).toBeNull();

            consoleSpy.mockRestore();
        });
    });
});
