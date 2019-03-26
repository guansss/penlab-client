<template>
    <TransitionGroup
            @before-enter="beforeEnter"
            @enter="enter"
            @leave="leave"
            name="list"
            tag="div"
    >
        <slot></slot>
    </TransitionGroup>
</template>

<style scoped lang="stylus">
</style>

<script>
import Debug from 'debug';

const debug = Debug('plab:ListTransition');

const indexOf = Array.prototype.indexOf;

export default {
    name: 'ListTransition',
    props: {
        offsetY: {
            type: String,
            default: '20%',
        },
        delayEach: {
            type: Number,
            default: 10,
        },
        duration: {
            type: Number,
            default: 300,
        },
    },
    methods: {
        beforeEnter(el) {
            el.style.opacity = 0;
        },
        enter(el, done) {
            const index = indexOf.call(el.parentNode.children, el);
            el.animate({
                transform: [`translateY(${this.offsetY})`, 'translateY(0)'],
                opacity: [0, 1],
            }, {
                delay: index * this.delayEach,
                duration: this.duration,
                easing: 'ease-out',
            }).onfinish = () => {
                el.style.opacity = 1;
                done();
            };
        },
        leave(el, done) {
            done();
        },
    },
};
</script>
