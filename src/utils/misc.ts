export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value: number, lower: number, upper: number) {
    return value < lower ? lower : value > upper ? upper : value;
}
