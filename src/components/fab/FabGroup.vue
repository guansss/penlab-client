<template>
    <VLayout column id="fab-group">
        <VBtn fab bottom dark color="accent" :loading="loading" @click="$vuetify.goTo(0,{easing:'easeInOutCubic'})">
            <VIcon>arrow_upward</VIcon>
        </VBtn>
    </VLayout>
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
