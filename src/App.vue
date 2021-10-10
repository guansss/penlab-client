<template>
    <div class="app">
        <TheHeader />
        <div class="main">
            <RouterView id="main-router-view" />
        </div>
        <TheFooter />
    </div>
</template>

<script setup lang="ts">
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';</script>

<style>
@import "bootstrap/dist/css/bootstrap-grid.css";

:root {
    --theme-primary: #546e7a;
    --bg-color: #EEE;
    --bg-color-dark: #333;
    --color: #333;
    --color-dark: #FFF;
}

* {
    margin: 0;
    box-sizing: border-box;
}

.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    background: var(--bg-color);
}

.main {
    flex-grow: 1;
}
</style>
