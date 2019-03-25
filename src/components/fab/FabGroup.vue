<template>
    <v-layout column id="fab-group">
        <v-btn fab bottom dark color="accent" :loading="loading" @click="$vuetify.goTo(0,{easing:'easeInOutCubic'})">
            <v-icon>arrow_upward</v-icon>
        </v-btn>
    </v-layout>
</template>

<style scoped lang="stylus">
.v-btn
    bottom 24px
</style>

<script>
export default {
    name: 'FabGroup',
    props: {
        loading: false,
    },
};
</script>
