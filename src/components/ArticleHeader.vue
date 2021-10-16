<template>
    <header ref="headerElm" :class="['article-header', { invisible: !visible, 'no-transition': noTransition }]">
        <h1 class="title">{{ title }}</h1>
        <small class="date">{{ date }}</small>
        <div class="clip-header">
            <h1 ref="titleElm" class="title">{{ title }}</h1>
            <small class="date">{{ date }}</small>
        </div>
    </header>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { emitter } from '../event';
import { ARTICLE_CRUMB_HEIGHT, HEADER_HEIGHT } from '../globals';

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

const clearNoTransition = debounce(() => (noTransition.value = false), 100);

watch(
    () => props.title,
    async () => {
        // wait until the title has been rendered
        await nextTick();

        updateHeader();
    },
    { immediate: true }
);

window.addEventListener('resize', resizeHeader);

onBeforeUnmount(() => window.removeEventListener('resize', resizeHeader));

// disable transition when window is resizing
function resizeHeader() {
    noTransition.value = true;
    clearNoTransition();
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

            emitter.emit('bannerAnchor', {
                x: bounds.x,
                y: bounds.bottom + clipMarginBottom,
            });

            updateClip(bounds);
        },
    });
}

function updateClip(titleBounds: DOMRect) {
    const clipBottom = titleBounds.height + clipMarginBottom;

    clipYLeft.value = clipBottom + 'px';

    clipYRight.value =
        clipBottom -
        (titleBounds.width / (document.body.clientWidth - titleBounds.x)) *
            (titleBounds.bottom + clipMarginBottom - HEADER_HEIGHT) +
        'px';
}
</script>

<style scoped>
.article-header {
    position: relative;
    margin-bottom: calc(v-bind(clipMarginBottom) * 1px + 16px);

    .title {
        color: #fff;
        font-size: 48px;
    }

    .date {
        color: #ccc;
    }

    .clip-header {
        position: absolute;
        top: 0;
        width: 100%;
        clip-path: polygon(0 v-bind(clipYLeft), 100% v-bind(clipYRight), 100% 100%, 0 100%);
        transition: clip-path 0.5s ease-out;

        &.no-transition {
            transition: none;
        }

        .title {
            color: var(--color-primary);
        }

        .date {
            color: var(--color-text-secondary);
        }
    }
}
</style>
