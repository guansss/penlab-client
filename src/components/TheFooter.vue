<template>
    <footer class="footer" @click="raiseLogo" @mousedown="preventDoubleClick">
        <div class="logo-wrapper">
            <div :class="['logo', { shine: logoShine }]">Pencil's Lab</div>
        </div>
        <div class="content container">
            <span class="copyright">©Pencil</span>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const ANGLE_MIN = -5;
const ANGLE_STEP = (0 - ANGLE_MIN) / 25;

const OPACITY_MAX = 0.2;
const OPACITY_MIN = 0.1;
const OPACITY_STEP = (OPACITY_MAX - OPACITY_MIN) / 15;

const logoAngle = ref('-5deg');
const logoOpacity = ref(0.1);
const logoShine = ref(false);

function raiseLogo() {
    let angle = Number(logoAngle.value.slice(0, -3));

    angle = Math.min(0, angle + ANGLE_STEP);

    logoAngle.value = angle + 'deg';

    logoOpacity.value = Math.min(OPACITY_MAX, logoOpacity.value + OPACITY_STEP);

    if (angle === 0) {
        logoShine.value = true;
    }
}

// prevent selecting texts by double clicks
function preventDoubleClick(e: MouseEvent) {
    if (e.detail > 1) {
        e.preventDefault();
    }
}
</script>

<style scoped>
.footer {
    position: relative;
    background: var(--color-bg-darken);
    color: #fff;
    transition: background-color var(--theme-fade-duration) ease-in;
}

.logo-wrapper {
    position: absolute;
    z-index: -100;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 186px;
    text-align: right;
    user-select: none;
    overflow: hidden;
    pointer-events: none;
}

.logo {
    display: inline-block;
    color: var(--color-text-secondary);
    font-family: Impact, serif;
    font-weight: bold;
    font-size: 150px;
    line-height: 1;
    white-space: nowrap;
    opacity: v-bind(logoOpacity);
    transform-origin: 125% 0;
    transform: rotate(v-bind(logoAngle));

    &.shine {
        background: linear-gradient(
            110deg,
            var(--color-text-secondary) 0,
            var(--color-text-secondary) 48%,
            #0000 49%,
            #0000 51%,
            var(--color-text-secondary) 52%,
            var(--color-text-secondary) 100%
        );
        background-size: 215% 100%;
        background-clip: text;
        color: #0000;
        animation: bg-slide 1s ease;
    }
}

.content {
    /* do not use the padding shorthand as it overwrites the horizontal paddings of .container */
    padding-top: 16px;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
}
</style>
