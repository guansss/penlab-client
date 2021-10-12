<template>
    <div class="app">
        <TheHeader />
        <div class="view">
            <RouterView id="main-router-view" />
        </div>
        <TheFooter />
    </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';
import {
    colorAccent,
    colorBg,
    colorBgDark,
    colorPrimary,
    colorText,
    colorTextDark,
    INJECTION_COLOR_ACCENT,
    INJECTION_COLOR_BG,
    INJECTION_COLOR_BG_DARK,
    INJECTION_COLOR_PRIMARY,
    INJECTION_COLOR_TEXT,
    INJECTION_COLOR_TEXT_DARK,
} from './tools/theme';

provide(INJECTION_COLOR_PRIMARY, colorPrimary);
provide(INJECTION_COLOR_ACCENT, colorAccent);
provide(INJECTION_COLOR_BG, colorBg);
provide(INJECTION_COLOR_BG_DARK, colorBgDark);
provide(INJECTION_COLOR_TEXT, colorText);
provide(INJECTION_COLOR_TEXT_DARK, colorTextDark);
</script>

<style>
@import 'bootstrap/dist/css/bootstrap-grid.css';

:root {
    /*
     * these vars will be assigned by tools/theme.ts,
     * they are here only for code hinting
     */
    --color-primary: #fff;
    --color-primary-rgb: 0, 0, 0;
    --color-accent: 0, 0, 0;
    --color-accent-rgb: #fff;
    --color-bg: #fff;
    --color-bg-dark: #fff;
    --color-text: #fff;
    --color-text-secondary: #fff;
    --color-text-dark: #fff;
}

* {
    margin: 0;
    box-sizing: border-box;
}

a {
    display: inline-flex;
    align-items: center;
    color: var(--color-primary);
    text-decoration: none;
    transition: color 0.1s ease-out, background-color 0.2s ease-out;

    &:active,
    &:visited {
        color: var(--color-primary);
    }

    &:hover {
        color: var(--color-accent);
    }
}

svg {
    fill: currentColor;
}

.selectable,
.button {
    transition: background-color 0.2s ease-out;

    &:hover {
        color: var(--color-primary);
        background: rgba(var(--color-primary-rgb), 0.1);
    }

    &:active {
        background: rgba(var(--color-primary-rgb), 0.3);
    }
}

.button {
    padding: 6px 12px;
    border-radius: 2px;
}
</style>

<style scoped>
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 18px;
}

.view {
    flex-grow: 1;
}
</style>
