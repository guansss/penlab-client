import { Router } from 'vue-router';
import { logger } from '../utils/logger';

declare class VConsole {
    constructor(options: any);
}

declare global {
    interface Window {
        VConsole?: typeof VConsole;
        vConsole?: VConsole;
    }
}

let importRequested = false;

export function mountConsole(router: Router) {
    router.afterEach((to) => {
        if (window.VConsole || importRequested) {
            return;
        }

        if (to.hash === '#console') {
            load().catch();
        }
    });
}

async function load() {
    importRequested = true;

    try {
        // @ts-ignore
        await import('https://unpkg.com/vconsole/dist/vconsole.min.js');

        window.vConsole = new window.VConsole!({ theme: 'dark' });
    } catch (e) {
        logger.warn('vConsole', 'Failed to load vConsole', e);
    }
}
