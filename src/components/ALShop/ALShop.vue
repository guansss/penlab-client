<template>
    <canvas class="al-shop" ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>

<style scoped>
.al-shop {
    touch-action: auto !important;
    image-rendering: pixelated;
}
</style>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { emitter } from '../../event';
import { logger } from '../../utils/logger';
import { canvasHeight, canvasWidth, clearAnimation, jumpBirds, loadSpriteSheet, setupAnimation } from './animation';

const canvas = ref<HTMLCanvasElement>();

// preload assets when creating the component
loadSpriteSheet().catch(logger.warn);

emitter.on('themeChanged', jumpBirds);

onMounted(async function () {
    try {
        await setupAnimation(canvas.value!);

        jumpBirds().then();
    } catch (e) {
        logger.warn('ALShop', e);
    }

    canvas.value?.addEventListener('touchstart', () => jumpBirds());
    canvas.value?.addEventListener('mouseover', () => jumpBirds());
});

onBeforeUnmount(() => {
    emitter.off('themeChanged', jumpBirds);

    clearAnimation();
});
</script>
