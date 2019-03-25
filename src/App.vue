<template>
    <v-app :dark="dark">
        <the-header id="header" />
        <v-content>
            <bg-transition :position="bgTransPosition" :from-color="bgTransFromColor" :to-color="bgTransToColor" />
            <router-view id="main-router-view" />
        </v-content>
        <the-footer />
    </v-app>
</template>

<style lang="stylus">
/*@require './assets/cdn/bootstrap.min.css'
@require './assets/cdn/github-markdown.css'
@require './assets/cdn/github-gist.min.css'
@font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(./assets/cdn/material-icons.woff2) format('woff2');
}

.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
}*/

@font-face
    font-family logo
    font-style normal
    src url(./assets/fonts/Drafting.woff2) format('woff2')
    src url(./assets/fonts/Drafting.woff) format('woff')

#header
    z-index 1100

#main-router-view
    position relative
</style>

<script>
import TheHeader from './components/TheHeader';
import TheFooter from './components/TheFooter';
import BrowserWarning from './components/utils/BrowserWarning';
import BgTransition from './components/anim/BgTransition';

export default {
    components: { BgTransition, BrowserWarning, TheFooter, TheHeader },
    data: () => ({
        bgTransFromColor: '',
        bgTransToColor: '',
    }),
    computed: {
        dark() {
            return this.$store.state.darkTheme;
        },
        bgTransPosition() {
            return this.$store.state.darkThemeTransitionOrigin;
        },
    },
    watch: {
        dark() {
            this.bgTransFromColor = getComputedStyle(this.$el)['background-color'];
            this.$nextTick(() => this.bgTransToColor = getComputedStyle(this.$el)['background-color']);
        },
    },
};
</script>
