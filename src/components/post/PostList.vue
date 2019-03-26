<template>
    <div class="list">
        <VProgressLinear class="progress ma-0" :active="loading" indeterminate></VProgressLinear>
        <ListTransition offset-y="20px">
            <PostListItem class="item" v-for="post in posts" :key="post.key" :post="post" :details="details" />
        </ListTransition>
    </div>
</template>

<style scoped lang="stylus">
.list
    position relative

.progress
    position absolute
    top 0
    right 0
    left 0

.slide-fade-enter-active, .slide-fade-leave-active
    transition transform .1s ease-out

.slide-fade-enter, .slide-fade-leave-to
    transform translateY(-100%)
</style>

<script>
import PostListItem from './PostListItem';
import ListTransition from '../anim/ListTransition';
import PingPong from '../fx/PingPong';

import Debug from 'debug';

const debug = Debug('plab:PostList');

/**
 * @event prepare
 * @event finish (totalPosts)
 */
export default {
    name: 'PostList',
    components: { ListTransition, PingPong, PostListItem },
    props: {
        filter: {
            default: '',
            type: String,
        },
        number: {
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
        page: Number,
    },
    data: () => ({
        loading: false,
        posts: [],
    }),
    watch: {
        page() {
            this.loadPosts();
        },
        filter() {
            this.loadPosts();
        },
        order() {
            this.loadPosts();
        },
    },
    mounted() {
        this.loadPosts();
    },
    methods: {
        async loadPosts() {
            this.$emit('prepare');
            this.loading = true;

            let result;

            try {
                const url = '/api/posts/?' + new URLSearchParams({
                    limit: this.number,
                    order: this.order,
                    ...(this.page && { page: this.page }),
                });
                debug('load >>> %o', url);

                const res = await fetch(url);
                const json = await res.json();

                if (res.ok)
                    result = json;
                else
                    console.warn(`Error [${json.error.code}]: ${json.error.message}`);
            } catch (e) {
                console.warn('Failed to fetch: ' + e);
            }

            if (result)
                this.displayPosts(result.posts);

            this.loading = false;
            this.$emit('finish', {
                totalPosts: result.total,
            });
        },
        displayPosts(posts) {
            // set unique keys to prevent item reusing, because reused items won't show transition
            posts.forEach(p => p.key = Symbol());
            this.posts = posts;
        },
    },
};
</script>
