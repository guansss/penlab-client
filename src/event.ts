import mitt from 'mitt';

export type Events = {
    bannerAnchor: {
        x: number;
        y: number;
        relative?: boolean;
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
