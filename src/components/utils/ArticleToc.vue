<template>
    <nav class="toc">
        <ul class="list level1" ref="navList">
            <transition-group name="slide-fade">
                <li v-for="(heading, i) in headings" :key="i">
                    <router-link
                        :class="['heading selectable accent gradient', { active: heading === activeHeading }]"
                        :to="'#' + heading.id"
                        >{{ heading.title }}
                    </router-link>

                    <ul class="list level2" v-if="heading.children">
                        <li v-for="(heading2, j) in heading.children" :key="j">
                            <router-link
                                :class="['heading selectable accent gradient', { active: heading === activeHeading }]"
                                :to="heading2.id"
                                >{{ heading.title }}
                            </router-link>
                        </li>
                    </ul>
                </li>
            </transition-group>
        </ul>
        <div ref="indicator" :class="['indicator', { upward: indicatorMovingUp }]" :style="indicatorStyles"></div>
    </nav>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, unref, watch } from 'vue';
import { onBeforeRouteUpdate, RouteLocationNormalized, useRoute } from 'vue-router';

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

const route = useRoute();

defineExpose({ updateHeadings });

onMounted(() => window.addEventListener('scroll', updateActiveHeading, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', updateActiveHeading));

// always return true, or else the navigation may be canceled because this function can return false
onBeforeRouteUpdate((to) => updateHeadingByHash(to) || true);

watch(() => activeHeading.value, updateIndicator);

const updateActiveHeading = debounce(() => {
    const pageTop = window.scrollY - 50;

    for (let i = headingsFlat.length - 1; i >= 0; i--) {
        const heading = headingsFlat[i];
        const elm = document.getElementById(heading!.id);

        if (elm && elm.offsetTop < pageTop) {
            activeHeading.value = heading;
            break;
        }
    }
}, 100);

async function updateHeadings(articleBody: HTMLElement, scroll = true) {
    buildHeadings(articleBody);

    activeHeading.value = headings[0];

    if (scroll) {
        if (updateHeadingByHash(route)) {
            document.getElementById(activeHeading.value!.id)?.scrollIntoView();
        } else {
            window.scroll({
                top: 0,
                behavior: 'smooth',
            });
        }
    }

    // wait for the DOM to render
    await nextTick();

    updateIndicator();
}

/**
 * Builds a heading tree according to the article's body, takes only <h2> and <h3>.
 */
function buildHeadings(articleBody: HTMLElement) {
    headings.splice(0);
    headingsFlat.splice(0);

    // the selector should actually be "h2, h3", but there are still some issues
    // when dealing with <h3> together with the indicator
    const hElements = Array.from(articleBody.querySelectorAll('h2')) as HTMLHeadingElement[];

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

function updateHeadingByHash(_route: RouteLocationNormalized) {
    if (_route.hash) {
        const matchedHeading = headings.find((h) => h.id === _route.hash.slice(1));

        if (matchedHeading) {
            activeHeading.value = matchedHeading;

            return true;
        }
    }

    return false;
}

// animate the indicator, this is incompatible with <3>
function updateIndicator() {
    if (!indicator.value || !navList.value || !activeHeading.value) {
        return;
    }

    const index = headingsFlat.indexOf(unref(activeHeading)!);
    const navItem = navList.value.children[index] as HTMLElement;

    if (!navItem) {
        return;
    }

    indicatorMovingUp.value = navItem.offsetTop < indicatorStyles.top;

    indicatorStyles.top = navItem.offsetTop + 'px';
    indicatorStyles.bottom = `calc(100% - ${navItem.offsetTop + navItem.clientHeight}px)`;
}
</script>

<style scoped>
.toc {
    position: relative;
}

.list {
    padding: 0 16px;
}

.level1 {
}

.level2 {
    padding-left: 32px;
}

.heading {
    display: block;
    padding: 8px 8px;
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

    &.upward {
        transition: top 0.2s cubic-bezier(0.04, 0.3, 0.49, 1.35), bottom 0.3s cubic-bezier(0.04, 0.3, 0.49, 1.35);
    }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.1s ease-out, transform 0.1s ease-out;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(30px);
    opacity: 0;
}
</style>
