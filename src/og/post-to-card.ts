import type { CollectionEntry } from 'astro:content';
import type { OgCardProps } from './OgCard';

export function blogPostToCard(post: CollectionEntry<'blog'>): OgCardProps {
    const { title, subtitle, seo } = post.data;
    return {
        title: seo?.title ?? title,
        subtitle
    };
}

export function projectToCard(project: CollectionEntry<'projects'>): OgCardProps {
    const { title, description, seo } = project.data;
    return {
        title: seo?.title ?? title,
        subtitle: description
    };
}
