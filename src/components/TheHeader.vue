<template>
    <header>
        <v-toolbar dark :tabs="mobile&&showTabs" color="primary" class="px-0">
            <v-container fill-height mx-auto my-0 py-0>
                <v-layout row wrap align-center>
                    <v-toolbar-title id="toolbar-title" class="fill-height">
                        <div id="logo" class="fill-height">
                            <p id="logo-sup">铅笔的实验室</p>
                            Pencil's Lab
                        </div>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items v-if="!mobile">
                        <v-btn flat v-for="(route,i) in routes" :key="i" :to="route.path">
                            {{route.name}}
                        </v-btn>
                    </v-toolbar-items>
                    <v-toolbar-items v-if="mobile">
                        <v-btn flat icon @click="showTabs=!showTabs">
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-menu bottom left offset-y min-width="30%" transition="slide-y-transition">
                            <v-list>
                                <v-list-tile ripple v-for="(route,i) in routes" :key="i" :to="route.path">
                                    <v-list-tile-title></v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-toolbar-items>
                </v-layout>
            </v-container>
            <v-tabs dark right slot="extension" color="transparent" v-if="mobile&&showTabs">
                <v-tab v-for="(route,i) in routes" :key="i" :to="route.path">
                    {{route.name}}
                </v-tab>
            </v-tabs>
        </v-toolbar>
    </header>
</template>

<style scoped lang="stylus">
@require '../styles/variables.styl'

@media (max-width: 960px)
    .container
        padding-left 0
        padding-right 0

/*a
    color darkgray
    &.router-link-exact-active
        color white
    &:hover
        color white*/

#toolbar-title
    transition transform .1s ease-out

#logo
    display flex
    flex-direction column
    justify-content center
    font-family logo
    font-size 30px
    line-height 1

    &-sup
        margin 0
        font-size 10px

</style>

<script>
export default {
    name: 'TheHeader',
    data: () => ({
        routes: [{
            path: '/',
            name: '首页',
        }, {
            path: '/posts',
            name: '文章',
        }],
        showTabs: true,
    }),
    computed: {
        mobile() {
            return this.$vuetify.breakpoint.smAndDown;
        },
    },
    methods: {
        toggleDarkTheme(event) {
            const rect = event.target.getBoundingClientRect();
            this.$store.commit('setDarkTheme', {
                dark: !this.$store.state.darkTheme,
                origin: [rect.x + rect.width / 2, rect.y + rect.height / 2],
            });
        },
    },
};
</script>
