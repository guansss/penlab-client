<template>
    <header>
        <VToolbar dark :tabs="mobile&&showTabs" color="primary" class="px-0">
            <VContainer fill-height mx-auto my-0 py-0>
                <VLayout row wrap align-center>
                    <VToolbarTitle id="toolbar-title" class="fill-height">
                        <div id="logo" class="fill-height">
                            <p id="logo-sup">铅笔的实验室</p>
                            Pencil's Lab
                        </div>
                    </VToolbarTitle>
                    <VSpacer></VSpacer>
                    <VToolbarItems v-if="!mobile">
                        <VBtn flat v-for="(route,i) in routes" :key="i" :to="route.path">
                            {{route.name}}
                        </VBtn>
                    </VToolbarItems>
                    <VToolbarItems v-if="mobile">
                        <VBtn flat icon @click="showTabs=!showTabs">
                            <VIcon>more_vert</VIcon>
                        </VBtn>
                        <VMenu bottom left offset-y min-width="30%" transition="slide-y-transition">
                            <VList>
                                <VListTile ripple v-for="(route,i) in routes" :key="i" :to="route.path">
                                    <VListTileTitle></VListTileTitle>
                                </VListTile>
                            </VList>
                        </VMenu>
                    </VToolbarItems>
                </VLayout>
            </VContainer>
            <VTabs dark right slot="extension" color="transparent" v-if="mobile&&showTabs">
                <VTab v-for="(route,i) in routes" :key="i" :to="route.path">
                    {{route.name}}
                </VTab>
            </VTabs>
        </VToolbar>
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
