<template>
    <div ref="element" :class="['floating-title', { invisible: !visible }]">
        <h1 class="title">{{ title }}</h1>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { emitter, Events } from '../event';
import { ARTICLE_CRUMB_HEIGHT, HEADER_HEIGHT } from '../globals';

const element = ref<HTMLDivElement | undefined>();
const title = ref('');
const visible = ref(false);

const intermediateStyles = {
    top: '0',
    left: '0',
    width: '0',
};

let animationProcess: Promise<void> | undefined;

emitter.on('articleOpenedByTitle', animate);
emitter.on('articleHeaderPrinted', transitionToDestination);
emitter.on('articleClosed', dismiss);

onBeforeUnmount(() => {
    emitter.off('articleOpenedByTitle', animate);
    emitter.off('articleHeaderPrinted', transitionToDestination);
    emitter.off('articleClosed', dismiss);
});

function animate(data: Events['articleOpenedByTitle']) {
    if (!element.value) {
        return;
    }

    title.value = data.title;
    visible.value = true;

    intermediateStyles.top = HEADER_HEIGHT + ARTICLE_CRUMB_HEIGHT + 'px';
    intermediateStyles.left = data.x - 20 + 'px';
    intermediateStyles.width = data.width + 16 + 'px';

    const animation = element.value.animate(
        [
            {
                top: data.y + 'px',
                left: data.x + 'px',
                width: data.width + 'px',
                color: data.pressed ? 'var(--color-accent)' : 'var(--color-primary)',
                fontSize: '24px',
            },
            {
                top: intermediateStyles.top,
                left: intermediateStyles.left,
                width: intermediateStyles.width,
                color: 'var(--color-primary)',
                fontSize: '48px',
            },
        ],
        {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards',
        }
    );

    animationProcess = new Promise((resolve) => {
        animation.onfinish = animation.oncancel = resolve as any;
    });
}

async function transitionToDestination(data: Events['articleHeaderPrinted']) {
    if (!animationProcess) {
        data.onfinish();
        return;
    }

    await animationProcess;

    animationProcess = undefined;

    if (!element.value) {
        return;
    }

    const animation = element.value.animate(
        [
            {
                top: intermediateStyles.top,
                left: intermediateStyles.left,
                width: intermediateStyles.width,
            },
            {
                top: data.y + 'px',
                left: data.x + 'px',
                width: data.width + 'px',
            },
        ],
        {
            duration: 200,
            easing: 'ease-in-out',
            fill: 'forwards',
        }
    );

    animation.onfinish = () => {
        visible.value = false;

        data.onfinish();
    };
}

function dismiss() {
    visible.value = false;
}
</script>

<style scoped>
.floating-title {
    position: absolute;
    transition: opacity 0.1s ease-out;
    pointer-events: none;

    .title {
        font-size: inherit;
    }
}
</style>
