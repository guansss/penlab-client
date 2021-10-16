import mitt from 'mitt';
import { BannerAnchor } from './tools/banner';

export type Events = {
    bannerAnchor: BannerAnchor;

    articleOpenedByTitle: {
        title: string;
        x: number;
        y: number;
        width: number;
        pressed: boolean;
    };

    articleLoaded: {
        x: number;
        y: number;
        width: number;
    };

    articleHeaderPrinted: {
        x: number;
        y: number;
        width: number;
        height: number;
        onfinish: () => void;
    };

    articleClosed: void;
};

export const emitter = mitt<Events>();
