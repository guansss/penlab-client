<template>
    <div class="main container">
        <nav :class="['crumb col-12', { dark: crumbDark }]">
            <router-link class="crumb-item" to="/posts">文章</router-link>
            &gt;
            <router-link v-if="!error" class="crumb-item" :to="'/articles/' + id">{{ title }}</router-link>
        </nav>
        <div v-if="error" class="error-msg col-12">
            <p class="emoticon">:(</p>
            <p>加载失败</p>
            <p>错误：{{ ERRORS[error] }}</p>
        </div>
        <template v-else>
            <ArticleHeader :title="title" :date="date" @anim-start="crumbDark = true" />
            <div class="article-area col-12 col-lg-9">
                <article class="article">
                    <div v-img-zoom class="markdown-body" ref="articleBody" v-html="articleHTML"></div>
                </article>
                <div v-if="post && (post.prev || post.next)" class="bottom-nav">
                    <navigation-arrow
                        v-if="post.prev"
                        class="prev"
                        :to="'/articles/' + post.prev.id"
                        desc="上一篇"
                        :title="post.prev.title"
                    />
                    <navigation-arrow
                        right
                        v-if="post.next"
                        class="next"
                        :to="'/articles/' + post.next.id"
                        desc="下一篇"
                        :title="post.next.title"
                    />
                </div>
            </div>
            <aside class="sidebar col-3 d-none d-lg-block">
                <ArticleToc class="toc" ref="toc" @vnode-mounted="tocCreated" />
            </aside>
        </template>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router';
import ArticleHeader from '../components/ArticleHeader.vue';
import NavigationArrow from '../components/NavigationArrow.vue';
import ArticleToc from '../components/utils/ArticleToc.vue';
import { ERRORS } from '../data/errors';
import { PostModel } from '../data/post';
import { emitter } from '../event';
import { getPost } from '../net/apis';
import { setPageTitle } from '../tools/dom';
import { parseMarkdown } from '../tools/markdown';
import { logger } from '../utils/logger';

const LOG_TAG = 'Article';

const loading = ref(false);
const error = ref<'' | keyof typeof ERRORS>('');

const id = ref(-1);
const post = ref<PostModel | undefined>();
const title = ref('');
const date = ref('');
const articleHTML = ref('');
const articleBody = ref<HTMLElement | undefined>();
const toc = ref<typeof ArticleToc>();

const crumbDark = ref(false);

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

async function processArticle(postModel: PostModel) {
    post.value = postModel;
    title.value = postModel.title;
    date.value = new Date(postModel.created).toLocaleString();

    setPageTitle(title.value);

    articleHTML.value = parseMarkdown(postModel.article?.content ?? '');

    animate();

    // wait until the article has been rendered
    await nextTick();

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
.main {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}

.crumb {
    height: 60px;
    display: flex;
    align-items: center;
    color: var(--color-text-secondary);
    font-size: 14px;

    &.dark {
        color: #ccc;

        .crumb-item {
            color: #fff;
        }
    }
}

.crumb-item {
    padding: 8px;
    color: var(--color-text);
    transition: color 0.2s ease-out;

    &:hover {
        color: var(--color-accent) !important;
    }

    &:first-child {
        padding-left: 0;
    }
}

.error-msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .emoticon {
        margin: 24px;
        font-size: 200px;
    }
}

.bottom-nav {
    margin: 48px -16px 48px -12px;
    display: flex;

    .prev {
        padding-left: 2px;
    }

    .next {
        margin-left: auto;
        padding-right: 2px;
    }
}

.sidebar {
    position: sticky;
    top: 16px;
    align-self: flex-start;
}
</style>
