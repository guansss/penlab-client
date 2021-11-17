<template>
    <div class="bg">
        <div v-if="transitioning" ref="circle" class="circle"></div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue';
import { emitter, Events } from '../event';
import { getTheme } from '../tools/theme';

const originTop = ref('0');
const originLeft = ref('0');
const circleDiameter = ref('0');
const circle = ref<HTMLElement | undefined>();

const currentColor = ref(getTheme().bg);
const newColor = ref('#000');

const transitioning = ref(false);

emitter.on('themeChange', transition);

onBeforeUnmount(() => emitter.off('themeChange', transition));

async function transition(data: Events['themeChange']) {
    if (!data.origin) {
        data.onBackgroundChanged?.();
        return;
    }

    transitioning.value = true;

    // wait for the DOM to render
    await nextTick();

    if (!circle.value) {
        transitioning.value = false;
        data.onBackgroundChanged?.();
        return;
    }

    // since we have waited until nextTick(), the theme should have already been changed
    newColor.value = getTheme().bg;

    const [originX, originY] = data.origin;

    const longestDistanceX = Math.max(originX, window.innerWidth - originX);
    const longestDistanceY = Math.max(originY, window.innerHeight - originY);

    // add a little offset to ensure the circle will fill the entire window
    const radius = ~~Math.sqrt(longestDistanceX ** 2 + longestDistanceY ** 2) + 2;

    circleDiameter.value = radius * 2 + 'px';
    originLeft.value = originX - radius + 'px';
    originTop.value = originY - radius + 'px';

    const animation = circle.value!.animate(
        { transform: ['scale(0)', 'scale(1)'] },
        {
            duration: document.documentElement.style.getPropertyValue('--theme-fade-duration') || 500,
            easing: 'ease-out',
        }
    );

    animation.onfinish = () => {
        currentColor.value = newColor.value;
        transitioning.value = false;

        data.onBackgroundChanged?.();
    };
}
</script>

<style scoped>
.bg {
    position: fixed;
    z-index: -999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: v-bind(currentColor);
    overflow: hidden;
}

.circle {
    position: absolute;
    top: v-bind(originTop);
    left: v-bind(originLeft);
    width: v-bind(circleDiameter);
    height: v-bind(circleDiameter);
    background: v-bind(newColor);
    border-radius: 50%;
    will-change: transform;
    transform-origin: center;
}
</style>
