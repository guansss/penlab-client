<template>
    <transition-group @before-enter="beforeEnter" @enter="onEnter" @leave="onLeave" name="list" tag="div">
        <slot></slot>
    </transition-group>
</template>

<script setup lang="ts">
const props = defineProps({
    offsetY: {
        type: String,
        default: '20px',
    },
    delayEach: {
        type: Number,
        default: 10,
    },
    duration: {
        type: Number,
        default: 300,
    },
});

function beforeEnter(el: Element) {
    (el as HTMLElement).style.opacity = '0';
}

function onEnter(el: Element, done: () => void) {
    if (el.parentNode) {
        const index = Array.prototype.indexOf.call(el.parentNode.children, el);

        el.animate(
            {
                transform: [`translateY(${props.offsetY})`, 'translateY(0)'],
                opacity: [0, 1],
            },
            {
                delay: index * props.delayEach,
                duration: props.duration,
                easing: 'ease-out',
            }
        ).onfinish = () => {
            (el as HTMLElement).style.opacity = '1';
            done();
        };
    }
}

function onLeave(el: Element, done: () => void) {
    done();
}
</script>
