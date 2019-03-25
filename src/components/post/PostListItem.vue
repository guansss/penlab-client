<template>
    <router-link v-ripple class="item d-block pa-3" :to="link">
        <h2 class="headline d-inline-block mb-2">{{post.title}}</h2>
        <span class="date body-1 grey--text" v-if="display.date&&date">{{date}}</span>
        <p class="summary mb-0">{{post.summary}}</p>
    </router-link>
</template>

<style scoped lang="stylus">
@require '../../styles/variables.styl'

.item
    position relative
    color inherit

    &:before
        content ''
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        opacity .1
        transition background-color .1s ease-out

    &:hover
        &:before
            background-color: $color.primary

        h2
            color: $color.accent

    h2
        color: $color.primary

    .date
        float right

.summary
    color inherit
</style>

<script>
export default {
    name: 'PostListItem',
    data: () => ({}),
    props: {
        post: Object,
        details: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        link() {
            return '/articles/' + this.post.id;
        },
        display() {
            const display = {};
            this.details.forEach(option => (display[option] = true));
            return display;
        },
        date() {
            return !isNaN(this.post.created) ? new Date(+this.post.created).toLocaleDateString() : '';
        },
    },
};
</script>
