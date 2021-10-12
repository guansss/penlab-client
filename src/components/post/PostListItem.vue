<template>
    <router-link class="item selectable" :to="'/articles/' + post.id">
        <h2 class="title">{{ post.title }}</h2>
        <span class="date">{{ date }}</span>
        <p class="summary">{{ post.summary }}</p>
    </router-link>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { PostModel } from '../../models/post';
import { formatDate } from '../../utils/string';

const props = defineProps({
    post: {
        type: Object as PropType<PostModel>,
        required: true,
    },
});

const date = computed(() => (isNaN(props.post.created) ? '' : formatDate(+props.post.created, 'date')));
</script>

<style scoped>
.item {
    position: relative;
    padding: 32px 16px;
    display: block;
    font-size: 16px;
    background: linear-gradient(
        90deg,
        rgba(var(--color-primary-rgb), 0.1) 0,
        rgba(var(--color-primary-rgb), 0.05) 45%,
        #0000 55%,
        #0000 100%
    );
    background-size: 220% 100%;
    background-position-x: right;
    transition: background-position 0.2s ease-out;

    &:not(:last-child):after {
        content: '';
        position: absolute;
        right: 0;
        bottom: 0;
        left: 16px;
        height: 1px;
        background: linear-gradient(90deg, #0001, #0000);
    }

    &:hover {
        color: var(--color-accent);
        background-position-x: left;
    }

    .title {
        margin-bottom: 12px;
        font-weight: normal;
    }

    .summary {
        color: var(--color-text);
    }

    .date {
        color: var(--color-text-secondary);
        font-family: Arial, serif;
        font-size: 14px;
    }
}

.date {
    float: right;
}
</style>
