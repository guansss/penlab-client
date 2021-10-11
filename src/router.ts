import { createRouter, createWebHashHistory } from 'vue-router';
import { setPageTitle } from './tools/dom';
import Home from './views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: '',
        },
    },
    {
        path: '/posts',
        name: 'posts',
        component: () => import(/* webpackChunkName: "posts" */ './views/Posts.vue'),
        meta: {
            title: '文章',
        },
    },
    {
        path: '/posts/create',
        name: 'create post',
        component: () => import(/* webpackChunkName: "posts" */ './views/Create.vue'),
        meta: {
            title: '新文章',
        },
    },
    {
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
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/',
    },
];

export const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
    if (typeof to.meta.title === 'string') {
        setPageTitle(to.meta.title);
    }

    next();
});
