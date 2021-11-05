<template>
    <figure class="figure">
        <div
            v-for="work in works"
            class="work"
            :style="{ '--left': work.left, '--top': work.top, '--transform': work.transform, '--delay': work.delay }"
        ></div>
        <div class="content">
            <div class="shape"></div>
            <div class="shape2"></div>
        </div>
    </figure>
</template>

<script setup lang="ts">
const itemCount = 10;
const column = 4;
const duration = '4s'; // must be seconds

const containerWidth = 400;
const containerHeight = 300;
const containerPadding = 16;
const itemGap = 8;
const itemWidth = (containerWidth - containerPadding * 2 + itemGap) / column - itemGap;
const itemHeight = 60;
const itemExpandedMargin = 36;
const itemExpandedScale =
    `scale(${(containerWidth - itemExpandedMargin * 2) / itemWidth}, ` +
    `${(containerHeight - itemExpandedMargin * 2) / itemHeight})`;

const itemWidthPX = itemWidth + 'px';
const itemHeightPX = itemHeight + 'px';
const itemExpandedMarginPX = 36 + 'px';

const works: { left: string; top: string; transform: string; delay: string }[] = [];

for (let i = 0, row = -1; i < itemCount; i++) {
    if (i % column === 0) {
        row++;
    }

    const left = containerPadding + (itemWidth + itemGap) * (i % column);
    const top = containerPadding + (itemHeight + itemGap) * row;
    const translateX = itemExpandedMargin - left;
    const translateY = itemExpandedMargin - top;

    works.push({
        left: left + 'px',
        top: top + 'px',
        transform: `translate(${translateX}px, ${translateY}px) ` + itemExpandedScale,
        delay: i * Number(duration.slice(0, -1)) + 's',
    });
}
</script>

<style scoped>
.figure {
    position: relative;
    width: 400px;
    height: 300px;
    background: rgba(var(--color-bg-invert-rgb), 0.1);
    overflow: hidden;

    /* background shadow */

    &:before {
        content: '';
        position: absolute;
        z-index: 1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: #0003;
        animation: fade-shadow v-bind(duration) infinite ease-in-out;
    }
}

.work {
    position: absolute;
    top: var(--top);
    left: var(--left);
    width: v-bind(itemWidthPX);
    height: v-bind(itemHeightPX);
    background: var(--color-bg);
    box-shadow: 0 1px 9px 0 #0003;
    transform-origin: top left;
    animation: expand calc(v-bind(itemCount) * v-bind(duration)) infinite ease-in-out var(--delay);
}

.content {
    position: absolute;
    z-index: 10;
    top: v-bind(itemExpandedMarginPX);
    bottom: v-bind(itemExpandedMarginPX);
    left: v-bind(itemExpandedMarginPX);
    right: v-bind(itemExpandedMarginPX);
    padding: 16px;
    animation: fade-content v-bind(duration) infinite ease-in-out;

    /* title */

    &:before {
        content: '';
        position: absolute;
        top: 20px;
        left: 152px;
        width: 70px;
        height: 1em;
        background: var(--color-text);
        border-radius: 4px;
    }
}

.shape {
    position: relative;
    padding-top: 80px;
    width: 120px;
    background: var(--color-text-secondary);

    /* description 1 */

    &:before {
        content: '';
        position: absolute;
        top: 30px;
        left: 136px;
        width: 140px;
        height: 1em;
        background: var(--color-text-secondary);
        border-radius: 4px;
    }

    /* description 2 */

    &:after {
        content: '';
        position: absolute;
        top: 56px;
        left: 136px;
        width: 120px;
        height: 1em;
        background: var(--color-text-secondary);
        border-radius: 4px;
    }
}

/* summary */
.shape2 {
    position: relative;
    margin-top: 16px;
    height: 1em;
    background: var(--color-text-secondary);
    border-radius: 4px;

    &:before {
        content: '';
        position: absolute;
        top: 26px;
        left: 0;
        width: 180px;
        height: 1em;
        background: var(--color-text-secondary);
        border-radius: 4px;
    }
}

@keyframes fade-shadow {
    0%,
    40%,
    100% {
        opacity: 0;
    }
    50%,
    95% {
        opacity: 1;
    }
}

@keyframes fade-content {
    0%,
    42%,
    99%,
    100% {
        opacity: 0;
    }
    50%,
    94% {
        opacity: 1;
    }
}

@keyframes expand {
    0%,
    4%,
    10%,
    100% {
        z-index: 0;
        transform: none;
    }
    4.5%,
    9.5% {
        z-index: 2;
        transform: var(--transform);
    }
}
</style>
