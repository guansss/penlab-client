import { kebabCase } from 'lodash';
import { emitter, Events } from '../event';
import { STORAGE_THEME } from '../globals';
import { rgbHexToDecimal } from '../utils/string';

export interface Theme {
    readonly name: string;
    readonly bg: string;
    readonly bgDarken: string;
    readonly bgInvert: string;
    readonly text: string;
    readonly textSecondary: string;
    readonly primary: string;
    readonly accent: string;
}

const themesUntyped = [
    {
        name: 'light',
        bg: '#FFF',
        bgDarken: '#333',
        bgInvert: '#000',
        text: '#333',
        textSecondary: '#888',
        primary: '#546e7a',
        accent: '#ff6d00',
    },
    {
        name: 'dark',
        bg: '#222',
        bgDarken: '#151515',
        bgInvert: '#FAFAFA',
        text: '#C8C8C8',
        textSecondary: '#888',
        primary: '#546e7a',
        accent: '#ff6d00',
    },
] as const;

export type ThemeName = typeof themesUntyped[number]['name'];

export const themes: Readonly<Theme[]> = themesUntyped;

// properties that should be set as CSS color variables
const colorVars: (keyof Theme)[] = ['bg', 'bgDarken', 'bgInvert', 'text', 'textSecondary', 'primary', 'accent'];

// properties that should be set as CSS color variables with an RGB format like "0, 0, 0"
const colorVarsRGB: (keyof Theme)[] = ['bgInvert', 'primary', 'accent'];

const DEFAULT_THEME: ThemeName = 'light';

let currentTheme: Theme;

emitter.on('themeChange', changeTheme);

init();

function init() {
    const name = localStorage.getItem(STORAGE_THEME) || DEFAULT_THEME;

    if (!setTheme(name)) {
        setTheme(DEFAULT_THEME);
    }
}

function setTheme(name: string) {
    const newTheme = themes.find((theme) => theme.name === name);

    if (!newTheme) {
        return false;
    }

    if (currentTheme) {
        document.body.classList.remove('theme-' + currentTheme.name);
    }

    currentTheme = newTheme;

    document.body.classList.add('theme-' + newTheme.name);

    applyCSSVars();

    return true;
}

export function changeTheme(data: Events['themeChange']) {
    if (setTheme(data.name)) {
        localStorage.setItem(STORAGE_THEME, data.name);

        emitter.emit('themeChanged', { theme: currentTheme });
    }
}

export function getTheme(): Theme {
    return currentTheme;
}

function applyCSSVars() {
    for (const themeVar of colorVars) {
        const colorVar = '--color-' + kebabCase(themeVar);

        document.documentElement.style.setProperty(colorVar, currentTheme[themeVar]);

        if (colorVarsRGB.includes(themeVar)) {
            document.documentElement.style.setProperty(colorVar + '-rgb', rgbHexToDecimal(currentTheme[themeVar]));
        }
    }
}
