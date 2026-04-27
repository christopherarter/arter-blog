import type { CSSProperties, ReactElement } from 'react';

export type OgCardProps = {
    title: string;
    subtitle?: string;
};

const PAPER = '#141311';
const PAPER_2 = '#1d1c19';
const INK = '#f3f1ea';
const INK_2 = '#c9c5b7';

const SERIF = 'DM Serif Display';
const MONO = 'JetBrains Mono';

const SUBTITLE_MAX = 110;

function fitTitle(title: string): { fontSize: number; lineHeight: number } {
    const len = title.length;
    if (len <= 18) return { fontSize: 156, lineHeight: 0.98 };
    if (len <= 32) return { fontSize: 130, lineHeight: 1.0 };
    if (len <= 52) return { fontSize: 108, lineHeight: 1.02 };
    if (len <= 80) return { fontSize: 90, lineHeight: 1.06 };
    if (len <= 110) return { fontSize: 76, lineHeight: 1.08 };
    return { fontSize: 64, lineHeight: 1.1 };
}

function titleMaxWidth(fontSize: number): number {
    if (fontSize >= 130) return 1000;
    if (fontSize >= 100) return 1020;
    if (fontSize >= 80) return 1040;
    return 1056;
}

function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    return s.slice(0, max - 1).trimEnd() + '…';
}

export function OgCard({ title, subtitle }: OgCardProps): ReactElement {
    const { fontSize, lineHeight } = fitTitle(title);
    const trimmedSubtitle = subtitle ? truncate(subtitle, SUBTITLE_MAX) : undefined;

    const root: CSSProperties = {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: PAPER,
        backgroundImage: `linear-gradient(180deg, ${PAPER_2} 0%, ${PAPER} 60%)`,
        padding: '72px',
        fontFamily: MONO,
        color: INK
    };

    const titleBlock: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'auto',
        marginBottom: 'auto'
    };

    const titleStyle: CSSProperties = {
        fontFamily: SERIF,
        fontWeight: 400,
        fontSize,
        lineHeight,
        letterSpacing: '-0.028em',
        color: INK,
        maxWidth: titleMaxWidth(fontSize),
        display: 'flex'
    };

    const subtitleStyle: CSSProperties = {
        fontFamily: SERIF,
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 38,
        lineHeight: 1.28,
        letterSpacing: '-0.005em',
        color: INK_2,
        maxWidth: 920,
        marginTop: 30,
        display: 'flex'
    };

    const author: CSSProperties = {
        fontFamily: MONO,
        fontWeight: 500,
        fontSize: 28,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: INK,
        display: 'flex'
    };

    return (
        <div style={root}>
            <div style={titleBlock}>
                <div style={titleStyle}>{title}</div>
                {trimmedSubtitle && <div style={subtitleStyle}>{trimmedSubtitle}</div>}
            </div>
            <div style={author}>Chris Arter</div>
        </div>
    );
}
