import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export const routes = [{
    path: '/',
    name: 'home',
    component: Home,
}, {
    path: '/posts',
    name: 'posts',
    component: () => import(/* webpackChunkName: "posts" */ './views/Posts.vue'),
}, {
    path: '/posts/create',
    name: 'create post',
    component: () => import(/* webpackChunkName: "posts" */ './views/Create.vue'),
}, {
    path: '/articles/:id',
    name: 'articles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "article" */ './views/Article.vue'),
    props: true,
}, {
    path: '*',
    redirect: '/',
}];

export default new Router({
    routes,
});
