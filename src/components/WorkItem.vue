<template>
    <div ref="workItem" :class="['work-item', { active: modalActive, transitioning }]" @click="active = true">
        <transition name="fade">
            <div v-if="active" class="fullscreen-bg" @wheel.prevent=""></div>
        </transition>

        <img ref="previewImage" :src="work.img" alt="Preview" class="preview-image img" />
        <div class="cover"></div>
        <div class="badge-back"></div>
        <div class="badge">
            <div class="inner">
                <mdi-web v-if="work.icon === 'web'" class="icon" viewBox="0 0 24 24" />
                <mdi-monitor v-else-if="work.icon === 'pc'" class="icon" viewBox="0 0 24 24" />
            </div>
        </div>
        <div ref="previewTitle" class="preview-title">{{ work.title }}</div>

        <div v-if="modalActive" ref="fullscreen" class="fullscreen" @click.stop="active = false">
            <div ref="modalBG" class="modal-bg"></div>

            <div ref="modal" class="modal" @click.stop="">
                <mdi-window-close class="close button" viewBox="0 0 24 24" @click.stop="active = false" />
                <div ref="image" class="image">
                    <img :src="work.img" alt="Preview" class="img" />
                </div>
                <div class="details">
                    <div ref="title" class="title">{{ work.title }}</div>
                    <div class="field-row">
                        <div class="field">类型</div>
                        <div>{{ work.type }}</div>
                    </div>
                    <div class="field-row">
                        <div class="field">日期</div>
                        <div>{{ work.date }}</div>
                    </div>
                    <div class="field-row links">
                        <div class="field">链接</div>
                        <a v-if="work.webpage" class="link button accent" :href="work.webpage" target="_blank">
                            <mdi-web class="icon" />
                            网页</a
                        >
                        <a v-if="work.dist" class="link button accent" :href="work.dist" target="_blank">
                            <mdi-cloud class="icon" />
                            发布页</a
                        >
                        <a v-if="work.github" class="link button accent" :href="work.github" target="_blank">
                            <mdi-github class="icon" />
                            GitHub</a
                        >
                        <a v-if="work.video" class="link button accent" :href="work.video" target="_blank">
                            <mdi-play class="icon" />
                            视频</a
                        >
                    </div>
                </div>
                <div class="desc markdown-body" v-html="work.desc"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MdiCloud from '@mdi/svg/svg/cloud-download.svg';
import MdiGithub from '@mdi/svg/svg/github.svg';
import MdiMonitor from '@mdi/svg/svg/monitor.svg';
import MdiPlay from '@mdi/svg/svg/play-circle-outline.svg';
import MdiWeb from '@mdi/svg/svg/web.svg';
import MdiWindowClose from '@mdi/svg/svg/window-close.svg';
import { nextTick, PropType, ref, watch } from 'vue';
import { WORKS } from '../data/works';
import { lockPageScroll, unlockPageScroll } from '../utils/dom';

const props = defineProps({
    work: {
        type: Object as PropType<typeof WORKS[number]>,
        required: true,
    },
});

const active = ref(false);
const modalActive = ref(false);
const transitioning = ref(false);

// css vars
const modalTop = ref('0');
const modalLeft = ref('0');
const modalHeight = ref('0');

const workItem = ref<HTMLElement | undefined>();
const previewImage = ref<HTMLElement | undefined>();
const previewTitle = ref<HTMLElement | undefined>();
const fullscreen = ref<HTMLElement | undefined>();
const modal = ref<HTMLElement | undefined>();
const modalBG = ref<HTMLElement | undefined>();
const image = ref<HTMLElement | undefined>();
const title = ref<HTMLElement | undefined>();

watch(active, async () => {
    if (!workItem.value) {
        return;
    }

    if (active.value) {
        modalActive.value = true;
        transitioning.value = true;

        lockPageScroll();

        const movements = [moveModalBG(), moveImage(), moveTitle()];

        movements.forEach((m) => m.next());

        await nextTick();

        await Promise.all(movements.map((m) => m.next().value));

        transitioning.value = false;
    } else {
        transitioning.value = true;

        const movements = [moveModalBG(true), moveImage(true), moveTitle(true)];

        movements.forEach((m) => m.next());

        await Promise.all(movements.map((m) => m.next().value));

        unlockPageScroll();

        modalActive.value = false;
        transitioning.value = false;
    }
});

