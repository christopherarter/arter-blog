import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng } from '../../../og/render';
import { projectToCard } from '../../../og/post-to-card';

export const getStaticPaths: GetStaticPaths = async () => {
    const projects = await getCollection('projects');
    return projects.map((project) => ({
        params: { id: project.id },
        props: { project }
    }));
};

export const GET: APIRoute = async ({ props }) => {
    const project = props.project as Awaited<ReturnType<typeof getCollection<'projects'>>>[number];
    const png = await renderOgPng(projectToCard(project));
    return new Response(png, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
};
