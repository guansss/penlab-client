<template>
    <v-container id="home" class="pa-3">
        <v-layout row wrap justify-center class="jumbotron">
            <v-flex xs12 md6>
                <a-l-shop id="al-shop"></a-l-shop>
            </v-flex>
            <v-flex xs12 md6>
                <v-layout fill-height column justify-center text-xs-center>
                    <h1 id="logo">Pencil's Lab</h1>
                    <p>这里是铅笔的实验室，用于展示博客以及一些奇怪的东西<br />
                        <span class="spoiler">还在建造中，暂时并没有什么实质性的内容</span>
                    </p>
                </v-layout>
            </v-flex>
        </v-layout>
        <post-list id="article-list" filter="articles" order="created" :number="2" />
    </v-container>
</template>

<style scoped lang="stylus">
#logo
    font-size 2.5rem
    font-family 'logo'
    font-weight normal
    line-height 1.2

    cursor default
    transition letter-spacing .1s

    &:hover
        letter-spacing 2px

@media (min-width: 992px)
    #logo
        font-size 3.5rem

@media (min-width: 1200px)
    #logo
        font-size 4rem

.jumbotron
    padding 64px 32px
    margin-bottom 32px

#al-shop
    width 100%
    padding 10px
    image-rendering pixelated
</style>

<script>
import PostList from '../components/post/PostList';
import ALShop from '../components/fx/ALShop';

export default {
    name: 'home',
    components: {
        ALShop,
        PostList,
    },
    data: () => ({}),
    mounted() {
    },
};
</script>
