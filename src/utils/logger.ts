export const LOG_LEVEL_VERBOSE = 0;
export const LOG_LEVEL_WARNING = 1;
export const LOG_LEVEL_ERROR = 2;
export const LOG_LEVEL_NONE = 999;

export let logLevel = (import.meta as any).env.PROD ? LOG_LEVEL_WARNING : LOG_LEVEL_VERBOSE;

/**
 * A simple tagged logger.
 *
 * You can replace the methods with your own ones.
 *
 * ```js
 * import { logger } from 'pixi-live2d-display';
 *
 * logger.log = (tag, ...messages) => {
 *     console.log(tag, 'says:', ...messages);
 * };
 * ```
 */
export namespace logger {
    export function log(tag: string, ...messages: any[]) {
        if (logLevel <= LOG_LEVEL_VERBOSE) {
            callLog(console.log, tag, messages);
        }
    }

    export function warn(tag: string, ...messages: any[]) {
        if (logLevel <= LOG_LEVEL_WARNING) {
            callLog(console.warn, tag, messages);
        }
    }

    export function error(tag: string, ...messages: any[]) {
        if (logLevel <= LOG_LEVEL_ERROR) {
            callLog(console.error, tag, messages);
        }
    }

    function callLog(fn: (...data: any[]) => void, tag: string, messages: any[]) {
        if (messages.length) {
            fn.call(null, `[${tag}]`, ...messages);
        } else {
            fn.call(null, tag);
        }
    }

    // handy method for development
    (window as any).noLog = () => (logLevel = LOG_LEVEL_NONE);
}
