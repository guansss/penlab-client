<template>
    <div class="about container">
        <article class="article markdown-body" v-html="descHTML"></article>
        <div class="timeline" v-img-zoom>
            <div v-for="event in events" class="event">
                <div class="date col-12 col-lg-4">
                    <div class="year">{{ event.year }}</div>
                    <div class="day">{{ event.date }}</div>
                </div>
                <div class="col-1 d-none d-lg-block"></div>
                <div class="content col-12 col-lg-5">
                    <div class="desc">{{ event.desc }}</div>
                    <div v-if="event.images" class="image-list">
                        <img v-for="image in event.images" class="image" :src="image" alt="截图" />
                    </div>
                </div>
            </div>
        </div>
        <p class="build-time">
            版本构建时间：
            <time>{{ buildTime }}</time>
        </p>
    </div>
</template>

<script setup lang="ts">
import capture20181020 from '../assets/img/capture20181020.jpg';
import capture20181108_1 from '../assets/img/capture20181108-1.jpg';
import capture20181108 from '../assets/img/capture20181108.jpg';
import descMD from '../assets/texts/about.md?raw';
import { BUILD_TIME } from '../globals';
import { parseMarkdown } from '../tools/markdown';

const descHTML = parseMarkdown(descMD);

const events = [
    {
        year: '2018',
        date: '10-20',
        images: [capture20181020],
        desc: '初版完成，作为首次使用 Vue 的成果',
    },
    {
        year: '2018',
        date: '11-08',
        images: [capture20181108, capture20181108_1],
        desc: '使用 Vuetify 重做了界面，遵循 Material Design 添加了主题色，并增加了进度条、浮动按钮等特效',
    },
    {
        year: '2019',
        date: '10-17',
        desc: '由于费用的原因，将域名从 penlab.site 换为 penlab.cn',
    },
];

const buildTime = new Date(BUILD_TIME).toLocaleString();
</script>

<style scoped>
.markdown-body {
    margin-top: 32px;
}

.timeline {
    margin-top: 80px;
}

.event {
    margin-bottom: 160px;
    display: flex;
    flex-wrap: wrap;
}

.date {
    position: relative;
    margin-bottom: 24px;
    text-align: right;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 24px;
        background: repeating-linear-gradient(
            to right,
            var(--color-primary) 0,
            var(--color-primary) 5px,
            #0000 5px,
            #0000 10px
        );
        opacity: 0.3;
        transform: skew(-20deg);

        /* solves the jagged edges issue (https://stackoverflow.com/a/6898097/13237325) */
        backface-visibility: hidden;
    }
}

.year {
    position: relative;
    padding: 0 10px;
    display: inline-block;
    background: var(--color-primary);
    color: #fff;
    font-size: 20px;
    line-height: 24px;
    transform: skew(-20deg);
}

.day {
    position: relative;
    padding: 0 18px 0 6px;
    color: var(--color-primary);
    font-size: 80px;
    font-style: italic;
    line-height: 1;
}

.desc {
    line-height: 24px;
}

.image-list {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
}

.image {
    width: 100%;
    box-shadow: 0 3px 1px -2px #0003, 0 2px 2px 0 #0002, 0 1px 5px 0 #0002;
    transition: box-shadow 0.2s ease-out;

    &:hover {
        box-shadow: 0 5px 5px -3px #0003, 0 8px 10px 1px #0002, 0 3px 14px 2px #0002;
    }
}

.build-time {
    margin: 8px 0;
    color: var(--color-text-secondary);
    font-style: italic;
}
</style>
