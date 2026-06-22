/**
 * Extracts H2 and H3 headings from markdown or MDX content bodies at server/build time.
 * Supports both markdown syntax (##, ###) and HTML/JSX elements (<h2 ...>, <h3 ...>).
 * Strips comments first to prevent extracting headings in commented-out sections.
 */
export interface ExtractedHeading {
    depth: number;
    text: string;
    slug: string;
}

export function extractHeadings(body?: string): ExtractedHeading[] {
    if (!body) return [];

    // Strip comments first
    const cleanBody = body
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // remove MDX comments
        .replace(/<!--[\s\S]*?-->/g, "");     // remove HTML comments

    const headings: { index: number; depth: number; text: string }[] = [];

    // Match Markdown headings (## and ###) at the start of a line
    const mdRegex = /^\s*(#{2,3})\s+(.*?)(?:\s+#*)?$/gm;
    let match;
    while ((match = mdRegex.exec(cleanBody)) !== null) {
        const depth = match[1].length;
        const rawText = match[2];
        const text = rawText
            .replace(/<[^>]*>/g, "") // strip JSX/HTML tags
            .replace(/\s+/g, " ")
            .trim();
        if (text) {
            headings.push({
                index: match.index,
                depth,
                text,
            });
        }
    }

    // Match HTML/JSX headings (<h2 ...> and <h3 ...>)
    const htmlRegex = /<h([23])(?:\s+[^>]*)*>([\s\S]*?)<\/h\1>/gi;
    while ((match = htmlRegex.exec(cleanBody)) !== null) {
        const depth = parseInt(match[1], 10);
        const rawText = match[2];
        const text = rawText
            .replace(/<[^>]*>/g, "") // strip JSX/HTML tags
            .replace(/\s+/g, " ")
            .trim();
        if (text) {
            headings.push({
                index: match.index,
                depth,
                text,
            });
        }
    }

    // Sort headings by their position in the file to maintain document order
    headings.sort((a, b) => a.index - b.index);

    // Slugify and return
    return headings.map((h, idx) => {
        const slug = h.text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove accents
            .replace(/[^\w\s-]/g, "")        // remove special characters
            .replace(/\s+/g, "-")            // replace spaces with hyphens
            .replace(/-+/g, "-")             // remove consecutive hyphens
            .trim();
        return {
            depth: h.depth,
            text: h.text,
            slug: slug || `heading-${idx}`,
        };
    });
}
