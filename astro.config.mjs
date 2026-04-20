import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import { readdirSync, readFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const SITE = 'https://arter.dev';

function extractFrontmatter(source) {
    const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
    return match ? match[1] : '';
}

function readDateField(frontmatter, key) {
    const re = new RegExp(`^${key}:\\s*['\"]?([0-9T:\\-\\.Z]+)['\"]?\\s*$`, 'm');
    const m = frontmatter.match(re);
    if (!m) return undefined;
    const d = new Date(m[1]);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function collectLastmods(dir, urlPrefix, map) {
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const entry of entries) {
        if (!entry.isFile()) continue;
        const ext = extname(entry.name);
        if (ext !== '.md' && ext !== '.mdx') continue;
        const fm = extractFrontmatter(readFileSync(join(dir, entry.name), 'utf8'));
        const iso = readDateField(fm, 'updatedDate') ?? readDateField(fm, 'publishDate');
        if (!iso) continue;
        const slug = basename(entry.name, ext);
        map.set(`${SITE}${urlPrefix}${slug}/`, iso);
    }
}

const lastmodByUrl = new Map();
collectLastmods('src/content/blog', '/blog/', lastmodByUrl);
collectLastmods('src/content/projects', '/projects/', lastmodByUrl);

// https://astro.build/config
export default defineConfig({
    site: SITE,
    output: 'static',
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [
        mdx(),
        sitemap({
            filter: (page) => !/\/admin(\/|$)/.test(page),
            serialize: (item) => {
                const lastmod = lastmodByUrl.get(item.url);
                return lastmod ? { ...item, lastmod } : item;
            }
        }),
        react(),
        markdoc()
    ]
});