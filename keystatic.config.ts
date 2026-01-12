import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    collections: {
        blog: collection({
            label: 'Blog Posts',
            slugField: 'title',
            path: 'src/content/blog/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                slug: fields.text({ label: 'Slug' }),
                subtitle: fields.text({ label: 'Subtitle' }),
                author: fields.text({ label: 'Author' }),
                excerpt: fields.text({ label: 'Excerpt', multiline: true }),
                publishDate: fields.date({ label: 'Publish Date' }),
                updatedDate: fields.date({ label: 'Updated Date' }),
                dateUpdated: fields.date({ label: 'Date Updated (Legacy)' }),
                isFeatured: fields.checkbox({ label: 'Featured', defaultValue: false }),
                tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
                seo: fields.object({
                    title: fields.text({ label: 'SEO Title' }),
                    description: fields.text({ label: 'SEO Description' }),
                    image: fields.object({
                        src: fields.text({ label: 'Image URL' }),
                        alt: fields.text({ label: 'Image Alt' })
                    }, { label: 'Image' }),
                    pageType: fields.select({
                        label: 'Page Type',
                        options: [
                            { label: 'Website', value: 'website' },
                            { label: 'Article', value: 'article' }
                        ],
                        defaultValue: 'article'
                    })
                }, { label: 'SEO' }),
                content: fields.markdoc({ label: 'Content', extension: 'md' })
            }
        }),
        pages: collection({
            label: 'Pages',
            slugField: 'title',
            path: 'src/content/pages/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                seo: fields.object({
                    title: fields.text({ label: 'SEO Title' }),
                    description: fields.text({ label: 'SEO Description' }),
                    image: fields.object({
                        src: fields.text({ label: 'Image URL' }),
                        alt: fields.text({ label: 'Image Alt' })
                    }, { label: 'Image' }),
                    pageType: fields.select({
                        label: 'Page Type',
                        options: [
                            { label: 'Website', value: 'website' },
                            { label: 'Article', value: 'article' }
                        ],
                        defaultValue: 'website'
                    })
                }, { label: 'SEO' }),
                content: fields.markdoc({ label: 'Content', extension: 'md' })
            }
        }),
        projects: collection({
            label: 'Projects',
            slugField: 'title',
            path: 'src/content/projects/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description', multiline: true }),
                publishDate: fields.date({ label: 'Publish Date' }),
                isFeatured: fields.checkbox({ label: 'Featured', defaultValue: false }),
                seo: fields.object({
                    title: fields.text({ label: 'SEO Title' }),
                    description: fields.text({ label: 'SEO Description' }),
                    image: fields.object({
                        src: fields.text({ label: 'Image URL' }),
                        alt: fields.text({ label: 'Image Alt' })
                    }, { label: 'Image' }),
                    pageType: fields.select({
                        label: 'Page Type',
                        options: [
                            { label: 'Website', value: 'website' },
                            { label: 'Article', value: 'article' }
                        ],
                        defaultValue: 'website'
                    })
                }, { label: 'SEO' }),
                content: fields.markdoc({ label: 'Content', extension: 'md' })
            }
        })
    }
});
