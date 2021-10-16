<template>
    <router-link :class="['nav-arrow button', { right }]" v-bind="$attrs">
        <div class="icon">
            <mdi-arrow-right class="base" viewBox="0 0 24 24" />
            <mdi-arrow-right class="cover" viewBox="0 0 24 24" />
        </div>
        <div class="text">
            <div class="desc">{{ desc }}</div>
            <div class="title">{{ title }}</div>
        </div>
    </router-link>
</template>

<script setup lang="ts">
import MdiArrowRight from '@mdi/svg/svg/arrow-right.svg';

defineProps({
    right: Boolean,
    desc: String,
    title: String,
});
</script>

<style scoped>
.nav-arrow {
    display: inline-flex;

    &.right {
        flex-direction: row-reverse;
        text-align: right;

        .icon {
            transform: none;
        }

        &:hover {
            .icon {
                transform: translateX(6px);
            }
        }
    }

    &:hover {
        .icon {
            transform: rotate(180deg) translateX(6px);
        }

        .cover {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
    }
}

.icon {
    position: relative;
    width: 54px;
    height: 54px;
    line-height: 0;
    transform: rotate(180deg);
    transition: transform 0.3s;
}

.base {
    display: inline-block;
    width: 100%;
    height: 100%;
    color: var(--color-primary);
}

.cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    color: var(--color-accent);
    transition: clip-path 0.8s;
}

.text {
    margin: 2px 6px 0;
    line-height: 24px;
}
</style>
