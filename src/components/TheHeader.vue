<template>
    <header class="header">
        <div class="container">
            <Banner class="banner" />

            <div class="content">
                <Logo />
                <nav ref="tabsElm" :class="['tabs', { leftwards: indicatorMovingLeft }]">
                    <router-link
                        v-for="tab in tabs"
                        :key="tab.title"
                        :class="['tab', { 'loosely-active': tab.looselyActive }]"
                        :to="tab"
                        active-class="active"
                        >{{ tab.title }}
                    </router-link>
                </nav>

                <mdi-github class="action first toolbar-button" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import MdiGithub from '@mdi/svg/svg/github.svg';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { HEADER_HEIGHT } from '../globals';
import { ROUTE_ARTICLE, ROUTE_POSTS, ROUTE_WORKS } from '../router';
import Banner from './Banner.vue';
import Logo from './Logo.vue';

const tabs = reactive([
    { path: '/', title: '首页', looselyActive: false },
    { name: ROUTE_WORKS, title: '作品', looselyActive: false },
    { name: ROUTE_POSTS, title: '文章', looselyActive: false },
]);

const heightPX = HEADER_HEIGHT + 'px';
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
    color: var(--color-text-dark);
}

.content {
    position: relative;
    z-index: 1;
    height: v-bind(heightPX);
    display: flex;
    align-items: center;
}

.tabs {
    position: relative;
    margin-left: 48px;
    color: #ddd;
    line-height: v-bind(heightPX);

    &:before {
        content: '';
        position: absolute;
        top: 16px;
        left: -16px;
        bottom: 16px;
        width: 1px;
        background: #fff3;
        transform: rotate(20deg);
    }

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

.toolbar-button {
    border-radius: 50%;

    &.first {
        margin-left: auto;
    }
}
</style>
