import { describe, it, expect, vi } from "vitest";

// Mock astro:content package
vi.mock("astro:content", () => {
    return {
        getCollection: async (name: string) => {
            if (name === "topics") {
                return [{ id: "en/docker", data: { title: "Docker", category: "tool" } }];
            }
            if (name === "tags") {
                return [{ id: "en/typescript", data: { title: "TypeScript", category: "language" } }];
            }
            return [];
        }
    };
});

// Mock icon-helper
vi.mock("./icon-helper", () => {
    return {
        getSafeIcon: () => "lucide:cpu",
        getIconUrl: () => "/icons/cpu.svg"
    };
});

import {
    cleanGraphId,
    addNode,
    addLink,
    mapTaxonomyNodes,
    calculateWeights,
    filterFocalGraph,
    Node,
    Link
} from "../pages/graph.json";

describe("graph endpoint utilities", () => {
    describe("cleanGraphId", () => {
        it("should strip locale folder and file extension", () => {
            expect(cleanGraphId("pt/my-article.mdx")).toBe("my-article");
            expect(cleanGraphId("en/sub/topic.md")).toBe("sub/topic");
            expect(cleanGraphId("non-localized-file.md")).toBe("non-localized-file");
        });
    });

    describe("addNode & addLink", () => {
        it("should add node if not existing", () => {
            const nodes: Node[] = [];
            addNode(nodes, "node-1", "group-1", "Label 1");
            expect(nodes).toHaveLength(1);
            addNode(nodes, "node-1", "group-1", "Label 1");
            expect(nodes).toHaveLength(1);
        });

        it("should add link if not existing", () => {
            const links: Link[] = [];
            addLink(links, "src", "tgt");
            expect(links).toHaveLength(1);
            addLink(links, "src", "tgt");
            expect(links).toHaveLength(1);
        });
    });

    describe("mapTaxonomyNodes", () => {
        it("should transform collection items into graph nodes", () => {
            const nodes: Node[] = [];
            const mockTopics = [
                { id: "en/docker", data: { title: "Docker", category: "tool" } }
            ];
            mapTaxonomyNodes(nodes, mockTopics, []);
            expect(nodes).toHaveLength(1);
            expect(nodes[0]).toEqual({
                id: "topics/docker",
                group: "topics",
                label: "Docker",
                icon: "/icons/cpu.svg",
                hasRoute: true
            });
        });
    });

    describe("calculateWeights", () => {
        it("should sum degrees of nodes", () => {
            const nodes: Node[] = [
                { id: "n1", group: "g", label: "N1", hasRoute: true },
                { id: "n2", group: "g", label: "N2", hasRoute: true }
            ];
            const links: Link[] = [{ source: "n1", target: "n2" }];
            calculateWeights(nodes, links);
            expect(nodes[0].weight).toBe(1);
            expect(nodes[1].weight).toBe(1);
        });
    });

    describe("filterFocalGraph", () => {
        it("should isolate nodes linked to the focal node", () => {
            const nodes: Node[] = [
                { id: "focal", group: "g", label: "F", hasRoute: true },
                { id: "connected", group: "g", label: "C", hasRoute: true },
                { id: "isolated", group: "g", label: "I", hasRoute: true }
            ];
            const links: Link[] = [
                { source: "focal", target: "connected" }
            ];
            const result = filterFocalGraph(nodes, links, "focal");
            expect(result.nodes).toHaveLength(2);
            expect(result.links).toHaveLength(1);
            expect(result.nodes.map(n => n.id)).toContain("focal");
            expect(result.nodes.map(n => n.id)).toContain("connected");
            expect(result.nodes.map(n => n.id)).not.toContain("isolated");
        });
    });
});
