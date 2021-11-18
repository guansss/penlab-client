<template>
    <header class="header">
        <div class="container">
            <Banner class="banner" />

            <div class="content">
                <Logo class="logo" />

                <div class="divider d-none d-md-block"></div>

                <nav
                    ref="tabsElm"
                    :class="['tabs col-12 col-md-auto order-3 order-md-1', { leftwards: indicatorMovingLeft }]"
                >
                    <router-link
                        v-for="tab in tabs"
                        :key="tab.title"
                        :class="['tab', { 'loosely-active': tab.looselyActive }]"
                        :to="tab"
                        active-class="active"
                        >{{ tab.title }}
                    </router-link>
                </nav>

                <div class="toolbar-action order-2">
                    <LightDarkButton class="action toolbar-button" />
                    <a class="action toolbar-button" href="https://github.com/guansss/penlab-client" target="_blank">
                        <mdi-github class="icon" />
                    </a>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import MdiGithub from '@mdi/svg/svg/github.svg';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { ROUTE_ABOUT, ROUTE_ARTICLE, ROUTE_POSTS, ROUTE_WORKS } from '../router';
import { dimensions } from '../tools/dimensions';
import Banner from './Banner.vue';
import LightDarkButton from './LightDarkButton.vue';
import Logo from './Logo.vue';

const tabs = reactive([
    { path: '/', title: '首页', looselyActive: false },
    { name: ROUTE_WORKS, title: '作品', looselyActive: false },
    { name: ROUTE_POSTS, title: '文章', looselyActive: false },
    { name: ROUTE_ABOUT, title: '关于', looselyActive: false },
]);

const heightPX = dimensions.headerHeightBasic + 'px';
const indicatorPadding = 16;
const indicatorPaddingPX = indicatorPadding + 'px';

const indicatorLeft = ref('100%');
const indicatorRight = ref('100%');
const indicatorMovingLeft = ref(false);
const tabsElm = ref<HTMLAnchorElement | undefined>();

useRouter().afterEach(updateRoute);

const tabsObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const target = mutation.target as HTMLElement;

        if (
            target.classList.contains('tab') &&
            (target.classList.contains('active') || target.classList.contains('loosely-active'))
        ) {
            updateIndicator(target);

            break;
        }
    }
});

onMounted(() => {
    updateRoute(useRoute());

    tabsObserver.observe(tabsElm.value!, { subtree: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => {
    tabsObserver.disconnect();
});

function updateRoute(to: RouteLocationNormalized) {
    // activate the tab that loosely matches the route, in case none of the tab matches
    for (const tab of tabs) {
        if (tab.name === ROUTE_POSTS) {
            tab.looselyActive = to.name === ROUTE_ARTICLE;

            break;
        }
    }
}

function updateIndicator(activeTab?: HTMLElement) {
    if (activeTab) {
        const left = activeTab.offsetLeft + indicatorPadding;

        indicatorMovingLeft.value = left < +indicatorLeft.value.replace('px', '');

        indicatorLeft.value = left + 'px';

        indicatorRight.value =
            tabsElm.value!.offsetWidth - (activeTab.offsetLeft + activeTab.offsetWidth - indicatorPadding) + 'px';
    } else {
        // reset the position when there's no active tab
        indicatorLeft.value = '100%';
        indicatorRight.value = '100%';
    }
}
</script>

<style scoped>
.header {
    position: relative;
    background: var(--color-primary);
    color: #fff;
    user-select: none;
}

.content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.logo {
    line-height: v-bind(heightPX);
}

.divider {
    margin-left: 32px;
    margin-right: 12px;
    width: 1px;
    height: calc(v-bind(heightPX) - 32px);
    background: #fff3;
    transform: skew(-20deg);
}

.tabs {
    position: relative;
    color: #ddd;
    line-height: v-bind(heightPX);

    &:after {
        content: '';
        position: absolute;
        top: 12px;
        right: v-bind(indicatorRight);
        left: v-bind(indicatorLeft);
        height: 2px;
        background: #fff;
        transition: left 0.2s, right 0.15s;
    }

    &.leftwards:after {
        transition: left 0.15s, right 0.2s;
    }
}

/* should be consistent with the header height breakpoint in tools/dimensions.ts */
@media (max-width: 768px) {
    .tabs {
        margin: 0 calc(-1 * var(--bs-gutter-x, 0.75rem));
    }
}

.tab {
    position: relative;
    display: inline-block;
    width: 64px;
    color: inherit;
    text-align: center;
    transition: color 0.15s ease-out, text-shadow 0.15s ease-out;

    &.active,
    &.loosely-active {
        color: #fff;
        text-shadow: 0 0 3px #fff8;
    }

    &:hover {
        color: #fff;

        &:after {
            background: #fff6;
        }
    }

    &:after {
        content: '';
        position: absolute;
        top: 12px;
        right: v-bind(indicatorPaddingPX);
        left: v-bind(indicatorPaddingPX);
        height: 2px;
        transition: background-color 0.15s ease-out;
    }
}

.toolbar-action {
    margin-left: auto !important;
    display: flex;
    align-items: center;
}

.toolbar-button {
    position: relative;
    margin-left: 8px;
    padding: 12px;
    display: inline-block;
    color: inherit;
    line-height: 0;
    cursor: pointer;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff4;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.15s;
    }

    &:not(.disabled):hover {
        &:before {
            opacity: 0.7;
        }
    }

    &:active {
        &:before {
            opacity: 1;
        }
    }
}
</style>
