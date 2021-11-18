<template>
    <div class="main container">
        <section class="section headline">
            <div class="poster col-12 col-lg-6">
                <ALShop class="al-shop"></ALShop>
            </div>
            <div class="col-1 d-none d-lg-block"></div>
            <div class="text col-12 col-lg-5">
                <LogoAdvanced class="logo" />
                <p>这里是铅笔的实验室，用于展示一些个人作品和文章</p>
                <p>当然，这个网站本身也是其中之一</p>
                <p class="d-md-none">因为使用了大量特效，在手机上可能会有卡顿</p>
            </div>
        </section>
        <section class="section">
            <div class="poster col-12 col-lg-6">
                <HomeFigureWorks class="figure" />
            </div>
            <div class="col-1 d-none d-lg-block"></div>
            <div class="text col-12 col-lg-5">
                <h2>作品</h2>
                <p>个人近年来的作品，只列出便于展示的项目</p>
                <p>我比较喜欢花里胡哨的东西，也喜欢折腾各种技术，所以这些作品可能看起来不是那么正经</p>
                <router-link to="/works">前往>></router-link>
            </div>
        </section>
        <section class="section">
            <div class="poster col-12 col-lg-6">
                <HomeFigurePosts class="figure" />
            </div>
            <div class="col-1 d-none d-lg-block"></div>
            <div class="text col-12 col-lg-5">
                <h2>文章</h2>
                <p>类似于博客，以开发日志为主，更新随缘</p>
                <p>其实我不爱写文章，但是作为个人网站总得有点内容才行，不然显得太空洞了 ¯\_(ツ)_/¯</p>
                <router-link to="/posts">前往>></router-link>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import ALShop from '../components/ALShop/ALShop.vue';
import HomeFigurePosts from '../components/HomeFigurePosts.vue';
import HomeFigureWorks from '../components/HomeFigureWorks.vue';
import LogoAdvanced from '../components/LogoAdvanced.vue';
</script>

<style scoped>
.main {
}

.section {
    min-height: 80vh;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .poster {
        .figure {
            margin: auto;
        }
    }

    .text {
        line-height: 1.8;

        :deep(h2) {
            font-size: 2.7em;
        }

        :deep(p) {
            margin-block-end: 0.8em;
        }
    }
}

.headline {
    .al-shop {
        display: block;
        margin-top: 36px;
        width: 100%;
    }

    .logo {
        margin-left: -16px;
        width: 410px;
        line-height: 0;
    }
}

@media (max-width: 992px) {
    .section {
        &:not(:first-child) {
            margin: 250px 0;
        }
    }

    .logo {
        width: 100% !important;
    }

    .figure {
        transform-origin: top left;
        transform: scale(0.8);
    }
}
</style>
