<template>
    <div :class="['banner', { collapsing, 'no-transition': noTransition }]" v-bind="$attrs"></div>

    <!-- a placeholder for tracking the container's size -->
    <div ref="container" class="container"></div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { onBeforeUnmount, ref, watch } from 'vue';
import { NavigationFailure, RouteLocationNormalized } from 'vue-router';
import { emitter } from '../event';
import { ROUTE_HOME, ROUTE_POSTS, ROUTE_WORKS, router } from '../router';
import { BannerAnchor, getBannerAngle, normalizeAnchor } from '../tools/banner';
import { logger } from '../utils/logger';

const angle = ref('0rad');
const x = ref(0);
const y = ref(0);
const container = ref<HTMLElement | undefined>();
const noTransition = ref(false);
const collapsing = ref(true);

const clearNoTransition = debounce(() => (noTransition.value = false), 100);

watch(angle, (value, oldValue) => (collapsing.value = value >= oldValue));

emitter.on('bannerAnchor', updateAnchor);
window.addEventListener('resize', resizeShape);

onBeforeUnmount(() => {
    emitter.off('bannerAnchor', updateAnchor);
    window.removeEventListener('resize', resizeShape);
});

// reset the anchor when navigating to a new route
router.beforeEach((to, from) => {
    if (to.name !== from.name) {
        updateAnchor({ x: 0, y: 0, relative: true });
    }
});

router.afterEach(updateAnchorByRoute);

// initialize
updateAnchorByRoute(router.currentRoute as any as RouteLocationNormalized);

function updateAnchorByRoute(
    to: RouteLocationNormalized,
    from?: RouteLocationNormalized,
    failure?: NavigationFailure | void
) {
    if (failure) {
        return;
    }

    switch (to.name) {
        case ROUTE_HOME:
            updateAnchor({
                x: 0,
                y: 200,
                relative: true,
            });
            break;

        case ROUTE_WORKS:
            updateAnchor({
                x: 0,
                y: window.innerHeight / 3,
            });
            break;

        case ROUTE_POSTS:
            updateAnchor({
                x: 0,
                y: 0,
                relative: true,
            });
            break;
    }
}

function updateAnchor(anchor: BannerAnchor) {
    if (anchor.x === x.value && anchor.y === y.value) {
        return;
    }

    try {
        anchor = normalizeAnchor(anchor, container.value?.clientWidth);
    } catch (e) {
        logger.warn('Banner', e);
        return;
    }

    x.value = anchor.x;
    y.value = anchor.y;

    updateShape();
}

// disable transition when window is resizing
function resizeShape() {
    noTransition.value = true;
    clearNoTransition();
    updateShape();
}

function updateShape() {
    angle.value = -getBannerAngle({ x: x.value, y: y.value }) + 'rad';
}
</script>

<style scoped>
.banner {
    position: absolute;
    z-index: -1;
    right: 0;
    bottom: 0;
    width: 200vw;
    height: 100vw;
    background: var(--color-primary);
    transform-origin: bottom right;
    transform: rotate(v-bind(angle));
    transition: transform 0.3s ease-out;

    &.collapsing {
        transition: transform 0.3s ease-out;
    }

    &.no-transition {
        transition: none;
    }
}
</style>
