<template>
    <div class="posts container">
        <div class="list-panel col-12 col-lg-9">
            <PostList class="post-list" :amount="postsPerPage" :page="page" :order="order" @load="pagesLoaded" />
            <Pagination :pages="pages" :current="page" />
        </div>
        <div class="control-panel col-12 col-lg-3 order-first order-lg-last">
            <div class="order-pane">
                <sort-icon class="sort icon" />
                <div class="order-items">
                    <router-link
                        v-for="(order, i) in orderOptions"
                        :key="i"
                        :to="order.link"
                        :class="['order-item button', { reverse: order.ascend }]"
                    >
                        {{ order.name }}
                        <arrow-top-right class="icon" v-show="order.active" />
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ArrowTopRight from '@mdi/svg/svg/arrow-top-right.svg';
import SortIcon from '@mdi/svg/svg/sort.svg';
import { reactive, ref } from 'vue';
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router';
import Pagination from '../components/Pagination.vue';
import PostList from '../components/post/PostList.vue';
import { postOrders } from '../models/post';
import { qualifyQueryInteger, qualifyQueryString } from '../tools/query';

const orderOptions = reactive([
    {
        tag: 'created',
        name: '日期',
        link: {},
        active: true,
        ascend: false,
    },
]);

const order = ref('-created');
const page = ref(1);
const pages = ref(0);
const postsPerPage = ref(10);

const route = useRoute();

onBeforeRouteUpdate(updateParams);

updateParams(route);

function updateParams(route: RouteLocationNormalized) {
    page.value = qualifyQueryInteger(route.query.page, 1, pages.value || Infinity);
    order.value = qualifyQueryString<string>(route.query.o, postOrders, order.value);

    for (const orderOption of orderOptions) {
        const ascend = order.value.charAt(0) !== '-';

        orderOption.ascend = ascend;
        orderOption.active = orderOption.tag === order.value.slice(ascend ? 0 : 1);
        orderOption.link = {
            path: route.path,
            query: {
                ...route.query,

                // the link is to reverse the order
                o: (ascend ? '-' : '') + orderOption.tag,
            },
        };
    }
}

function pagesLoaded(event: { totalPosts: number }) {
    if (!isNaN(event.totalPosts)) {
        pages.value = Math.max(Math.ceil(event.totalPosts / postsPerPage.value), 1);
    }
}
</script>

<style scoped>
.posts {
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
}

.list-panel {
    flex-grow: 1;
}

.post-list {
    margin-bottom: 24px;
}

.control-panel {
    padding: 16px 16px 0 16px;
}

.order-pane {
    display: flex;
    align-items: center;
}

.sort.icon {
    display: inline-block;
    margin-right: 8px;
}

.order-item {
    display: flex;
    align-items: center;

    &.reverse {
        .icon {
            transform: scale(0.8) rotate(-45deg);
        }
    }

    .icon {
        transition: transform 0.3s cubic-bezier(0.04, 0.3, 0.54, 1.57);
        transform: scale(0.8) rotate(135deg);
    }
}
</style>
