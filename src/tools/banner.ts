import { dimensions } from './dimensions';

export interface BannerAnchor {
    x: number;
    y: number;
    relative?: boolean;
}

export function normalizeAnchor(anchor: BannerAnchor, containerWidth?: number): BannerAnchor {
    if (anchor.relative) {
        if (containerWidth === undefined) {
            throw new Error('Could not resolve relative anchor because container width is undefined.');
        }

        const marginLeft = (document.body.clientWidth - containerWidth) / 2;

        return {
            x: anchor.x + marginLeft,
            y: anchor.y + dimensions.headerHeight,
            relative: anchor.relative,
        };
    }

    return {
        x: anchor.x,
        y: anchor.y,
        relative: anchor.relative,
    };
}

export function getBannerAngle(anchor: BannerAnchor) {
    return Math.atan((anchor.y - dimensions.headerHeight) / (document.body.clientWidth - anchor.x));
}
