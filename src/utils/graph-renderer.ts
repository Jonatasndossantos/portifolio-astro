import * as d3 from "d3";

export interface GraphNode extends d3.SimulationNodeDatum {
    id: string;
    group: string;
    label: string;
    icon?: string;
    hasRoute: boolean;
    weight?: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
    source: string | GraphNode;
    target: string | GraphNode;
}

export const COLOR_MAP: Record<string, { fill: string; stroke: string }> = {
    projects: { fill: "#0ea5e9", stroke: "#0369a1" },
    blog: { fill: "#ef4444", stroke: "#b91c1c" },
    services: { fill: "#9ca3af", stroke: "#4b5563" },
    topics: { fill: "#a855f7", stroke: "#7e22ce" },
    tags: { fill: "#f97316", stroke: "#c2410c" },
    unknown: { fill: "#64748b", stroke: "#334155" },
};

/**
 * Calculates circle radius based on weight.
 */
export function getNodeRadius(weight = 0): number {
    return 3 + Math.sqrt(weight) * 1.5;
}

/**
 * Maps categories to specific SVG layout center focal points.
 */
export function getMagneticZone(group: string, width: number, height: number): { x: number; y: number } {
    switch (group) {
        case "projects": return { x: width * 0.25, y: height * 0.25 };
        case "blog": return { x: width * 0.75, y: height * 0.25 };
        case "topics": return { x: width * 0.25, y: height * 0.75 };
        case "services": return { x: width * 0.75, y: height * 0.75 };
        default: return { x: width * 0.5, y: height * 0.5 };
    }
}

/**
 * Builds the force layout simulation.
 */
export function createSimulation(
    nodes: GraphNode[],
    links: GraphLink[],
    width: number,
    height: number
): d3.Simulation<GraphNode, GraphLink> {
    const repelForce = 0.8;
    const linkDistance = 50;
    const gravity = 0.1;

    return d3
        .forceSimulation<GraphNode, GraphLink>(nodes)
        .force("charge", d3.forceManyBody<GraphNode>().strength((d) => {
            const w = d.weight || 0;
            return -150 * repelForce - (w * 25 * repelForce);
        }))
        .force("link", d3.forceLink<GraphNode, GraphLink>(links)
            .id((d) => d.id)
            .distance((l) => {
                const w1 = typeof l.source === 'object' ? (l.source.weight || 0) : 0;
                const w2 = typeof l.target === 'object' ? (l.target.weight || 0) : 0;
                return (w1 > 4 && w2 > 4) ? (linkDistance * 3 + (w1 + w2) * 5) : linkDistance;
            })
        )
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX<GraphNode>((d) => getMagneticZone(d.group, width, height).x).strength(gravity))
        .force("y", d3.forceY<GraphNode>((d) => getMagneticZone(d.group, width, height).y).strength(gravity))
        .force("collide", d3.forceCollide<GraphNode>().radius((d) => getNodeRadius(d.weight) + 12));
}

/**
 * Standard drag behavior configurations.
 */
export function addDragBehavior(
    simulation: d3.Simulation<GraphNode, GraphLink>
): d3.DragBehavior<SVGElement, GraphNode, unknown> {
    return d3
        .drag<SVGElement, GraphNode>()
        .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        })
        .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
        })
        .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        });
}

function getConnectedNodeIds(links: GraphLink[], focalId: string): Set<string> {
    const ids = new Set<string>();
    links.forEach(l => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        if (sId === focalId) ids.add(tId);
        if (tId === focalId) ids.add(sId);
    });
    return ids;
}

export function handleNodeMouseOver(
    element: SVGGElement,
    d: GraphNode,
    nodeSelection: d3.Selection<SVGGElement, GraphNode, d3.BaseType, unknown>,
    linkSelection: d3.Selection<SVGLineElement, GraphLink, d3.BaseType, unknown>,
    links: GraphLink[]
): void {
    const connectedIds = getConnectedNodeIds(links, d.id);

    nodeSelection.style("opacity", (n) => {
        const isConnected = connectedIds.has(n.id);
        return isConnected || n.id === d.id ? 1 : 0.15;
    });

    d3.select(element).select("circle")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

    nodeSelection.selectAll("text")
        .style("fill", (n: any) => (connectedIds.has(n.id) || n.id === d.id ? "#f8fafc" : "#64748b"))
        .style("font-weight", (n: any) => (connectedIds.has(n.id) || n.id === d.id ? "600" : "400"));

    linkSelection
        .attr("stroke", (l: any) => (l.source.id === d.id || l.target.id === d.id ? "#94a3b8" : "#1e293b"))
        .attr("stroke-width", (l: any) => (l.source.id === d.id || l.target.id === d.id ? 2 : 1))
        .attr("stroke-opacity", (l: any) => (l.source.id === d.id || l.target.id === d.id ? 1 : 0.05));
}

