<template>
    <VContainer grid-list-lg :class="['fill-height',{'px-0':mobile}]">
        <VLayout row align-space-around fill-height :class="mobile?'mx-0':'my-0'">
            <VFlex xs12 md9 id="post-area">
                <PostList
                        class="grow mb-2"
                        :number="postsPerPage"
                        :page="page"
                        :order="order"
                        :details="['date']"
                        @prepare="postsPrepare($event)"
                        @finish="postsLoaded($event)" />
                <PPagination :value="page" :length="pages"></PPagination>
            </VFlex>

            <PNavigationDrawer floating right
                    width=""
                    :mobile="mobile"
                    v-model="drawer"
                    :class="['drawer','py-2',{'drawer-desktop':!mobile}]">
                <h3 class="px-3">
                    <VIcon>sort</VIcon>
                    排序
                </h3>
                <div class="px-1">
                    <VBtn flat
                            color="primary"
                            active-class=""
                            exact-active-class=""
                            v-for="(order,i) in availableOrders"
                            :key="i"
                            :to="order.linkTo"
                            :class="['order-item', {'order-item-reverse':order.ascend}]">
                        {{order.name}}
                        <VIcon v-show="order.active">keyboard_arrow_down</VIcon>
                    </VBtn>
                </div>
            </PNavigationDrawer>
        </VLayout>
        <VBtn fab dark fixed right bottom
                color="accent"
                :loading="loading"
                @click="drawer=!drawer"
                v-if="mobile">
            <VIcon>menu</VIcon>
        </VBtn>
    </VContainer>
</template>

<style scoped lang="stylus">
.drawer
    position fixed
    min-width 30%

.drawer-desktop
    position relative
    flex-grow 1
    min-width 0
    background-color transparent

.order-item .v-icon
    transition transform .2s ease-out !important

.order-item-reverse .v-icon
    transform rotate(-180deg)

#post-area
    display flex
    flex-direction column
</style>

<script>
import PostList from '../components/post/PostList';
import PNavigationDrawer from '../components/PNavigationDrawer';
import PPagination from '../components/PPagination';

import Debug from 'debug';

const debug = Debug('plab:Post');

export default {
    name: 'Posts',
    components: { PPagination, PNavigationDrawer, PostList },
    data: () => ({
        drawer: null,
        availableOrders: [{
            tag: 'created',
            name: '日期',
            linkTo: {},
            active: true,
            ascend: false,
            // }, {
            //     tag: 'title',
            //     name: '标题',
            //     linkTo: {},
            //     active: true,
            //     ascend: true,
        }],
        order: '-created',
        page: 1,
        pages: 1,
        postsPerPage: 10,
        loading: false,
    }),
    computed: {
        mobile() {
            return this.$vuetify.breakpoint.smAndDown;
        },
        orders() {
            return [];
        },
    },
    watch: {
        $route(to) {
            this.updateParams();
        },
    },
    created() {
        this.updateParams();
    },
    methods: {
        updateParams() {
            this.page = normalizePageNumber(this.$route.query.page, this.page);
            this.order = this.$route.query.o || this.order;

            const orderParam = this.$route.query.o;
            this.availableOrders.forEach(order => {
                if (orderParam) {
                    let ascend = orderParam.charAt(0) !== '-';
                    if (orderParam.slice(ascend ? 0 : 1) === order.tag) {
                        order.active = true;
                        order.ascend = ascend;
                    } else {
                        order.active = false;
                        order.ascend = true;
                    }
                }
                order.linkTo = {
                    path: this.$route.path,
                    query: {
                        ...this.$route.query,
                        o: (order.ascend ? '-' : '') + order.tag, // reverse
                    },
                };
            });
        },
        postsPrepare(event) {
            this.loading = true;
        },
        postsLoaded(event) {
            this.loading = false;
            if (!isNaN(event.totalPosts)) {
                this.pages = normalizePageNumber(Math.ceil(event.totalPosts / this.postsPerPage), this.pages);
            }
        },
    },
};

function normalizePageNumber(page, defaultVal) {
    return page && !isNaN(page) ? Math.max(1, ~~page) : defaultVal;
}
</script>
