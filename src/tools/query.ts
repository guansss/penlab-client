import { intersection } from 'lodash';
import { LocationQueryValue } from 'vue-router';
import { clamp } from '../utils/misc';

export function qualifyQueryInteger(
    value: LocationQueryValue | LocationQueryValue[] | number,
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
    value: LocationQueryValue | LocationQueryValue[],
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
