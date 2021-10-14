<template>
    <router-link class="item selectable gradient" :to="'/articles/' + post.id">
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
    }

    .title {
        margin-bottom: 12px;
        font-size: 24px;
    }

    .summary {
        color: var(--color-text);
    }

    .date {
        margin-left: 16px;
        color: var(--color-text-secondary);
        font-family: Arial, serif;
        font-size: 14px;
        line-height: 20px;
    }
}

.date {
    float: right;
}
</style>
