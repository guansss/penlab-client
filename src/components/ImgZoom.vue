<template>
    <transition name="fade">
        <div v-if="active" class="img-zoom" @wheel="onMouseWheel" @click="active = false">
            <div v-movable="isMovable && 'img'">
                <img
                    class="img"
                    :src="src"
                    draggable="false"
                    :style="{ transform: `scale(${imgScale})` }"
                    @load="imgLoaded"
                    @click.stop=""
                />
            </div>
            <mdi-window-close class="close button" viewBox="0 0 24 24" />
        </div>
    </transition>
</template>

<script setup lang="ts">
import MdiWindowClose from '@mdi/svg/svg/window-close.svg';
import { onBeforeUnmount, ref, watch } from 'vue';
import { emitter, Events } from '../event';
import { lockPageScroll, unlockPageScroll } from '../utils/dom';
import { supportsTouch } from '../utils/mobile';

const active = ref(false);
const src = ref('');
const imgScale = ref(1);
const isMovable = ref(false);

watch(active, (value) => {
    if (value) {
        lockPageScroll();
    } else {
        unlockPageScroll();
    }
});

emitter.on('imgZoom', imgZoom);

onBeforeUnmount(() => {
    emitter.off('imgZoom', imgZoom);
    unlockPageScroll();
});

function imgZoom(data: Events['imgZoom']) {
    if (!data.img.src) {
        return;
    }

    active.value = true;
    imgScale.value = 1;
    src.value = data.img.src;

    // there's no need to provide dragging functionality on a device that supports touch,
    // as users can easily zoom and move the image by gestures,
    // in addition, handling dragging by touch events is problematic
    isMovable.value = !supportsTouch();
}

function imgLoaded(e: Event) {
    const img = e.target as HTMLImageElement;

    const scaleX = (innerWidth * 0.8) / img.naturalWidth;
    const scaleY = (innerHeight * 0.8) / img.naturalHeight;

    // fit image inside the window
    imgScale.value = Math.min(1, scaleY / scaleX);
}

function onMouseWheel(e: WheelEvent) {
    e.preventDefault();

    imgScale.value = Math.max(0.1, imgScale.value - e.deltaY * 0.001);
}
</script>

<style scoped>
.img-zoom {
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0006;
}

.img {
    width: 80vw;
    box-shadow: 0 2px 20px 2px #0009;
}

.close {
    position: absolute;
    z-index: 1001;
    right: 0;
    top: 0;
    padding: 8px;
    width: 72px;
    height: 72px;
    color: #fff !important;
    filter: drop-shadow(0 0 2px #0009);

    &:hover {
        background: #fff3;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
