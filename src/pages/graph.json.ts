import { getCollection } from "astro:content";

export async function GET({ request }: { request: Request }) {
    // 1. Fetch all collections
    const projects = await getCollection("projects");
    const blogs = await getCollection("blog");
    const services = await getCollection("services");
    const topics = await getCollection("topics");
    const tags = await getCollection("tags");

    interface Node {
        id: string;
        group: string;
        label: string;
        icon?: string;
        hasRoute: boolean;
        weight?: number;
    }

    interface Link {
        source: string;
        target: string;
    }

    const nodes: Node[] = [];
    const links: Link[] = [];

    // 1. Helpers
    const addNode = (id: string, group: string, label: string, iconUrl?: string, hasRoute = false) => {
        if (!nodes.find((n: any) => n.id === id)) {
            nodes.push({ id, group, label, icon: iconUrl, hasRoute });
        }
    };

    const addLink = (source: string, target: string) => {
        if (!links.find((l: any) => l.source === source && l.target === target)) {
            links.push({ source, target });
        }
    };

    // Helper: Strip extension and language prefix (e.g. pt/my-post.md -> my-post)
    const cleanId = (id: string) => {
        let clean = id.replace(/\.mdx?$/, "");
        const parts = clean.split('/');
        // If it's inside a locale folder, strip the locale
        if (parts.length > 1 && ['en', 'pt', 'es', 'fr', 'zh', 'ja', 'en-GB'].includes(parts[0])) {
            return parts.slice(1).join('/');
        }
        return clean;
    };

    // Helper: Resolve SVG Icon CDN
    const getIconInfo = (icon?: string) => icon ? `https://cdn.simpleicons.org/${icon}/ffffff` : undefined;

    // 2. Map Taxonomy Nodes (Pages are now built, hasRoute = true)
    topics.forEach(t => addNode(`topics/${cleanId(t.id)}`, "topics", t.data.title, getIconInfo(t.data.icon), true));
    tags.forEach(t => addNode(`tags/${cleanId(t.id)}`, "tags", t.data.title, getIconInfo(t.data.icon), true));

    // 3. Map Projects (hasRoute = true)
    projects.forEach(p => {
        const pId = `projects/${cleanId(p.id)}`;
        addNode(pId, "projects", p.data.title, undefined, true);

        p.data.relatedTopics?.forEach((ref: any) => addLink(pId, `topics/${cleanId(ref.id || ref)}`));
        p.data.tags?.forEach((ref: any) => addLink(pId, `tags/${cleanId(ref.id || ref)}`));
        p.data.relatedServices?.forEach((ref: any) => addLink(pId, `services/${cleanId(ref.id || ref)}`));
        p.data.relatedPosts?.forEach((ref: any) => addLink(pId, `blog/${cleanId(ref.id || ref)}`));
    });

    // 4. Map Blog Posts (hasRoute = true)
    blogs.forEach(b => {
        const bId = `blog/${cleanId(b.id)}`;
        addNode(bId, "blog", b.data.title, undefined, true);

        b.data.relatedTopics?.forEach((ref: any) => addLink(bId, `topics/${cleanId(ref.id || ref)}`));
        b.data.tags?.forEach((ref: any) => addLink(bId, `tags/${cleanId(ref.id || ref)}`));
        if (b.data.relatedProject) addLink(bId, `projects/${cleanId(b.data.relatedProject.id)}`);
        if (b.data.ctaService) addLink(bId, `services/${cleanId(b.data.ctaService.id)}`);
    });

    // 5. Map Services (hasRoute = true)
    services.forEach(s => {
        const sId = `services/${cleanId(s.id)}`;
        addNode(sId, "services", s.data.title, undefined, true);
        s.data.relatedTopics?.forEach((ref: any) => addLink(sId, `topics/${cleanId(ref.id || ref)}`));
    });

    // Calculate Weights (number of edges pointing to/from)
    nodes.forEach(n => {
        n.weight = links.filter(l => l.source === n.id || l.target === n.id).length;
    });

    // Ensure all targets inside links exist as nodes (fallback for dead links, avoiding D3/Cytoscape crashes)
    links.forEach(l => {
        if (!nodes.find(n => n.id === l.target)) {
            addNode(l.target, "unknown", l.target.split('/').pop() || l.target);
        }
    });

    const url = new URL(request.url);
    const focusId = url.searchParams.get("focus");

    let finalNodes = nodes;
    let finalLinks = links;

    if (focusId) {
        // Find all links connected to the focal node
        finalLinks = links.filter(l => l.source === focusId || l.target === focusId);

        const connectedNodeIds = new Set([focusId]);
        finalLinks.forEach(l => {
            connectedNodeIds.add(l.source);
            connectedNodeIds.add(l.target);
        });

        finalNodes = nodes.filter(n => connectedNodeIds.has(n.id));
    }

    return new Response(JSON.stringify({ nodes: finalNodes, links: finalLinks }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
