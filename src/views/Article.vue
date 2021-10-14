<template>
    <div class="article container">
        <nav class="nav col-12">
            <router-link class="nav-item" to="/posts">文章</router-link>
            /
            <router-link class="nav-item" :to="'/articles/' + id">{{ title }}</router-link>
        </nav>
        <article class="article-body col-12 col-lg-9">
            <div v-if="error" class="error-msg">
                <p id="emotion">:(</p>
                <p>加载失败</p>
                <p>错误：{{ ERRORS[error] }}</p>
            </div>
            <header class="article-header">
                <h1 ref="titleElm" :class="['title', { invisible: !titleVisible }]">{{ title }}</h1>
                <small class="date">{{ date }}</small>
            </header>
            <div class="markdown-body" ref="articleBody" v-html="articleHTML"></div>
        </article>
        <aside class="sidebar col-3 d-none d-lg-block">
            <ArticleToc class="toc" ref="toc" @vnode-mounted="tocCreated" />
        </aside>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router';
import ArticleToc from '../components/utils/ArticleToc.vue';
import { emitter } from '../event';
import { ERRORS } from '../models/errors';
import { PostModel } from '../models/post';
import { getPost } from '../net/apis';
import { setPageTitle } from '../tools/dom';
import { parseMarkdown } from '../tools/markdown';
import { logger } from '../utils/logger';

const LOG_TAG = 'Article';

const loading = ref(false);
const error = ref<'' | keyof typeof ERRORS>('');

const id = ref(-1);
const title = ref('');
const date = ref('');
const articleHTML = ref('');
const articleBody = ref<HTMLElement | undefined>();
const titleElm = ref<HTMLHeadingElement | undefined>();
const titleVisible = ref(false);
const toc = ref<typeof ArticleToc>();

onBeforeRouteUpdate(updateID);
onBeforeRouteLeave(() => emitter.emit('articleClosed'));

updateID(useRoute());

function updateID(dest: RouteLocationNormalized) {
    const newID = parseInt(dest.params.id as string);

    if (newID === id.value) {
        return;
    }

    if (isNaN(newID) || newID < 0) {
        error.value = 'invalidParams';
        logger.warn(LOG_TAG, 'Invalid ID:', dest.params.id);
        return;
    }

    id.value = newID;

    loadArticle().catch(logger.warn);
}

async function loadArticle() {
    startLoading();

    try {
        const postModel = await getPost(id.value);

        // in case the component has been destroyed
        if (!articleBody.value) {
            return;
        }

        // in case the page has switched to another article
        if (postModel.id !== id.value) {
            return;
        }

        stopLoading();

        await processArticle(postModel);
    } catch (e: any) {
        if (e) {
            if (e.status === 404) {
                error.value = 'articleNotFound';
            } else if (e.status) {
                error.value = 'unknown';
            }
        }

        logger.warn(LOG_TAG, 'Failed to load article.', e);
    }
}

async function processArticle(post: PostModel) {
    title.value = post.title;
    date.value = new Date(post.created).toLocaleString();

    setPageTitle(title.value);

    articleHTML.value = parseMarkdown(post.article?.content ?? '');

    animate();

    // wait until the content has been rendered
    await nextTick();

    const rect = titleElm.value!.getBoundingClientRect();

    emitter.emit('articleTitlePrinted', {
        x: rect.x,
        y: rect.y,
        width: rect.width,

        onfinish() {
            titleVisible.value = true;
        },
    });

    (toc.value as any).updateHeadings(articleBody.value!);
}

function startLoading() {
    loading.value = true;
    error.value = '';
}

function stopLoading() {
    loading.value = false;
}

function animate() {
    articleBody.value!.animate(
        {
            opacity: [0, 1],
        },
        {
            duration: 150,
        }
    );
}

function tocCreated() {
    // automatically update headings after a hot-reload, so I don't have to refresh the page all the time
    if (import.meta.env.DEV) {
        (toc.value as any)?.updateHeadings(articleBody.value!);
    }
}
</script>

<style scoped>
.article {
    position: relative;
    display: flex;
    flex-wrap: wrap;
}

.nav {
    padding: 16px 0;
    color: var(--color-text-secondary);
    font-size: 14px;
}

.nav-item {
    padding: 8px;

    &:first-child {
        padding-left: 0;
    }
}

.article-header {
    margin-bottom: 24px;

    .title {
        font-size: 48px;
    }

    .date {
        color: var(--color-text-secondary);
    }
}

.sidebar {
    position: sticky;
    top: 16px;

    align-self: flex-start;
}
</style>
