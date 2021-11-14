import { createRouter, createWebHistory } from 'vue-router';
import { setPageTitle } from './tools/dom';

export const ROUTE_HOME = 'home';
export const ROUTE_WORKS = 'works';
export const ROUTE_POSTS = 'posts';
export const ROUTE_ARTICLE = 'article';
export const ROUTE_ABOUT = 'about';

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
        path: '/articles/:id',
        name: ROUTE_ARTICLE,
        component: () => import('./views/Article.vue'),
        meta: {
            title: '文章',
        },
        props: true,
    },
    {
        path: '/about',
        name: ROUTE_ABOUT,
        component: () => import('./views/About.vue'),
        meta: {
            title: '关于',
        },
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/',
    },
];

export const router = createRouter({
    routes,
    history: createWebHistory(),

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
