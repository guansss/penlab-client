<template>
    <footer class="footer">
        <div class="content container">
            <div class="copyright">©Pencil</div>
        </div>
    </footer>
</template>

<script lang="ts">
export default {
    methods: {
        scrollToTop() {
            // documentElement for desktop browser, body for mobile
            scrollToTop(document.documentElement);
            scrollToTop(document.body);
        },
    },
};

function scrollToTop(elm: HTMLElement) {
    elm.animate([
        { scrollTop: elm.scrollTop },
        { scrollTop: 0 }], {
        easing: 'ease-out',
        duration: 500,
    });
}
</script>

<style scoped>
.footer {
    background: var(--color-bg-dark);
    color: var(--color-text-dark);
}

.content {
    padding: 16px 0;
    display: flex;
    align-items: center;
}
</style>
