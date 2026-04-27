export type OpenGraphData = {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
};

const cache = new Map<string, Promise<OpenGraphData | null>>();

const ENTITY_MAP: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#039;': "'",
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&nbsp;': ' '
};

function decodeEntities(input: string): string {
    return input
        .replace(/&(?:amp|lt|gt|quot|apos|nbsp|#0?39|#x27|#x2F);/gi, (m) => ENTITY_MAP[m.toLowerCase()] ?? m)
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function parseMetaTags(html: string): Map<string, string> {
    const out = new Map<string, string>();
    const metaRe = /<meta\b[^>]*>/gi;
    const attrRe = /(\w[\w:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

    let metaMatch: RegExpExecArray | null;
    while ((metaMatch = metaRe.exec(html)) !== null) {
        const tag = metaMatch[0];
        const attrs: Record<string, string> = {};
        let am: RegExpExecArray | null;
        attrRe.lastIndex = 0;
        while ((am = attrRe.exec(tag)) !== null) {
            attrs[am[1].toLowerCase()] = am[2] ?? am[3] ?? '';
        }
        const key = (attrs['property'] ?? attrs['name'])?.toLowerCase();
        const val = attrs['content'];
        if (key && val && !out.has(key)) {
            out.set(key, decodeEntities(val).trim());
        }
    }
    return out;
}

async function fetchOpenGraphInner(url: string): Promise<OpenGraphData | null> {
    try {
        const res = await fetch(url, {
            redirect: 'follow',
            signal: AbortSignal.timeout(8000),
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; arter-blog-link-preview/1.0)',
                Accept: 'text/html,application/xhtml+xml'
            }
        });
        if (!res.ok) return null;
        const html = await res.text();
        const metas = parseMetaTags(html);

        const titleTagRaw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
        const titleTag = titleTagRaw ? decodeEntities(titleTagRaw).replace(/\s+/g, ' ').trim() : undefined;

        const rawImage = metas.get('og:image') ?? metas.get('og:image:url') ?? metas.get('twitter:image') ?? metas.get('twitter:image:src');
        let image: string | undefined;
        if (rawImage) {
            try {
                image = new URL(rawImage, url).toString();
            } catch {
                image = undefined;
            }
        }

        return {
            title: metas.get('og:title') ?? metas.get('twitter:title') ?? titleTag,
            description: metas.get('og:description') ?? metas.get('twitter:description') ?? metas.get('description'),
            image,
            siteName: metas.get('og:site_name')
        };
    } catch {
        return null;
    }
}

export function fetchOpenGraph(url: string): Promise<OpenGraphData | null> {
    const existing = cache.get(url);
    if (existing) return existing;
    const promise = fetchOpenGraphInner(url);
    cache.set(url, promise);
    return promise;
}
