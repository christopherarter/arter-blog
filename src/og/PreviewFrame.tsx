import { useEffect, useState } from 'react';
import { OgCard, type OgCardProps } from './OgCard';

type Props = { card: OgCardProps };

// Renders the OG card at 1200x630 inside a responsive container that scales it
// down to fit the viewport, so designers can iterate at real proportions.
export default function PreviewFrame({ card }: Props) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth - 80;
            const maxScale = Math.min(w / 1200, 1);
            setScale(maxScale);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
                style={{
                    width: 1200 * scale,
                    height: 630 * scale,
                    overflow: 'hidden',
                    border: '1px solid rgba(243, 241, 234, 0.08)',
                    borderRadius: 4
                }}
            >
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: 1200,
                        height: 630
                    }}
                >
                    <OgCard {...card} />
                </div>
            </div>
            <div
                style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#5a5648',
                    letterSpacing: '0.06em'
                }}
            >
                1200 × 630 · scale {Math.round(scale * 100)}%
            </div>
        </div>
    );
}
