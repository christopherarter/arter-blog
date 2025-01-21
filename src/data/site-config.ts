export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Chris Arter',
    subtitle: 'Software Engineer',
    description: "Hey there! I'm a software engineer based in North Carolina, USA. I'm a huge fan of Laravel and Docker, and I'm always looking for ways to improve my skills and learn new things.",
    image: {
        src: '/images/chris-arter.jpeg',
        alt: 'Chris Arter'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'About',
            href: '/about'
        },
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },

    ],
    socialLinks: [
        {
            text: 'BlueSky',
            href: 'https://bluesky.social/chrisarter'
        },
        {
            text: 'GitHub',
            href: 'https://github.com/christopherarter'
        },
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/chrisarter1/'
        },
        {
            text: 'php.social Mastodon',
            href: 'https://phpc.social/@chrisarter'
        },
        {
            text: 'YouTube',
            href: 'https://www.youtube.com/@codebeans'
        }
    ],
    hero: {
        title: 'Hey there 👋',
        text: "I'm a senior software engineer with over a decade of experience based in North Carolina, USA. I'm a Laravel core contributor, ",
        image: {
            src: '/images/chris-arter.jpg',
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Let\'s Connect',
                href: 'https://www.linkedin.com/in/chrisarter1/'
            }
        ]
    },
    // subscribe: {
    //     title: 'Subscribe to Dante Newsletter',
    //     text: 'One update per week. All the latest posts directly in your inbox.',
    //     formUrl: '#'
    // },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
