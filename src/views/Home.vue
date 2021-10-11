<template>
    <div class="main container">
        <div class="headline">
            <div class="poster">
                <ALShop id="al-shop"></ALShop>
            </div>
            <div class="title">
                <LogoAdvanced />
                <p class="desc">这里是铅笔的实验室，用于展示一些个人作品和文章</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ALShop from '../components/ALShop/ALShop.vue';
import LogoAdvanced from '../components/LogoAdvanced.vue';</script>

<style scoped>
.main {
}

.headline {
    display: flex;
    align-items: center;

    .poster {
        margin-top: 36px;
    }

    .title {
        text-align: center;
    }

    :deep(.logo) {
        margin: -40px;
    }
}
</style>
