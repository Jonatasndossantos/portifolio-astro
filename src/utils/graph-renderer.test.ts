import { describe, it, expect } from "vitest";
import { getNodeRadius, getMagneticZone } from "./graph-renderer";

describe("graph-renderer utility", () => {
    describe("getNodeRadius", () => {
        it("should calculate correct radius based on weight", () => {
            expect(getNodeRadius(0)).toBe(3);
            expect(getNodeRadius(4)).toBe(6); // 3 + 2 * 1.5 = 6
        });
    });

    describe("getMagneticZone", () => {
        it("should return the correct attraction points for each category", () => {
            const width = 1000;
            const height = 800;
            
            const projectsZone = getMagneticZone("projects", width, height);
            expect(projectsZone).toEqual({ x: 250, y: 200 });

            const blogZone = getMagneticZone("blog", width, height);
            expect(blogZone).toEqual({ x: 750, y: 200 });

            const defaultZone = getMagneticZone("unknown", width, height);
            expect(defaultZone).toEqual({ x: 500, y: 400 });
        });
    });
});
