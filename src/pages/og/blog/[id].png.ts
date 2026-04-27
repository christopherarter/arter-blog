import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng } from '../../../og/render';
import { blogPostToCard } from '../../../og/post-to-card';

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getCollection('blog');
    return posts.map((post) => ({
        params: { id: post.id },
        props: { post }
    }));
};

export const GET: APIRoute = async ({ props }) => {
    const post = props.post as Awaited<ReturnType<typeof getCollection<'blog'>>>[number];
    const png = await renderOgPng(blogPostToCard(post));
    return new Response(png, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
};
