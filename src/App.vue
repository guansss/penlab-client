<template>
    <div class="app">
        <BgTransition />
        <Stripes />
        <TheHeader />
        <div class="view">
            <router-view />
        </div>
        <TheFooter />
        <FloatingTitle />
        <ImgZoom />
    </div>
</template>

<script setup lang="ts">
import BgTransition from './components/BgTransition.vue';
import FloatingTitle from './components/FloatingTitle.vue';
import ImgZoom from './components/ImgZoom.vue';
import Stripes from './components/Stripes.vue';
import TheFooter from './components/TheFooter.vue';
import TheHeader from './components/TheHeader.vue';
</script>

<style>
@import 'styles/main.css';
@import 'styles/markdown.css';
</style>

<style scoped>
.app {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: var(--color-text);
    transition: color var(--theme-fade-duration) ease-in;
}

.view {
    display: flex;
    flex-grow: 1;
}
</style>
