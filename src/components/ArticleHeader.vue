<template>
    <header ref="headerElm" :class="['article-header', { invisible: !visible, 'no-transition': noTransition }]">
        <div class="top-header">
            <h1 class="title">{{ title }}</h1>
            <small class="date">{{ date }}</small>
        </div>
        <div class="bottom-header">
            <h1 ref="titleElm" class="title">{{ title }}</h1>
            <small class="date">{{ date }}</small>
        </div>
    </header>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { onBeforeUnmount, ref, watch } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { emitter } from '../event';
import { ARTICLE_CRUMB_HEIGHT, HEADER_HEIGHT } from '../globals';
import { BannerAnchor, getBannerAngle } from '../tools/banner';
import { delay } from '../utils/misc';

const clipMarginBottom = 30;

const props = defineProps({
    title: String,
    date: String,
});

const vueEmit = defineEmits(['animStart']);

const headerElm = ref<HTMLHeadingElement | undefined>();
const visible = ref(false);
const clipYLeft = ref(-ARTICLE_CRUMB_HEIGHT + 'px');
const clipYRight = ref(-ARTICLE_CRUMB_HEIGHT + 'px');
const noTransition = ref(false);

const scheduleClearingNoTransition = debounce(() => (noTransition.value = false), 100);

watch(
    () => props.title,
    async () => {
        // the delay has two purpose:
        // 1. wait for the header to be rendered, which can be achieved by nextTick() as well.
        // 2. fix an animation issue where the clip's transition is slightly slower than banner's,
        //    which can't be achieved by nextTick() and I couldn't figure out why.
        await delay(0);

        updateHeader();
    },
    { immediate: true }
);

onBeforeRouteLeave(resetClip);

window.addEventListener('resize', resizeHeader);

onBeforeUnmount(() => window.removeEventListener('resize', resizeHeader));

// disable transition while window is resizing
function resizeHeader() {
    noTransition.value = true;
    scheduleClearingNoTransition();
    updateHeader();
}

function updateHeader() {
    if (!props.title || !headerElm.value) {
        return;
    }

    const bounds = headerElm.value.getBoundingClientRect();

    emitter.emit('articleHeaderPrinted', {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,

        onfinish() {
            visible.value = true;

            vueEmit('animStart');

            const anchor = {
                x: bounds.x,
                y: bounds.height + HEADER_HEIGHT + ARTICLE_CRUMB_HEIGHT + clipMarginBottom,
            };

            emitter.emit('bannerAnchor', anchor);

            updateClip(bounds, anchor);
        },
    });
}

function updateClip(headerBounds: DOMRect, anchor: BannerAnchor) {
    const clipBottom = headerBounds.height + clipMarginBottom;
    const angle = getBannerAngle(anchor);

    clipYLeft.value = clipBottom + 'px';
    clipYRight.value = clipBottom - headerBounds.width * Math.tan(angle) + 'px';
}

function resetClip() {
    clipYLeft.value = -ARTICLE_CRUMB_HEIGHT + 'px';
    clipYRight.value = -ARTICLE_CRUMB_HEIGHT + 'px';
}
</script>

<style scoped>
.article-header {
    position: relative;
    margin-bottom: calc(v-bind(clipMarginBottom) * 1px + 16px);
    cursor: default;

    &.no-transition {
        .top-header,
        .bottom-header {
            transition: none;
        }
    }

    .title {
        color: #fff;
        font-size: 48px;
    }

    .date {
        display: inline-block;
        margin-top: 8px;
        color: #ccc;
    }

    .top-header {
        clip-path: polygon(0 v-bind(clipYLeft), 100% v-bind(clipYRight), 100% 0, 0 0);
        transition: clip-path 0.3s ease-out;
    }

    .bottom-header {
        position: absolute;
        top: 0;
        width: 100%;
        pointer-events: none;
        user-select: none;
        clip-path: polygon(0 v-bind(clipYLeft), 100% v-bind(clipYRight), 100% 100%, 0 100%);
        transition: clip-path 0.3s ease-out;

        .title {
            color: var(--color-primary);
        }

        .date {
            color: var(--color-text-secondary);
        }
    }
}
</style>
