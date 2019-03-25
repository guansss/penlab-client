<template>
    <div v-if="transitioning" class="bg" :style="{backgroundColor:fromColor}">
        <svg viewBox="0 0 2 2" class="ripple" :style="{left:position[0]+'px',top:position[1]+'px'}">
            <circle cx="1" cy="1" r="1" :fill="toColor"></circle>
        </svg>
    </div>
</template>

<style scoped lang="stylus">
.bg
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    overflow hidden

.ripple
    position absolute
    width 100px
    height @width
</style>

<script>
export default {
    name: 'BgTransition',
    props: {
        position: {
            type: Array,
            default: () => [0, 0],
        },
        fromColor: String,
        toColor: String,
    },
    data: () => ({
        transitioning: false,
    }),
    watch: {
        fromColor(color) {
        },
        toColor(color) {
            this.start();
        },
    },
    methods: {
        start() {
            this.transitioning = true;
            this.$nextTick(this.transition); // wait for `this.$el` to render
        },
        transition() {
            const scaleTo = 5 * this.$el.getBoundingClientRect().width / 100;
            console.log(scaleTo);
            this.$el.childNodes[0].animate({
                transform: ['scale(1)', `scale(${scaleTo})`],
            }, {
                duration: 1000,
                easing: 'ease-out',
            })
                .onfinish = () => this.finish();
        },
        finish() {
            this.transitioning = false;
            this.$emit('finish');
        },
    },
};
</script>
