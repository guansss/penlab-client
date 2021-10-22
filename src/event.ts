import mitt from 'mitt';
import { BannerAnchor } from './tools/banner';
import { Theme, ThemeName } from './tools/theme';

export type Events = {
    bannerAnchor: BannerAnchor;

    themeChange: {
        name: ThemeName;
        origin?: [x: number, y: number];
        onBackgroundChanged?: () => void;
    };

    themeChanged: {
        theme: Theme;
    };

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
