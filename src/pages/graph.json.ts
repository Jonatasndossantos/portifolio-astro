import { getCollection } from "astro:content";
import { getSafeIcon, getIconUrl } from "../utils/icon-helper";

export interface Node {
    id: string;
    group: string;
    label: string;
    icon?: string;
    hasRoute: boolean;
    weight?: number;
}

export interface Link {
    source: string;
    target: string;
}

interface GraphCollectionItem {
    id: string;
    data: {
        title: string;
        icon?: string;
        category?: string;
        relatedTopics?: any[];
        tags?: any[];
        relatedServices?: any[];
        relatedPosts?: any[];
        relatedProject?: { id: string };
        ctaService?: { id: string };
    };
}

/**
 * Standardizes dynamic resource paths by stripping extension and localization prefix.
 */
export function cleanGraphId(id: string): string {
    const clean = id.replace(/\.mdx?$/, "");
    const parts = clean.split('/');
    if (parts.length > 1 && ['en', 'pt', 'es', 'fr', 'zh', 'ja', 'en-GB'].includes(parts[0])) {
        return parts.slice(1).join('/');
    }
    return clean;
}

/**
 * Resolves absolute icon URL.
 */
export function resolveIconUrl(data: { icon?: string; id?: string; title?: string; category?: string }): string | undefined {
    const resolved = getSafeIcon({
        icon: data.icon,
        id: data.id || "",
        title: data.title || "",
        category: data.category || "tool"
    });
    return getIconUrl(resolved);
}

/**
 * Adds a node if it does not already exist.
 */
export function addNode(nodes: Node[], id: string, group: string, label: string, iconUrl?: string, hasRoute = false): void {
    if (!nodes.some(n => n.id === id)) {
        nodes.push({ id, group, label, icon: iconUrl, hasRoute });
    }
}

/**
 * Adds a link if it does not already exist.
 */
export function addLink(links: Link[], source: string, target: string): void {
    if (!links.some(l => l.source === source && l.target === target)) {
        links.push({ source, target });
    }
}

/**
 * Maps taxonomy collections (topics & tags) to graph nodes.
 */
export function mapTaxonomyNodes(nodes: Node[], topics: GraphCollectionItem[], tags: GraphCollectionItem[]): void {
    topics.forEach(t => {
        const url = resolveIconUrl({ ...t.data, id: t.id });
        addNode(nodes, `topics/${cleanGraphId(t.id)}`, "topics", t.data.title, url, true);
    });
    tags.forEach(t => {
        const url = resolveIconUrl({ ...t.data, id: t.id });
        addNode(nodes, `tags/${cleanGraphId(t.id)}`, "tags", t.data.title, url, true);
    });
}

/**
 * Maps project collections and their connections.
 */
export function mapProjectNodes(nodes: Node[], links: Link[], projects: GraphCollectionItem[]): void {
    projects.forEach(p => {
        const pId = `projects/${cleanGraphId(p.id)}`;
        addNode(nodes, pId, "projects", p.data.title, resolveIconUrl({ ...p.data, id: p.id }), true);

        p.data.relatedTopics?.forEach((ref) => addLink(links, pId, `topics/${cleanGraphId(ref.id || ref)}`));
        p.data.tags?.forEach((ref) => addLink(links, pId, `tags/${cleanGraphId(ref.id || ref)}`));
        p.data.relatedServices?.forEach((ref) => addLink(links, pId, `services/${cleanGraphId(ref.id || ref)}`));
        p.data.relatedPosts?.forEach((ref) => addLink(links, pId, `blog/${cleanGraphId(ref.id || ref)}`));
    });
}

/**
 * Maps blog collection and its connections.
 */
export function mapBlogNodes(nodes: Node[], links: Link[], blogs: GraphCollectionItem[]): void {
    blogs.forEach(b => {
        const bId = `blog/${cleanGraphId(b.id)}`;
        addNode(nodes, bId, "blog", b.data.title, resolveIconUrl({ ...b.data, id: b.id }), true);

        b.data.relatedTopics?.forEach((ref) => addLink(links, bId, `topics/${cleanGraphId(ref.id || ref)}`));
        b.data.tags?.forEach((ref) => addLink(links, bId, `tags/${cleanGraphId(ref.id || ref)}`));
        if (b.data.relatedProject) {
            addLink(links, bId, `projects/${cleanGraphId(b.data.relatedProject.id)}`);
        }
        if (b.data.ctaService) {
            addLink(links, bId, `services/${cleanGraphId(b.data.ctaService.id)}`);
        }
    });
}

/**
 * Maps service collections and their connections.
 */
export function mapServiceNodes(nodes: Node[], links: Link[], services: GraphCollectionItem[]): void {
    services.forEach(s => {
        const sId = `services/${cleanGraphId(s.id)}`;
        addNode(nodes, sId, "services", s.data.title, resolveIconUrl({ ...s.data, id: s.id }), true);
        s.data.relatedTopics?.forEach((ref) => addLink(links, sId, `topics/${cleanGraphId(ref.id || ref)}`));
    });
}

/**
 * Calculates connection weights for each node.
 */
export function calculateWeights(nodes: Node[], links: Link[]): void {
    nodes.forEach(n => {
        n.weight = links.filter(l => l.source === n.id || l.target === n.id).length;
    });
}

/**
 * Ensures fallback nodes exist for targets of broken or untracked links.
 */
export function ensureDeadLinksExist(nodes: Node[], links: Link[]): void {
    links.forEach(l => {
        if (!nodes.some(n => n.id === l.target)) {
            const fallbackLabel = l.target.split('/').pop() || l.target;
            addNode(nodes, l.target, "unknown", fallbackLabel);
        }
    });
}

/**
 * Filters graph data around a specific focal node ID.
 */
export function filterFocalGraph(nodes: Node[], links: Link[], focusId: string): { nodes: Node[], links: Link[] } {
    const finalLinks = links.filter(l => l.source === focusId || l.target === focusId);
    const connectedNodeIds = new Set([focusId]);
    finalLinks.forEach(l => {
        connectedNodeIds.add(l.source);
        connectedNodeIds.add(l.target);
    });
    const finalNodes = nodes.filter(n => connectedNodeIds.has(n.id));
    return { nodes: finalNodes, links: finalLinks };
}

/**
 * Endpoint handler to serve graph visualization layout nodes and edges.
 */
export async function GET({ request }: { request: Request }) {
    const [projects, blogs, services, topics, tags] = await Promise.all([
        getCollection("projects"), getCollection("blog"), getCollection("services"),
        getCollection("topics"), getCollection("tags")
    ]);
    const nodes: Node[] = [];
    const links: Link[] = [];
    mapTaxonomyNodes(nodes, topics, tags);
    mapProjectNodes(nodes, links, projects);
    mapBlogNodes(nodes, links, blogs);
    mapServiceNodes(nodes, links, services);
    calculateWeights(nodes, links);
    ensureDeadLinksExist(nodes, links);
    const focusId = new URL(request.url).searchParams.get("focus");
    const result = focusId ? filterFocalGraph(nodes, links, focusId) : { nodes, links };
    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
