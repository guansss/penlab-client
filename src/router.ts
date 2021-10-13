import { createRouter, createWebHashHistory } from 'vue-router';
import { setPageTitle } from './tools/dom';

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./views/Home.vue'),
        meta: {
            title: '',
        },
    },
    {
        path: '/posts',
        name: 'posts',
        component: () => import('./views/Posts.vue'),
        meta: {
            title: '文章',
        },
    },
    {
        path: '/posts/create',
        name: 'create post',
        component: () => import('./views/Create.vue'),
        meta: {
            title: '新文章',
        },
    },
    {
        path: '/articles/:id',
        name: 'articles',
        component: () => import('./views/Article.vue'),
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

    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        }
    },
});

router.beforeEach((to, from, next) => {
    if (typeof to.meta.title === 'string') {
        setPageTitle(to.meta.title);
    }

    next();
});
