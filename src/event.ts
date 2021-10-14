import mitt from 'mitt';

export type Events = {
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

    articleTitlePrinted: {
        x: number;
        y: number;
        width: number;
        onfinish: () => void;
    };

    articleClosed: void;
};

export const emitter = mitt<Events>();
