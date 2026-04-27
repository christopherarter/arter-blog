import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OgCard, type OgCardProps } from './OgCard';
import { loadOgFonts } from './fonts';

export async function renderOgPng(props: OgCardProps): Promise<Uint8Array> {
    const fonts = await loadOgFonts();
    const svg = await satori(OgCard(props), {
        width: 1200,
        height: 630,
        fonts
    });
    const png = new Resvg(svg, {
        fitTo: { mode: 'width', value: 1200 }
    })
        .render()
        .asPng();
    return png;
}
