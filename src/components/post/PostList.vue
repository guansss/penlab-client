<template>
    <div class="list" ref="list">
        <ListTransition offset-y="20px">
            <PostListItem class="item" v-for="post in posts" :key="post.key" :post="post" />
        </ListTransition>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { onBeforeRouteLeave, RouteLocationNormalized } from 'vue-router';
import { emitter } from '../../event';
import { PostModel } from '../../models/post';
import { getPosts } from '../../net/apis';
import { ROUTE_ARTICLE } from '../../router';
import { logger } from '../../utils/logger';
import ListTransition from '../anim/ListTransition.vue';
import PostListItem from './PostListItem.vue';

interface ListPost extends PostModel {
    // assign a unique key to prevent item reusing, because reused items won't be transitioned
    key: Symbol;
}

const props = defineProps({
    filter: {
        default: '',
        type: String,
    },
    amount: {
        default: 10,
        type: Number,
    },
    order: {
        default: '-created',
        type: String,
    },
    details: {
        type: Array,
        default: () => [],
    },
    page: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['beforeLoad', 'load']);

const loading = ref(false);
const list = ref<HTMLElement | undefined>();
const posts = reactive<ListPost[]>([]);

watch(() => [props.page, props.filter, props.order], updatePosts, { immediate: true });

onBeforeRouteLeave(openArticle);

async function updatePosts() {
    emit('beforeLoad');

    loading.value = true;

    try {
        const postList = await getPosts({
            limit: props.amount,
            order: props.order,
            page: props.page,
        });

        displayPosts(postList.posts);

        emit('load', {
            totalPosts: postList.total,
        });
    } catch (e) {
        logger.warn('Failed to update posts: ' + e);
    }

    loading.value = false;
}

function displayPosts(postsModels: PostModel[]) {
    posts.splice(0);

    for (const post of postsModels as ListPost[]) {
        post.key = Symbol();

        posts.push(post);
    }
}

function openArticle(dest: RouteLocationNormalized) {
    if (!list.value || dest.name !== ROUTE_ARTICLE) {
        return;
    }

    const id = dest.params.id;
    const postIndex = posts.findIndex((p) => p.id === Number(id));

    if (postIndex === -1) {
        return;
    }

    const titleElms = list.value?.getElementsByClassName('title') as HTMLCollectionOf<HTMLHeadingElement>;
    const titleElm = titleElms[postIndex];

    // ensure the data and element are exactly matched
    if (titleElm?.innerText !== posts[postIndex]!.title.trim()) {
        return;
    }

    const rect = titleElm.getBoundingClientRect();

    emitter.emit('articleOpenedByTitle', {
        title: posts[postIndex]!.title,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        pressed: true,
    });
}
</script>

<style scoped></style>