export function handleNodeMouseOut(
    element: SVGGElement,
    d: GraphNode,
    nodeSelection: d3.Selection<SVGGElement, GraphNode, d3.BaseType, unknown>,
    linkSelection: d3.Selection<SVGLineElement, GraphLink, d3.BaseType, unknown>
): void {
    d3.select(element).select("circle")
        .attr("stroke-width", 1.5)
        .attr("stroke", COLOR_MAP[d.group]?.stroke || COLOR_MAP.unknown.stroke);

    nodeSelection.style("opacity", 1);
    
    nodeSelection.selectAll("text")
        .style("fill", "#64748b")
        .style("font-weight", (n: any) => (n.weight && n.weight > 5 ? "500" : "400"));

    linkSelection
        .attr("stroke", "#334155")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.4);
}

export function handleNodeClick(d: GraphNode): void {
    if (!d.hasRoute) return;
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const supportedLocales = ["pt", "fr", "es", "zh", "ja"];
    const locale = supportedLocales.includes(pathParts[0]) ? pathParts[0] : "";
    window.location.href = locale ? `/${locale}/${d.id}` : `/${d.id}`;
}

export function drawElements(
    svgGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    nodes: GraphNode[],
    links: GraphLink[],
    simulation: d3.Simulation<GraphNode, GraphLink>
) {
    const linkSel = svgGroup.append("g").selectAll<SVGLineElement, GraphLink>("line")
        .data(links).join("line")
        .attr("stroke", "#334155").attr("stroke-width", 1).attr("stroke-opacity", 0.4);

    const nodeSel = svgGroup.append("g").selectAll<SVGGElement, GraphNode>("g.node-group")
        .data(nodes).join("g").attr("class", "node-group")
        .style("cursor", d => d.hasRoute ? "pointer" : "default")
        .style("transition", "opacity 0.2s ease")
        .on("click", (_e, d) => handleNodeClick(d))
        .on("mouseover", function (_e, d) { handleNodeMouseOver(this, d, nodeSel, linkSel, links); })
        .on("mouseout", function (_e, d) { handleNodeMouseOut(this, d, nodeSel, linkSel); })
        .call(addDragBehavior(simulation) as any);

    return { nodeSel, linkSel };
}

function appendCircle(nodeSel: d3.Selection<SVGGElement, GraphNode, d3.BaseType, unknown>) {
    nodeSel.append("circle")
        .attr("r", d => getNodeRadius(d.weight))
        .attr("fill", d => COLOR_MAP[d.group]?.fill || COLOR_MAP.unknown.fill)
        .attr("stroke", d => COLOR_MAP[d.group]?.stroke || COLOR_MAP.unknown.stroke)
        .attr("stroke-width", 1.5);
}

function appendIcon(nodeSel: d3.Selection<SVGGElement, GraphNode, d3.BaseType, unknown>) {
    nodeSel.append("image")
        .attr("href", d => d.icon || "")
        .attr("x", d => -getNodeRadius(d.weight) / 1.5)
        .attr("y", d => -getNodeRadius(d.weight) / 1.5)
        .attr("width", d => getNodeRadius(d.weight) * 1.33)
        .attr("height", d => getNodeRadius(d.weight) * 1.33)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .style("pointer-events", "none");
}

function appendText(nodeSel: d3.Selection<SVGGElement, GraphNode, d3.BaseType, unknown>) {
    nodeSel.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", d => getNodeRadius(d.weight) + 12)
        .attr("font-size", d => (d.weight && d.weight > 5 ? "11px" : "9px"))
        .attr("font-weight", d => (d.weight && d.weight > 5 ? "500" : "400"))
        .style("fill", "#64748b")
        .style("opacity", d => (d.weight && d.weight > 2 ? 0.9 : 0.4))
        .style("pointer-events", "none")
        .style("user-select", "none")
        .text(d => d.label);
}

export function appendNodeVisuals(nodeSel: d3.Selection<SVGGElement, GraphNode, d3.BaseType, unknown>) {
    appendCircle(nodeSel);
    appendIcon(nodeSel);
    appendText(nodeSel);
    nodeSel.append("title").text(d => `${d.label} (${d.group})`);
}

function setupSvgContainer(containerId: string): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
    const svg = d3.select(containerId).append("svg")
        .attr("width", "100%").attr("height", "100%");
    
    const svgGroup = svg.append("g");
    
    svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.25, 4]).on("zoom", (e) => {
        svgGroup.attr("transform", e.transform);
    }) as any);
    
    return svgGroup;
}

/**
 * Initializes and draws the interactive D3 knowledge graph.
 */
export async function initGraph(): Promise<void> {
    const wrapper = document.getElementById("graph-wrapper");
    const container = document.getElementById("graph-container");
    if (!wrapper || !container) return;

    const focusId = wrapper.dataset.focus;
    const query = focusId ? `&focus=${focusId}` : "";
    const res = await fetch(`/graph.json?v=${new Date().getTime()}${query}`);
    if (!res.ok) return;
    const data = await res.json();

    container.innerHTML = "";
    const width = container.clientWidth;
    const height = container.clientHeight;

    const simulation = createSimulation(data.nodes, data.links, width, height);
    const svgGroup = setupSvgContainer("#graph-container");

    const { nodeSel, linkSel } = drawElements(svgGroup, data.nodes, data.links, simulation);
    appendNodeVisuals(nodeSel);

    simulation.on("tick", () => {
        linkSel.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
        nodeSel.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
}