function* moveModalBG(reverse?: boolean) {
    const modalBoundsInitial = workItem.value!.getBoundingClientRect();

    // wait for the DOM to change
    yield;

    const modalBoundsActive = modal.value!.getBoundingClientRect();

    // give the height to modelBG because it's an empty div, and therefore has a zero height
    modalHeight.value = modalBoundsActive.height + 'px';

    // manually calculate the top (and left) because margin:auto does not work on modalBG
    modalTop.value = (fullscreen.value!.scrollHeight - modalBoundsActive.height) / 2 + 'px';

    // take the clientWidth of the fullscreen element, which is the modal's container,
    // instead of window.innerWidth because there can be a scrollbar in the fullscreen element
    // when the modal exceeds window's height
    modalLeft.value = (fullscreen.value!.clientWidth - modalBoundsActive.width) / 2 + 'px';

    // FLIP animation, transforming the element from its beginning state to end state,
    // see https://css-tricks.com/animating-layouts-with-the-flip-technique/
    const keyframes = [
        {
            transform: `translate(${modalBoundsInitial.left - modalBoundsActive.left}px, ${
                modalBoundsInitial.top - modalBoundsActive.top
            }px) scale(${modalBoundsInitial.width / modalBoundsActive.width}, ${
                modalBoundsInitial.height / modalBoundsActive.height
            })`,
        },
        { transform: 'none' },
    ];

    return animate(modalBG.value!, keyframes, reverse);
}

function* moveImage(reverse?: boolean) {
    const imageBoundsInitial = previewImage.value!.getBoundingClientRect();

    yield;

    const imageBoundsActive = image.value!.getBoundingClientRect();

    const keyframes = [
        {
            transform: `translate(${imageBoundsInitial.left - imageBoundsActive.left}px, ${
                imageBoundsInitial.top - imageBoundsActive.top
            }px) scale(${imageBoundsInitial.width / imageBoundsActive.width}, ${
                imageBoundsInitial.height / imageBoundsActive.height
            })`,
        },
        { transform: 'none' },
    ];

    return animate(image.value!, keyframes, reverse);
}

function* moveTitle(reverse?: boolean) {
    const titleBoundsInitial = previewTitle.value!.getBoundingClientRect();

    yield;

    const titleBoundsActive = title.value!.getBoundingClientRect();

    // text should not be scaled
    const keyframes = [
        {
            transform: `translate(${titleBoundsInitial.x - titleBoundsActive.x - 16}px, ${
                titleBoundsInitial.y - titleBoundsActive.y
            }px)`,
        },
        { transform: 'none' },
    ];

    return animate(title.value!, keyframes, reverse);
}

function animate(element: HTMLElement, keyframes: Keyframe[], reverse?: boolean) {
    if (reverse) {
        keyframes.reverse();
    }

    const animation = element.animate(keyframes, {
        duration: 300,
        easing: 'ease-in-out',
    });

    return new Promise((resolve) => (animation.onfinish = animation.oncancel = resolve));
}
</script>

<style scoped>
.work-item {
    position: relative;
    padding-top: 61.8%;
    box-shadow: 0 3px 1px -2px #0003, 0 2px 2px 0 #0002, 0 1px 5px 0 #0002;
    transition: box-shadow 0.2s ease-out;

    &:hover {
        box-shadow: 0 5px 5px -3px #0003, 0 8px 10px 1px #0002, 0 3px 14px 2px #0002;
    }

    &.active {
        box-shadow: none;
        transition: none;

        .preview-image,
        .preview-title {
            opacity: 0;
            transition: opacity 0.1s;
        }

        .cover {
            background-position: top left;
        }
    }

    &.active,
    &:hover {
        .badge-back {
            transform: scale(0);
        }

        .badge .inner {
            clip-path: polygon(0 0, 0 0, 0 0);
        }

        .cover {
            background-position: top left;
        }

        .preview-title {
            text-shadow: 0 2px 2px #0000006b, 0 2px 9px #000000;
        }
    }
}

.transitioning {
    .fullscreen {
        overflow: hidden;
    }

    .close,
    .field-row,
    .desc {
        opacity: 0;
        transition: opacity 0.1s ease-out !important;
    }

    .title {
        background: #0000 !important;
        text-shadow: 0 2px 2px #0000006b, 0 2px 9px #000000 !important;
        transition: background-color 0.1s ease-out, text-shadow 0.1s ease-out !important;
    }
}

