import { InjectionKey } from 'vue';

export const INJECTION_COLOR_PRIMARY: InjectionKey<string> = Symbol();
export const INJECTION_COLOR_ACCENT: InjectionKey<string> = Symbol();
export const INJECTION_COLOR_BG: InjectionKey<string> = Symbol();
export const INJECTION_COLOR_BG_DARK: InjectionKey<string> = Symbol();
export const INJECTION_COLOR_TEXT: InjectionKey<string> = Symbol();
export const INJECTION_COLOR_TEXT_DARK: InjectionKey<string> = Symbol();

export const colorPrimary = '#546e7a';
export const colorAccent = '#ff6d00';
export const colorBg = '#FAFAFA';
export const colorBgDark = '#333';
export const colorText = '#333';
export const colorTextSecondary = '#888';
export const colorTextDark = '#FFF';

document.documentElement.style.setProperty('--color-primary', colorPrimary);
document.documentElement.style.setProperty('--color-accent', colorAccent);
document.documentElement.style.setProperty('--color-bg', colorBg);
document.documentElement.style.setProperty('--color-bg-dark', colorBgDark);
document.documentElement.style.setProperty('--color-text', colorText);
document.documentElement.style.setProperty('--color-text-secondary', colorTextSecondary);
document.documentElement.style.setProperty('--color-text-dark', colorTextDark);

document.documentElement.style.setProperty('--color-primary-rgb', '84, 110, 122');
document.documentElement.style.setProperty('--color-accent-rgb', '255, 109, 0');
