<template>
    <v-footer dark height="auto" color="secondary">
        <v-container py-3>
            <v-layout row wrap justify-center>
                <v-flex>
                    ©Pencil
                </v-flex>
            </v-layout>
        </v-container>
    </v-footer>
</template>

<style scoped lang="stylus">
@require '../styles/global.styl'

#footer
    position relative
    height 90px
    background-color $color-normal
    color white

    .container
        height @height

        #desc
            align-self center
            margin-bottom 0
            font-size 0.8em

    #top
        height @height
        width @height
        color @color
        &:hover
            background-color lighten(@background-color, 10)

        i
            position relative
            top 50%
            left 50%
            transform translateX(-50%) translateY(-30%) rotate(90deg)
            font-size 36px

</style>

<script>
export default {
    name: 'TheFooter',
    methods: {
        scrollToTop() {
            // documentElement for desktop browser, body for mobile
            scrollToTop(document.documentElement);
            scrollToTop(document.body);
        }
    }
};

/**
 * @param {Element} elm
 */
function scrollToTop(elm) {
    elm.animate([
        {scrollTop: elm.scrollTop},
        {scrollTop: 0}], {
        easing: 'ease-out',
        duration: 500
    });
}
</script>
