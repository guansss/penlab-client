<template>
    <div ref="element" class="floating-title">
        <transition name="fade">
            <h1 v-if="title" class="title">{{ title }}</h1></transition
        >
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { emitter, Events } from '../event';

const element = ref<HTMLDivElement | undefined>();
const title = ref('');

const intermediateStyles = {
    top: '0',
    left: '0',
    width: '0',
};

let animationProcess: Promise<void> | undefined;

emitter.on('articleOpenedByTitle', animate);
emitter.on('articleTitlePrinted', transitionToDestination);
emitter.on('articleClosed', dismiss);

onBeforeUnmount(() => {
    emitter.off('articleOpenedByTitle', animate);
    emitter.off('articleTitlePrinted', transitionToDestination);
    emitter.off('articleClosed', dismiss);
});

function animate(data: Events['articleOpenedByTitle']) {
    if (!element.value) {
        return;
    }

    title.value = data.title;

    intermediateStyles.top = '128px';
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
                color: 'var(--color-text)',
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

async function transitionToDestination(data: Events['articleTitlePrinted']) {
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

    animation.onfinish = async () => {
        title.value = '';

        data.onfinish();
    };
}

function dismiss() {
    title.value = '';
}
</script>

<style scoped>
.floating-title {
    position: absolute;
    top: 128px;
    color: var(--color-text);

    .title {
        font-size: inherit;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
