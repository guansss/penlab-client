<template>
    <v-container grid-list-lg fill-height>
        <v-layout row fill-height>
            <v-flex xs12 md9 fill-height>
                <v-breadcrumbs :items="breadcrumbItems" class="pa-0 mb-3"></v-breadcrumbs>
                <article id="article" class="fill-height">
                    <v-progress-circular indeterminate color="accent" class="progress"
                            v-if="loading"></v-progress-circular>
                    <div id="error" class="text-center" v-if="notFound">
                        <p id="emotion">:(</p>
                        <p>找不到指定的文章</p>
                    </div>
                    <header class="mb-4">
                        <h1 class="mb-2 display-2">{{title}}</h1>
                        <small class="grey--text">{{date}}</small>
                    </header>
                    <div id="content" class="markdown-body" v-html="mdHtml"></div>
                </article>
            </v-flex>
            <v-flex :class="{'aside-mobile':mobile}">
                <v-layout column fill-height>
                    <v-flex shrink id="sidebar">
                        <article-catalog></article-catalog>
                    </v-flex>
                    <v-flex shrink id="fab-panel">
                        <fab-group id="fab-group" :loading="loading"></fab-group>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style scoped lang="stylus">
@require '../styles/markdown-custom.styl'

#article
    position relative

.progress
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    margin auto

#error
    position absolute
    width 100%

    #emotion
        color gray
        font-size 10em

.aside-mobile
    width 0 !important
    padding 0 !important
    margin 0 !important
    overflow hidden !important

    #fab-group
        right 16px !important

#sidebar
    position sticky
    top 0

#fab-panel1
    position sticky
    bottom 0
    height 0

#fab-group
    position fixed
    bottom 0
</style>

<script>
import Debug from 'debug';
import $ from 'jquery';
import marked from 'marked';
import hljs from 'highlight.js';
import PingPong from '../components/fx/PingPong';
import FabGroup from '../components/fab/FabGroup';
import ArticleCatalog from '../components/utils/ArticleCatalog';

const debug = Debug('plab:article');

window.$ = $;

export default {
    name: 'Article',
    components: {ArticleCatalog, FabGroup, PingPong},
    props: {
        id: {
            type: String,
            default: '-1'
        }
    },
    data: () => ({
        loading: false,
        notFound: false,
        title: '',
        date: '',
        mdHtml: '',
        headings: []
    }),
    computed: {
        mobile() {
            return this.$vuetify.breakpoint.smAndDown;
        },
        breadcrumbItems() {
            return [{
                text: '文章',
                href: '#/posts'
            }, {
                text: this.title,
                disabled: true
            }];
        }
    },
    async mounted() {
        await this.loadContent();
    },
    methods: {
        startLoading() {
            this.loading = true;
            this.headings = [];
            this.$store.commit('article/updateHeadings', this.headings);
        },
        stopLoading() {
            this.loading = false;
            this.$store.commit('article/updateHeadings', this.headings);
        },
        async loadContent() {
            this.startLoading();

            let result;

            try {
                const res = await fetch('/api/posts/' + this.id);
                if (res.status === 404)
                    this.notFound = true;
                else {
                    const json = await res.json();
                    if (res.ok) {
                        result = json;
                    } else {
                        console.warn(`Error [${json.error.code}]: ${json.error.message}`);
                    }
                }
            } catch (e) {
                console.warn('Failed to fetch: ' + e);
            }

            if (result)
                this.displayPost(result);

            this.stopLoading();
        },
        displayPost(post) {
            this.title = post.title;
            this.date = new Date(post.created).toLocaleString('zh-cn');
            document.title = this.title;

            const headings = [];

            this.mdHtml = marked.setOptions({
                renderer: getRenderer({
                    beforeHeading: (text, level, raw) => headings.push({text: raw, level}),
                    afterHeading: id => headings[headings.length - 1].id = id
                })
            })(post.article.content);

            this.headings = headings;

            this.animate();
        },
        animate() {
            $(this.$el).find('#content')[0].animate({
                opacity: [0, 1]
            }, {
                duration: 150
            });
        }
    }
};

marked.setOptions({
    highlight(code, lang) {
        let result;
        try {
            result = lang
                ? hljs.highlight(lang, code, false).value
                : hljs.highlightAuto(code).value;
        } catch (e) {
            result = code;
        }
        return result;
    }
});

/**
 * Lets every link open in new tab.
 * @param renderer marked renderer
 * @see https://github.com/markedjs/marked/issues/655#issuecomment-383226346
 * @return link renderer
 */
function linkRenderer(renderer) {
    const baseRenderer = renderer.link;

    return (href, title, text) => {
        const html = baseRenderer.call(renderer, href, title, text);
        return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer"');
    };
}

/**
 * Custom heading renderer with hooks.
 * @see https://github.com/markedjs/marked/blob/master/lib/marked.js#L949
 * @see https://github.com/markedjs/marked/issues/1329#issuecomment-418299042
 * @param renderer marked renderer
 * @param before callback before rendering
 * @param after callback before rendering
 * @return heading renderer
 */
function headingRenderer(renderer, before, after) {
    return (text, level, raw) => {
        before && before(text, level, raw);

        const id = raw.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
        after && after(id);

        return `<h${level} id="${id}">${text}</h${level}>`;
    };
}

function getRenderer({beforeHeading, afterHeading}) {
    const renderer = new marked.Renderer();
    renderer.link = linkRenderer(renderer);
    renderer.heading = headingRenderer(renderer, beforeHeading, afterHeading);
    return renderer;
}
</script>
