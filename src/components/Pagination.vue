<template>
    <div class="pagination">
        <router-link :to="pageLink(current - 1)" class="prev button" :disabled="current === 1">
            <chevron-left />
        </router-link>
        <div class="pages">
            <router-link
                v-for="page in pages"
                :key="page"
                :to="pageLink(page)"
                :class="['page button', { active: page === current }]"
                >{{ page }}
            </router-link>
        </div>
        <router-link :to="pageLink(current + 1)" class="next button" :disabled="current === pages">
            <chevron-right />
        </router-link>
    </div>
</template>

<script setup lang="ts">
import ChevronLeft from '@mdi/svg/svg/chevron-left.svg';
import ChevronRight from '@mdi/svg/svg/chevron-right.svg';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
    pages: {
        type: Number,
        required: true,
    },
    current: {
        type: Number,
        default: 1,
    },
});

function pageLink(page: number) {
    if (page < 1 || page > props.pages) {
        return {};
    }

    return {
        query: {
            ...route.query,
            page,
        },
    };
}
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
}

.button {
    padding: 8px 16px;
}

.prev,
.next {
    &[disabled='true'] {
        color: var(--color-text-secondary);
        pointer-events: none;
    }
}

.pages {
    background: linear-gradient(90deg, var(--color-primary), rgba(var(--color-primary-rgb), 0.4));
    background-clip: text;
    font-family: Arial, serif;
}

.page {
    color: transparent;

    &.active {
        background: rgba(var(--color-primary-rgb), 0.8);
        color: var(--color-text-dark);
    }
}
</style>
