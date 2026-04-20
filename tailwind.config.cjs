const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
            serif: ['DM Serif Display', 'DM Serif Text', ...defaultTheme.fontFamily.serif],
            mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
        },
        extend: {
            colors: {
                ink: {
                    DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
                    2: 'rgb(var(--ink-2) / <alpha-value>)',
                    3: 'rgb(var(--ink-3) / <alpha-value>)',
                    4: 'rgb(var(--ink-4) / <alpha-value>)'
                },
                paper: {
                    DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
                    2: 'rgb(var(--paper-2) / <alpha-value>)',
                    3: 'rgb(var(--paper-3) / <alpha-value>)'
                }
            },
            textColor: {
                main: 'rgb(var(--color-text-main) / <alpha-value>)'
            },
            backgroundColor: {
                main: 'rgb(var(--color-bg-main) / <alpha-value>)',
                muted: 'rgb(var(--color-bg-muted) / <alpha-value>)'
            },
            borderColor: {
                main: 'rgb(var(--color-border-main) / <alpha-value>)',
                hair: 'rgba(243, 241, 234, 0.10)',
                'hair-2': 'rgba(243, 241, 234, 0.18)'
            },
            letterSpacing: {
                mono: '0.08em',
                wider: '0.12em',
                widest: '0.2em'
            },
            maxWidth: {
                shell: '1280px',
                article: '1180px'
            },
            transitionProperty: {
                colors: 'color, background-color, border-color, text-decoration-color, fill, stroke'
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': 'rgb(var(--ink))',
                        '--tw-prose-headings': 'rgb(var(--ink))',
                        '--tw-prose-lead': 'rgb(var(--ink-2))',
                        '--tw-prose-links': 'rgb(var(--ink))',
                        '--tw-prose-bold': 'rgb(var(--ink))',
                        '--tw-prose-counters': 'rgb(var(--ink-3))',
                        '--tw-prose-bullets': 'rgb(var(--ink-4))',
                        '--tw-prose-hr': 'rgba(243, 241, 234, 0.10)',
                        '--tw-prose-quotes': 'rgb(var(--ink))',
                        '--tw-prose-quote-borders': 'rgb(var(--ink-4))',
                        '--tw-prose-captions': 'rgb(var(--ink-3))',
                        '--tw-prose-code': 'rgb(var(--ink))',
                        '--tw-prose-pre-code': 'rgb(var(--ink-2))',
                        '--tw-prose-pre-bg': 'rgb(var(--paper-2))',
                        '--tw-prose-th-borders': 'rgba(243, 241, 234, 0.18)',
                        '--tw-prose-td-borders': 'rgba(243, 241, 234, 0.10)'
                    }
                }
            })
        }
    },
    plugins: [require('@tailwindcss/typography')]
};
