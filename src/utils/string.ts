export function rgbHexToDecimal(hex: string) {
    if (hex.length === 7) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 0xff;
        const g = (bigint >> 8) & 0xff;
        const b = bigint & 0xff;

        return r + ',' + g + ',' + b;
    } else if (hex.length === 4) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 8) & 0xf;
        const g = (bigint >> 4) & 0xf;
        const b = bigint & 0xf;

        return (r | (r << 4)) + ',' + (g | (g << 4)) + ',' + (b | (b << 4));
    }

    throw new TypeError('Invalid hex string: ' + hex);
}

export function formatDate(date: Date | number, format: 'date' | 'time' | 'datetime' = 'datetime') {
    if (typeof date === 'number') {
        date = new Date(date);
    }

    const units = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
    ].map(padTwoDigit);

    const dateStr = units.slice(0, 3).join('/');
    const timeStr = units.slice(3).join(':');

    switch (format) {
        case 'date':
            return dateStr;
        case 'datetime':
            return timeStr;
        default:
            return dateStr + ' ' + timeStr;
    }
}

function padTwoDigit(value: number | string) {
    return String(value).padStart(2, '0');
}
