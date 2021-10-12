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
