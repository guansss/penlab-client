<template>
    <div ref="button" :class="['light-dark', dark ? 'dark' : 'light', { disabled }]" @click="toggle">
        <mdi-sun class="sun" />
        <mdi-night class="night" />
    </div>
</template>

<script setup lang="ts">
import MdiSun from '@mdi/svg/svg/white-balance-sunny.svg';
import { ref } from 'vue';
import MdiNight from '../assets/icon/weather-night.svg';
import { emitter, Events } from '../event';
import { getTheme } from '../tools/theme';

const dark = ref(getTheme().name === 'dark');
const disabled = ref(false);
const button = ref<HTMLElement | undefined>();

function toggle() {
    dark.value = !dark.value;
    disabled.value = true;

    const eventData: Events['themeChange'] = {
        name: dark.value ? 'dark' : 'light',
        onBackgroundChanged: settle,
    };

    if (button.value) {
        const bounds = button.value!.getBoundingClientRect();

        eventData.origin = [bounds.left + bounds.width / 2, bounds.top + bounds.height / 2];
    }

    emitter.emit('themeChange', eventData);
}

function settle() {
    disabled.value = false;
}
</script>

<style scoped>
.light-dark {
    position: relative;
    width: 48px;
    height: 48px;
    overflow: hidden;

    &:not(.disabled):hover {
        &.light .sun,
        &.dark .night {
            opacity: 0.4;
            transform: scale(0.8) translateY(-20%);
        }

        &.light .night,
        &.dark .sun {
            opacity: 1;
            transform: translateY(20%);
        }
    }

    &.disabled {
        pointer-events: none;
    }
}

.sun,
.night {
    position: absolute;
    top: 12px;
    left: 12px;
    transition: transform 0.2s ease-out;
}

.light .night,
.dark .sun {
    opacity: 0;
    transform: translateY(100%);
}
</style>
