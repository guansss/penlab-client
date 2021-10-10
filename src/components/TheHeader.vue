<template>
    <header class="header">
        <div class="content container">
            <Logo />
            <div v-if="showTabs" class="tabs">
                <span v-for="tab in tabs" :key="tab.title" class="tab">
                    <router-link :to="tab.path">{{ tab.title }}</router-link>
                </span>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import Logo from './Logo.vue';</script>

<script lang="ts">
export default {
    data: () => ({
        tabs: [{
            path: '/',
            title: '首页',
        }, {
            path: '/posts',
            title: '文章',
        }],
        showTabs: true,
    }),
};
</script>

<style scoped>
.header {
    background: var(--theme-primary);
    color: var(--color-dark);
}

.content {
    padding: 16px 0;
    display: flex;
    align-items: center;
}

.tabs {
    margin: 0;
}

.tab {
    padding: 16px;
}
</style>
