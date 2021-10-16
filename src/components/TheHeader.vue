<template>
    <header class="header">
        <div class="container">
            <Banner class="banner" />

            <div class="content">
                <Logo />
                <div class="tabs">
                    <span v-for="tab in tabs" :key="tab.title" class="tab">
                        <router-link :to="tab.path">{{ tab.title }}</router-link>
                    </span>
                </div>

                <mdi-github class="action first toolbar-button" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import MdiGithub from '@mdi/svg/svg/github.svg';
import { HEADER_HEIGHT } from '../globals';
import Banner from './Banner.vue';
import Logo from './Logo.vue';

const tabs = [
    {
        path: '/',
        title: '首页',
    },
    {
        path: '/posts',
        title: '文章',
    },
];

const heightPX = HEADER_HEIGHT + 'px';
</script>

<style scoped>
.header {
    position: relative;
    background: var(--color-primary);
    color: var(--color-text-dark);

    * {
        color: var(--color-text-dark);
    }
}

.content {
    position: relative;
    z-index: 1;
    height: v-bind(heightPX);
    display: flex;
    align-items: center;
}

.tabs {
    margin: 0;
}

.tab {
    padding: 16px;
}

.toolbar-button {
    border-radius: 50%;

    &.first {
        margin-left: auto;
    }
}
</style>
