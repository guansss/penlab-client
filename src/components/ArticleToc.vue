<template>
    <nav :class="['toc', denseLevel ? 'dense' + denseLevel : '']">
        <ul class="list level1" ref="navList">
            <transition-group name="slide-fade">
                <li v-for="(heading, i) in headings" :key="i">
                    <router-link
                        replace
                        :class="['heading selectable accent gradient', { active: heading === activeHeading }]"
                        :to="'#' + heading.id"
                        >{{ heading.title }}
                    </router-link>

                    <ul class="list level2" v-if="heading.children">
                        <li v-for="(subHeading, j) in heading.children" :key="j">
                            <router-link
                                replace
                                :class="[
                                    'heading selectable accent gradient',
                                    { active: subHeading === activeHeading },
                                ]"
                                :to="'#' + subHeading.id"
                                >{{ subHeading.title }}
                            </router-link>
                        </li>
                    </ul>
                </li>
            </transition-group>
        </ul>
        <div ref="indicator" :class="['indicator', { upwards: indicatorMovingUp }]" :style="indicatorStyles"></div>
    </nav>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router';
import { logger } from '../utils/logger';

interface Heading {
    id: string;
    title: string;
    children?: Heading[];
}

const headings = reactive<Heading[]>([]);
const activeHeading = ref<Heading | undefined>();

// an flat array of headings to ease the position comparison
const headingsFlat = reactive<Heading[]>([]);

const navList = ref<HTMLUListElement | undefined>();
const indicator = ref<HTMLDivElement | undefined>();
const indicatorStyles = reactive({
    top: '0',
    bottom: '0',
});
const indicatorMovingUp = ref<boolean>(false);

const denseLevel = ref(0);

const route = useRoute();

defineExpose({ updateHeadings });

onMounted(() => window.addEventListener('scroll', updateActiveHeadingByScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', updateActiveHeadingByScroll));

// do not use the shorthand form of this arrow function, because it may return false,
// causing the navigation to be canceled
onBeforeRouteUpdate((to) => {
    updateActiveHeadingByHash(to);
});

watch(() => activeHeading.value, updateIndicator);

const updateActiveHeadingByScroll = debounce(() => {
    const pageTop = window.scrollY - 50;

    for (let i = headingsFlat.length - 1; i >= 0; i--) {
        const heading = headingsFlat[i]!;
        const elm = document.getElementById(heading.id);

        // `i === 0` means that all but the first header are not matched, then there are two cases:
        // a) pageTop is below the first header, then the first header is matched
        // b) pageTop is above the first header, then none of the headers is matched, but there should
        //    always be an active header, so we'll choose the first one
        // as a result, in both cases, the first header should be active
        if ((elm && elm.offsetTop < pageTop) || i === 0) {
            activeHeading.value = heading;
            break;
        }
    }
}, 100);

async function updateHeadings(articleBody: HTMLElement, scroll = true) {
    buildHeadings(articleBody);

    activeHeading.value = headings[0];

    if (scroll) {
        if (updateActiveHeadingByHash(route)) {
            document.getElementById(activeHeading.value!.id)?.scrollIntoView();
        } else {
            window.scroll({
                top: 0,
                behavior: 'smooth',
            });
        }
    }

    const availableHeightForEachHeader = (innerHeight - 40) / headingsFlat.length;

    // enable dense mode when TOC is too high
    denseLevel.value = availableHeightForEachHeader >= 36 ? 0 : availableHeightForEachHeader >= 26 ? 1 : 2;

    // wait for the DOM to render (if mounted)
    await nextTick();

    updateIndicator();
}

/**
 * Builds a heading tree according to the article's body, takes only <h2> and <h3>.
 */
function buildHeadings(articleBody: HTMLElement) {
    headings.splice(0);
    headingsFlat.splice(0);

    const hElements = Array.from(articleBody.querySelectorAll('h2, h3')) as HTMLHeadingElement[];

    const heading2s: Heading[] = [];

    for (const h of hElements) {
        const heading = {
            id: h.id,
            title: h.innerText,
        };

        headingsFlat.push(heading);

        if (h.tagName === 'H2') {
            heading2s.pop();
            heading2s.push(heading);
            headings.push(heading);
        } else if (h.tagName === 'H3') {
            // if there's a preceding <h2>, add this <h3> as its children
            const heading2 = heading2s[heading2s.length - 1];

            if (heading2) {
                heading2.children = heading2.children || [];
                heading2.children.push(heading);
            } else {
                headings.push(heading);
            }
        }
    }
}

function updateActiveHeadingByHash(_route: RouteLocationNormalized) {
    if (_route.hash) {
        const matchedHeading = headingsFlat.find((h) => h.id === _route.hash.slice(1));

        if (matchedHeading) {
            activeHeading.value = matchedHeading;

            return true;
        }
    }

    return false;
}

function updateIndicator() {
    if (!indicator.value || !navList.value || !activeHeading.value) {
        return;
    }

    let navItem: HTMLLIElement | undefined;

    let index = headings.indexOf(activeHeading.value);
    let subIndex = -1;

    if (index === -1) {
        for (index = 0; index < headings.length; index++) {
            const children = headings[index]!.children;

            if (children) {
                subIndex = children.indexOf(activeHeading.value);

                if (subIndex !== -1) {
                    break;
                }
            }
        }
    }

    if (index !== -1) {
        navItem = navList.value.children[index] as HTMLLIElement | undefined;
    }

    if (subIndex !== -1 && navItem) {
        const subNavList = navItem.children[navItem.children.length - 1];

        if (!subNavList) {
            logger.warn('TOC', `Could not find sub-list at [${index}] (active: ${activeHeading.value?.title})`);
            return;
        }

        navItem = subNavList.children[subIndex] as HTMLLIElement | undefined;
    }

    if (!navItem) {
        logger.warn(
            'TOC',
            `Could not find nav item at [${index}][${subIndex}] (active: ${activeHeading.value?.title})`
        );
        return;
    }

    const link = navItem.children[0] as HTMLAnchorElement | undefined;

    if (link?.tagName !== 'A') {
        logger.warn('TOC', 'Unexpected element type:', link?.tagName);
        return;
    }

    indicatorMovingUp.value = link.offsetTop < +indicatorStyles.top.replace('px', '');

    indicatorStyles.top = link.offsetTop + 'px';
    indicatorStyles.bottom = `calc(100% - ${link.offsetTop + link.clientHeight}px)`;
}
</script>

<style scoped>
.toc {
    position: relative;
    overflow: hidden;
}

.level1 {
    padding: 0 16px;
}

.level2 {
    padding: 0;

    .heading {
        padding-left: 32px;
    }
}

.heading {
    display: block;
    padding: 8px;
}

.dense1 {
    .heading {
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 14px;
    }
}

.dense2 {
    .heading {
        padding-top: 0;
        padding-bottom: 0;
        font-size: 14px;
    }
}

.indicator {
    position: absolute;
    display: block;
    top: 0;
    bottom: 100%;
    left: 12px;
    width: 4px;
    background: var(--color-accent);
    transition: top 0.3s cubic-bezier(0.04, 0.3, 0.49, 1.35), bottom 0.2s cubic-bezier(0.04, 0.3, 0.49, 1.35);

    &.upwards {
        transition: top 0.2s cubic-bezier(0.04, 0.3, 0.49, 1.35), bottom 0.3s cubic-bezier(0.04, 0.3, 0.49, 1.35);
    }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}
</style>
