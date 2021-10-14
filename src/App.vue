<template>
    <div class="app">
        <TheHeader />
        <div class="view">
            <router-view />
        </div>
        <TheFooter />
        <FloatingTitle />
    </div>
</template>

<script setup lang="ts">
import { provide } from 'vue';
import FloatingTitle from './components/FloatingTitle.vue';
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
@import 'styles/main.css';
@import 'styles/markdown.css';
</style>

<style scoped>
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
    color: var(--color-text);
}

.view {
    flex-grow: 1;
}
</style>
