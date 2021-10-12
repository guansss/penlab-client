import { pickBy } from 'lodash';
import { logger } from '../utils/logger';

export const API_SERVER = import.meta.env.VITE_API_SERVER;

export type APIPrimitive = string | number | boolean | undefined | null;

const LOG_TAG = 'Net';

/**
 * Converts params object to a search string. An "ID" parameter will be
 * specially prepended to the search string.
 *
 * ```js
 * getSearchString({
 *     ID: 1,
 *     id: 2,
 *     foo: 'bar'
 * })
 * // returns "1?id=2&foo=bar"
 * ```
 */
export function getSearchString(params?: Record<string, APIPrimitive>): string {
    if (params) {
        const qualifiedParams = pickBy(params, (value, key) => value !== undefined);

        // despite the type incompatibility, URLSearchParams can actually
        // receive `Record<string, Primitive>` as argument
        const search = new URLSearchParams(qualifiedParams as Record<string, string>).toString();

        return (params.ID || '') + (search ? '?' + search : '');
    }

    return '';
}

export async function api<T>(
    url: string,
    method: string,
    params?: Record<string, APIPrimitive>,
    paramType?: 'search' | 'body',
    resultType: 'json' | 'text' = 'json'
): Promise<T> {
    let fullURL = new URL(url, API_SERVER).toString();

    if (params) {
        if (!paramType) {
            paramType = method === 'GET' ? 'search' : 'body';
        }

        if (paramType === 'search') {
            fullURL += getSearchString(params);
        }
    }

    // empty properties will be stripped
    const headers = pickBy(
        {
            Accept: resultType === 'json' ? 'application/json' : 'text/plain',
            'Content-Type': paramType === 'body' ? 'application/json' : '',
        },
        (value) => value
    );

    const res = await fetch(fullURL, {
        method,
        headers,
        body: paramType === 'body' ? JSON.stringify(params || {}) : undefined,
    });

    if (res.ok) {
        if (resultType === 'text') {
            return res.text() as any as Promise<T>;
        }

        return res.json();
    } else {
        let message = '';
        let code = -1;

        try {
            const { error } = await res.json();

            if (error) {
                if (typeof error === 'string') {
                    message = error;
                } else if (error.message) {
                    message = error.message;
                    code = error.code;
                }
            }
        } catch (e) {
            logger.warn(LOG_TAG, 'Could not parse API error.', e);
        }

        throw new APIError(message, fullURL, res.status, code);
    }
}

class APIError extends Error {
    constructor(message: string, public url: string, public status: number, public code?: number) {
        super();
        this.message = `${message} (url=${url}, status=${status} code=${code})`;
        this.name = 'APIError';
    }
}
