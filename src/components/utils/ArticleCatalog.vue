<template>
    <ul class="catalog-list pl-0">
        <transition-group name="slide-fade">
            <li v-for="(heading,i) in headings" :key="i">
                <a v-ripple @click="$vuetify.goTo(heading.id)">{{heading.text}}</a>

                <ul class="catalog-list level1 pl-0" v-if="heading.children">
                    <li v-for="(heading,i) in heading.children" :key="i">
                        <a v-ripple @click="$vuetify.goTo(heading.id)">{{heading.text}}</a>
                    </li>
                </ul>
            </li>
        </transition-group>
    </ul>
</template>

<style scoped lang="stylus">
@require '../../styles/variables.styl'

.catalog-list
    list-style-type: none

    a
        display block
        padding 2px 8px
        color: $color.primary
        font-weight bold
        transition background-color .1s ease-in

        &:hover
            color: $color.primary
            background-color rgba(0, 0, 0, .05)

.level1
    a
        padding-left 32px
        font-weight normal

.slide-fade-enter-active, .slide-fade-leave-active
    transition opacity .1s ease-out, transform .1s ease-out

.slide-fade-enter, .slide-fade-leave-to
    transform translateX(30px)
    opacity 0
</style>

<script>
// Utilities
import {mapState} from 'vuex';
import {getObjectValueByPath} from 'vuetify/es5/util/helpers';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import Debug from 'debug';

const debug = Debug('plab:article:navigator');

export default {
    name: 'ArticleCatalog',
    props: {},

    data: () => ({
        activeIndex: 0,
        currentOffset: 0,
        isBooted: false,
        list: [],
        headings: [],
        timeout: null
    }),

    computed: {
//        items() {
//            const [section, name] = this.name.split('/');
//            const kebab = upperFirst(camelCase(section));
//
//            return getObjectValueByPath(
//                this.tablesOfContents,
//                `${kebab}.${name}`,
//                []
//            ).map(item => ({
//                ...item,
//                offsetTop: 0,
//                target: null
//            }));
//        }
    },

    watch: {
        items: 'genList',
        isBooted(val) {
            val && this.genList();
        }
    },

    created() {
        this.$store.subscribe(((mutation, state) => {
            if (mutation.type === 'article/updateHeadings')
                this.reload(state.article.headings);
        }));
    },

    mounted() {
        this.reload(this.$store.state.article.headings);
    },

    methods: {
        reload(body) {
            this.headings = structureHeadings(body);
        },
        genItem(item, index) {
            item = item || {};

            const isActive = this.activeIndex === index;
            const vm = this;
            const id = `#${item.href}`;
            const link = this.$createElement('a', {
                staticClass: 'body-2 mb-3 d-block',
                'class': {
                    'primary--text': isActive,
                    'grey--text text--darken-1': !isActive
                },
                attrs: {href: id},
                domProps: {innerText: this.$t(item.text)},
                style: {
                    borderColor: isActive ? 'inherit' : null
                },
                on: {
                    click(e) {
                        e.stopPropagation();
                        e.preventDefault();

                        goTo.call(vm, index && id);
                    }
                },
                key: `${item.text}-${index}`
            });

            return this.$createElement('li', [link]);
        },
        async genList() {
            const list = [];

            if (!this.isBooted) return list;

            // Give page time to transition
            await new Promise(resolve => setTimeout(resolve, 300));

            for (const item of this.items) {
                const target = this.findTarget(item);

                if (!target) continue;

                list.push({
                    ...item,
                    target,
                    offsetTop: 0
                });
            }

            this.list = list;
        },
        getItemOffset(item) {
            if (item.offsetTop) return;

            if (!item.target) {
                item.target = this.findTarget(item);
            }

            if (!item.target) {
                return console.log(`Unable to find item ${item.href}`);
            }

            item.offsetTop = item.target.offsetTop;
        },
        findActiveIndex() {
            if (this.currentOffset < 100) {
                this.activeIndex = 0;
                return;
            }

            const list = this.list.slice().reverse();
            const index = list.findIndex(item => {
                this.getItemOffset(item);

                return item.offsetTop - 100 < this.currentOffset;
            });

            const lastIndex = list.length;

            this.activeIndex = index > -1
                ? lastIndex - 1 - index
                : lastIndex;
        },
        findTarget(item) {
            return item.target ||
                document.getElementById(item.href);
        },
        onScroll() {
            this.currentOffset = window.pageYOffset ||
                document.documentElement.offsetTop;

            clearTimeout(this.timeout);

            this.timeout = setTimeout(this.findActiveIndex, 10);
        }
    },

    render(h) {
        const data = {
            staticClass: 'app-table-of-contents',
            style: this.styles,
            directives: [{
                name: 'scroll',
                value: this.onScroll
            }],
            attrs: this.$attrs,
            listeners: this.$listeners
        };

        let children = [];

        if (this.list.length) {
            children = children.concat(this.list.map(this.genItem));
        }

        if (this.$slots.default) {
            children.push(this.$slots.default);
        }

        if (this.$slots.top) {
            children.unshift(this.$slots.top);
        }

        return h('ul', data, children);
    }
};

/**
 * Convert headings (only h2, h3) from flat list to a tree.
 * @param flatHeadings
 * @return {Array} headings
 */
function structureHeadings(flatHeadings) {
    const headings = [];
    let lastH2;

    flatHeadings.forEach(h => {
        const heading = {
            id: '#' + h.id,
            level: h.level,
            text: h.text
        };

        if (h.level === 2) {
            heading.children = heading.children || [];
            headings.push(heading);
            lastH2 = heading;
        } else if (h.level === 3) {
            if (!lastH2)
                headings.push(heading);
            else
                lastH2.children.push(heading);
        }
    });

    return headings;
}
</script>
