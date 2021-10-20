import { createRouter, createWebHashHistory } from 'vue-router';
import { setPageTitle } from './tools/dom';

export const ROUTE_HOME = 'home';
export const ROUTE_WORKS = 'works';
export const ROUTE_POSTS = 'posts';
export const ROUTE_POSTS_CREATE = 'posts_create';
export const ROUTE_ARTICLE = 'article';

const routes = [
    {
        path: '/',
        name: ROUTE_HOME,
        component: () => import('./views/Home.vue'),
        meta: {
            title: '',
        },
    },
    {
        path: '/works',
        name: ROUTE_WORKS,
        component: () => import('./views/Works.vue'),
        meta: {
            title: '作品',
        },
    },
    {
        path: '/posts',
        name: ROUTE_POSTS,
        component: () => import('./views/Posts.vue'),
        meta: {
            title: '文章',
        },
    },
    {
        path: '/posts/create',
        name: ROUTE_POSTS_CREATE,
        component: () => import('./views/Create.vue'),
        meta: {
            title: '新文章',
        },
    },
    {
        path: '/articles/:id',
        name: ROUTE_ARTICLE,
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

router.beforeEach((to, from) => {
    if (typeof to.meta.title === 'string') {
        setPageTitle(to.meta.title);
    }
});
