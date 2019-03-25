/**
 * Created by Pencil on 2018/10/30.
 */

/**
 * Not recursive!!!
 * @param src source object
 * @param dst destination object
 * @param keys an array of keys to copy from source object
 * @param overrides true to override undefined values to destination object
 */
export function copyProperties(dst, src, keys = Object.keys(src), overrides = true) {
    for (const key of keys) {
        if (overrides || src.hasOwnProperty(key))
            dst[key] = src[key];
    }

    return dst;
}

export function postFetch(url, json, options) {
    return fetch(url, Object.assign({
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
    }, options));
}