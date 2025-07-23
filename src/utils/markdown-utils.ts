export type Heading = {
    id: string;
    text: string;
    level: number;
    children: Heading[];
};

/**
 * Generates a URL-friendly slug from text
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extracts headings from raw markdown content
 */
export function extractHeadingsFromMarkdown(markdownContent: string): Heading[] {
    const headingRegex = /^(#{2,6})\s+(.+)$/gm;
    const matches = [...markdownContent.matchAll(headingRegex)];

    const flatHeadings = matches.map(match => {
        const level = match[1].length; // Count the # characters
        const text = match[2].trim();
        const id = slugify(text);

        return {
            id,
            text,
            level,
            children: [] as Heading[]
        };
    });

    return buildNestedHeadings(flatHeadings);
}

/**
 * Builds a nested heading structure from flat headings
 */
function buildNestedHeadings(flatHeadings: Heading[]): Heading[] {
    const nestedHeadings: Heading[] = [];

    flatHeadings.forEach(heading => {
        // Find the correct parent for nesting
        let inserted = false;

        for (let i = nestedHeadings.length - 1; i >= 0; i--) {
            if (nestedHeadings[i].level < heading.level) {
                nestedHeadings[i].children.push(heading);
                inserted = true;
                break;
            }
        }

        // If no parent found, add to root level
        if (!inserted) {
            nestedHeadings.push(heading);
        }
    });

    return nestedHeadings;
}

