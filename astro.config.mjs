import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
    site: 'https://arter.dev',
    output: 'static',
    integrations: [
        mdx(),
        sitemap(),
        tailwind({ applyBaseStyles: false }),
        react(),
        markdoc()
    ]
});