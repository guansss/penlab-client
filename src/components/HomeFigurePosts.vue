<template>
    <figure class="figure">
        <div class="post-list">
            <div
                v-for="post in posts"
                class="post"
                :style="{ '--title-size': post.titleSize, '--summary-size': post.summarySize }"
            ></div>
        </div>
    </figure>
</template>

<script setup lang="ts">
const postCount = 4;

let posts = Array.from({ length: postCount }).map(() => ({
    titleSize: ~~(Math.random() * 20 + 20) + '%',
    summarySize: ~~(Math.random() * 20 + 70) + '%',
}));

// double the list to produce a looping animation
posts = [...posts, ...posts];
</script>

<style scoped>
.figure {
    width: 400px;
    height: 300px;
    background: rgba(var(--color-bg-invert-rgb), 0.1);
    overflow: hidden;
}

.post-list {
    animation: slide 8s infinite linear;
}

.post {
    position: relative;
    margin: 12px 32px;
    height: 60px;
    background: var(--color-bg);
    box-shadow: 0 1px 9px 0 #0003;

    &:before {
        content: '';
        position: absolute;
        top: 8px;
        left: 8px;
        width: var(--title-size);
        height: 12px;
        background: var(--color-text);
        border-radius: 4px;
    }

    &:after {
        content: '';
        position: absolute;
        top: 24px;
        left: 8px;
        width: var(--summary-size);
        height: 12px;
        background: var(--color-text-secondary);
        border-radius: 4px;
    }
}

@keyframes slide {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-288px);
    }
}
</style>
