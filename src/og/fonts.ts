import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_DIR = join(process.cwd(), 'node_modules/.cache/og-fonts');

type FontWeight = 400 | 500 | 700;
type FontStyle = 'normal' | 'italic';

type FontSource = {
    name: string;
    weight: FontWeight;
    style: FontStyle;
    url: string;
};

const SOURCES: FontSource[] = [
    {
        name: 'DM Serif Display',
        weight: 400,
        style: 'normal',
        url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf'
    },
    {
        name: 'DM Serif Display',
        weight: 400,
        style: 'italic',
        url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/dmserifdisplay/DMSerifDisplay-Italic.ttf'
    },
    {
        name: 'JetBrains Mono',
        weight: 500,
        style: 'normal',
        url: 'https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf/JetBrainsMono-Medium.ttf'
    }
];

async function fetchTtf(source: FontSource): Promise<ArrayBuffer> {
    const cacheKey = `${source.name.replace(/\s+/g, '-')}-${source.weight}-${source.style}.ttf`;
    const cachePath = join(CACHE_DIR, cacheKey);
    if (existsSync(cachePath)) {
        const buf = await readFile(cachePath);
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    const res = await fetch(source.url);
    if (!res.ok) throw new Error(`Failed to fetch ${source.name}: ${res.status}`);
    const buf = await res.arrayBuffer();
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(cachePath, Buffer.from(buf));
    return buf;
}

export type LoadedFont = {
    name: string;
    data: ArrayBuffer;
    weight: FontWeight;
    style: FontStyle;
};

let cached: Promise<LoadedFont[]> | null = null;

export function loadOgFonts(): Promise<LoadedFont[]> {
    if (cached) return cached;
    cached = Promise.all(
        SOURCES.map(async (source) => ({
            name: source.name,
            data: await fetchTtf(source),
            weight: source.weight,
            style: source.style
        }))
    );
    return cached;
}
