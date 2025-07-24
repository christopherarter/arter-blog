import { getCollection } from 'astro:content';
import { sortItemsByDateDesc } from '../utils/data-utils';
import siteConfig from '../data/site-config';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
    const posts = (await getCollection('blog')).sort(sortItemsByDateDesc);
    
    const jsonFeed = {
        version: "https://jsonfeed.org/version/1.1",
        title: siteConfig.title,
        description: siteConfig.description,
        home_page_url: site?.toString(),
        feed_url: new URL('feed.json', site).toString(),
        language: "en",
        authors: [
            {
                name: "Chris Arter",
                url: "https://arter.dev",
                avatar: "https://arter.dev/images/chris-arter.jpg"
            }
        ],
        items: posts.slice(0, 20).map(post => ({
            id: new URL(`blog/${post.id}/`, site).toString(),
            title: post.data.title,
            content_text: post.data.excerpt || '',
            url: new URL(`blog/${post.id}/`, site).toString(),
            date_published: post.data.publishDate.toISOString(),
            date_modified: post.data.updatedDate?.toISOString() || post.data.publishDate.toISOString(),
            tags: post.data.tags,
            author: {
                name: "Chris Arter",
                url: "https://arter.dev"
            }
        }))
    };

    return new Response(JSON.stringify(jsonFeed, null, 2), {
        headers: {
            'Content-Type': 'application/feed+json; charset=utf-8'
        }
    });
};