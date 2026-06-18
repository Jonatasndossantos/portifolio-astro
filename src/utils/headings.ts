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

interface RawHeading {
    index: number;
    depth: number;
    text: string;
}

/**
 * Strips MDX and HTML comments from a string content body.
 *
 * @param body - The raw content string
 * @example
 * const clean = stripComments("{/* comment *\/}\n## Title <!-- HTML comment -->");
 */
export function stripComments(body: string): string {
    return body
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, "") // remove MDX comments
        .replace(/<!--[\s\S]*?-->/g, "");     // remove HTML comments
}

/**
 * Extracts raw markdown headings (## and ###) from a clean body string.
 *
 * @param cleanBody - The content body with comments stripped
 */
function parseMarkdownHeadings(cleanBody: string): RawHeading[] {
    const headings: RawHeading[] = [];
    const mdRegex = /^\s*(#{2,3})\s+(.*?)(?:\s+#*)?$/gm;
    let match;
    while ((match = mdRegex.exec(cleanBody)) !== null) {
        const text = match[2]
            .replace(/<[^>]*>/g, "") // strip JSX/HTML tags
            .replace(/\s+/g, " ")
            .trim();
        if (text) {
            headings.push({ index: match.index, depth: match[1].length, text });
        }
    }
    return headings;
}

/**
 * Extracts raw HTML/JSX headings (h2 and h3) from a clean body string.
 *
 * @param cleanBody - The content body with comments stripped
 */
function parseHtmlHeadings(cleanBody: string): RawHeading[] {
    const headings: RawHeading[] = [];
    const htmlRegex = /<h([23])(?:\s+[^>]*)*>([\s\S]*?)<\/h\1>/gi;
    let match;
    while ((match = htmlRegex.exec(cleanBody)) !== null) {
        const text = match[2]
            .replace(/<[^>]*>/g, "") // strip JSX/HTML tags
            .replace(/\s+/g, " ")
            .trim();
        if (text) {
            headings.push({ index: match.index, depth: parseInt(match[1], 10), text });
        }
    }
    return headings;
}

/**
 * Standard slugification for header text.
 *
 * @param text - The header text
 * @example
 * const slug = slugify("My Heading text!");
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^\w\s-]/g, "")        // remove special characters
        .replace(/\s+/g, "-")            // replace spaces with hyphens
        .replace(/-+/g, "-")             // remove consecutive hyphens
        .trim();
}

/**
 * Primary function to extract H2 and H3 headings from body text.
 *
 * @param body - The raw content body
 * @example
 * const headings = extractHeadings("## Hello World");
 */
export function extractHeadings(body?: string): ExtractedHeading[] {
    if (!body) return [];

    const cleanBodyText = stripComments(body);
    const headings = [
        ...parseMarkdownHeadings(cleanBodyText),
        ...parseHtmlHeadings(cleanBodyText),
    ];

    headings.sort((a, b) => a.index - b.index);

    return headings.map((h, idx) => ({
        depth: h.depth,
        text: h.text,
        slug: slugify(h.text) || `heading-${idx}`,
    }));
}
