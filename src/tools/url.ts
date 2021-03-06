import { intersection } from 'lodash';
import { LocationQueryValue, RouteLocationNormalized } from 'vue-router';
import { clamp } from '../utils/misc';

export function qualifyQueryInteger(
    value: LocationQueryValue | LocationQueryValue[] | number | undefined,
    min: number,
    max: number
) {
    value = parseInt(value as string);

    if (isNaN(value)) {
        return min;
    }

    return clamp(value, min, max);
}

export function qualifyQueryString<T extends string[] | string>(
    value: LocationQueryValue | LocationQueryValue[] | undefined,
    samples: string[],
    defaultValue?: string
): T {
    if (Array.isArray(value)) {
        return intersection(value, samples) as T;
    }

    if (defaultValue === undefined) {
        throw new Error('Default value not provided.');
    }

    return (samples.includes(value as any) ? value : defaultValue) as T;
}

export function equalsWithoutHash(a: RouteLocationNormalized, b: RouteLocationNormalized) {
    const purePathA = a.hash.length ? a.fullPath.slice(0, -a.hash.length) : a.fullPath;
    const purePathB = b.hash.length ? b.fullPath.slice(0, -b.hash.length) : b.fullPath;

    return purePathA === purePathB;
}
