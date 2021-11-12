<template>
    <div ref="element" :class="['floating-title', { invisible: !visible }]">
        <h1 class="title">{{ title }}</h1>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { emitter, Events } from '../event';
import { ROUTE_ARTICLE } from '../router';
import { breakpoints, dimensions } from '../tools/dimensions';

const element = ref<HTMLDivElement | undefined>();
const title = ref('');
const visible = ref(false);

const intermediateStyles = {
    top: '0',
    left: '0',
    width: '0',
};

let raisingAnimation: Animation | undefined;
let raisingProcess: Promise<void> | undefined;

// the raising animation is postponed until the afterEach guard is invoked
// in order to wait for the lazy-load component
const cancelNavGuard = useRouter().afterEach((to) => {
    if (to.name === ROUTE_ARTICLE) {
        startRaising();
    }
});

emitter.on('articleOpenedByTitle', prepareRaising);
emitter.on('articleHeaderPrinted', fitFinalBounds);
emitter.on('articleClosed', dismiss);

onBeforeUnmount(() => {
    emitter.off('articleOpenedByTitle', prepareRaising);
    emitter.off('articleHeaderPrinted', fitFinalBounds);
    emitter.off('articleClosed', dismiss);
    cancelNavGuard();
});

function prepareRaising(data: Events['articleOpenedByTitle']) {
    if (!element.value) {
        return;
    }

    title.value = data.title;
    visible.value = true;

    const articleContainerPaddingX = 12;
    const postsContainerPaddingX = innerWidth < breakpoints.sm ? 0 : 12;
    const postItemPaddingX = 16;

    intermediateStyles.top = dimensions.headerHeight + dimensions.articleCrumbHeight + 'px';
    intermediateStyles.left = data.x + (articleContainerPaddingX - (postItemPaddingX + postsContainerPaddingX)) + 'px';
    intermediateStyles.width = dimensions.containerWidth - articleContainerPaddingX * 2 + 'px';

    if (raisingAnimation) {
        raisingAnimation.cancel();
    }

    raisingAnimation = element.value!.animate(
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

    // don't start yet!
    raisingAnimation.pause();
}

function startRaising() {
    if (raisingAnimation) {
        raisingProcess = new Promise((resolve) => {
            raisingAnimation!.onfinish = raisingAnimation!.oncancel = () => {
                raisingAnimation = undefined;

                resolve();
            };
        });

        raisingAnimation.play();
    }
}

async function fitFinalBounds(data: Events['articleHeaderPrinted']) {
    if (!raisingProcess) {
        data.onfinish();
        return;
    }

    await raisingProcess;

    raisingProcess = undefined;

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