.fullscreen,
.fullscreen-bg {
    position: fixed;
    z-index: 101;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}

.fullscreen-bg {
    z-index: 100;
    background: #000a;
}

.fullscreen {
    display: flex;
    overflow: hidden auto;

    /*
    do not set these values to center the modal, use margin:auto on the modal instead
    https://stackoverflow.com/a/33455342/13237325

    justify-content: center;
    align-items: center;
    */
}

.badge,
.badge-back {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 96px;
    height: 60px;
}

.badge {
    color: #fff;
    filter: drop-shadow(2px 2px 3px #0005);

    .inner {
        z-index: 1;
        width: 100%;
        height: 100%;
        background: var(--color-accent);
        clip-path: polygon(0 0, 100% 0, 0 100%);
        transition: clip-path 0.2s ease-out;
    }

    .icon {
        margin: 4px;
        width: 36px;
        height: 36px;
    }
}

.badge-back {
    z-index: -1;
    background: #666;
    transform-origin: top left;
    transition: transform 0.2s ease-out;
}

.img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-bg);
    object-fit: cover;
    object-position: top left;
}

.cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(to bottom right, #0000 0, #0000 45%, #0006 55%, #0006 100%);
    background-size: 220% 220%;
    background-position: bottom right;
    cursor: pointer;
    transition: background-position 0.2s ease-out;
}

.preview-title {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #fffe;
    font-size: 36px;
    line-height: 2;
    white-space: nowrap;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: text-shadow 0.2s ease-out;
}

.modal-bg,
.modal {
    width: 940px;
}

.modal-bg {
    position: absolute;
    z-index: 101;
    top: v-bind(modalTop);
    left: v-bind(modalLeft);
    height: v-bind(modalHeight);
    background: var(--color-bg);
    transform-origin: top left;
    box-shadow: 0 5px 5px -3px #0003, 0 8px 10px 1px #0002, 0 3px 14px 2px #0002;
}

.modal {
    --padding: 16px;
    position: relative;
    z-index: 102;
    margin: auto;
    padding: var(--padding);
    display: flex;
    flex-wrap: wrap;
    cursor: default;
    pointer-events: auto;

    .close {
        position: absolute;
        z-index: 103;
        right: -72px;
        top: 0;
        padding: 8px;
        width: 72px;
        height: 72px;
        color: #fff;
        transition: opacity 0.2s ease-out;

        &:hover {
            background: #fff3;
        }
    }

    .image {
        position: relative;
        flex: 0 0 auto;
        width: 40%;
        padding-top: calc(40% * 0.618);
        transform-origin: top left;
    }

    .desc {
        flex: 0 0 100%;
        margin-top: var(--padding);
        padding: var(--padding);
        background: rgba(var(--color-bg-invert-rgb), 0.07);
        overflow: auto;
        transition: opacity 0.2s ease-out;
    }
}

.details {
    flex-grow: 1;
    padding-left: var(--padding);
    display: flex;
    flex-direction: column;

    .title {
        padding-left: var(--padding);
        background: var(--color-bg-darken);
        color: #fff;
        font-size: 36px;
        line-height: 2;
        text-shadow: none;
        transform-origin: top left;
        transition: background-color 0.3s, text-shadow 0.3s;
    }

    .field-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        background: rgba(var(--color-bg-invert-rgb), 0.07);
        line-height: 36px;
        transition: opacity 0.2s ease-out;

        &:not(:first-child) {
            margin-top: 8px;
        }

        &:last-child {
            flex-grow: 1;
        }
    }

    .field {
        margin-right: 16px;
        align-self: stretch;
        display: inline-flex;
        align-items: center;
        padding: 0 16px;
        background: var(--color-bg-darken);
        color: #fff;
    }

    .icon {
        margin-right: 2px;
    }
}

@media (max-width: 992px) {
    .modal {
        .image {
            width: 100%;
            padding-top: 61.8%;
        }

        .details {
            padding-top: var(--padding);
            padding-left: 0;
        }

        .close {
            right: 0;
        }
    }

    .modal-bg,
    .modal {
        width: calc(100% - 16px);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
