import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import { setPageTitle } from './tools/dom';

Vue.use(Router);

export const routes = [{
    path: '/',
    name: 'home',
    component: Home,
    meta: {
        title: '',
    },
}, {
    path: '/posts',
    name: 'posts',
    component: () => import(/* webpackChunkName: "posts" */ './views/Posts.vue'),
    meta: {
        title: '文章',
    },
}, {
    path: '/posts/create',
    name: 'create post',
    component: () => import(/* webpackChunkName: "posts" */ './views/Create.vue'),
    meta: {
        title: '新文章',
    },
}, {
    path: '/articles/:id',
    name: 'articles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "article" */ './views/Article.vue'),
    meta: {
        title: '文章',
    },
    props: true,
}, {
    path: '*',
    redirect: '/',
}];

const router = new Router({
    routes,
});

router.beforeEach((to, from, next) => {
    setPageTitle(to.meta && to.meta.title);
    next();
});

export default router;
