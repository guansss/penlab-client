<template>
    <div class="list">
        <ListTransition offset-y="20px">
            <PostListItem class="item" v-for="post in posts" :key="post.key" :post="post" />
        </ListTransition>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { PostModel } from '../../models/post';
import { getPosts } from '../../net/apis';
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
const posts = reactive<ListPost[]>([]);

watch(() => [props.page, props.filter, props.order], updatePosts);

updatePosts();

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
</script>

<style scoped></style>
