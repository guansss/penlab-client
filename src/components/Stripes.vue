<template>
    <div class="stripes">
        <div ref="large" class="stripe large"></div>
        <div ref="medium" class="stripe medium"></div>
        <div ref="small" class="stripe small"></div>
    </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { emitter, Events } from '../event';
import { logger } from '../utils/logger';
import { clamp } from '../utils/misc';

// equals to vue-router's `ErrorTypes.NAVIGATION_DUPLICATED`,
// somehow the ErrorTypes enum is not exported
const NAVIGATION_ERROR_DUPLICATED = 16;

const VELOCITY_EPSILON = 0.001;

const angle = 20; // degrees

class StripeManager {
    static stripes: Stripe[] = [];

    // pixels per millisecond
    static baseVelocity = 0.01;

    static velocity = this.baseVelocity;
    static velocityOffset = 0;
    static velocityScaleFactors: Record<string, number> = {};

    // the absolute rate at which the current velocity gradually increases/decreases to scaled velocity
    static acceleration = 0.0003;

    static scheduleResettingVelocityOffset = debounce(() => (this.velocityOffset = 0), 100);

    static update(dt: DOMHighResTimeStamp) {
        // multiply all the factors
        const velocityScale = Object.values(this.velocityScaleFactors).reduce((prev, cur) => prev * cur, 1);

        const deltaV = this.baseVelocity * velocityScale - this.velocity;

        if (Math.abs(deltaV) >= VELOCITY_EPSILON) {
            let acceleration = this.acceleration * dt;

            // do not overshoot
            acceleration = Math.min(acceleration, Math.abs(deltaV));

            this.velocity += Math.sign(deltaV) * acceleration;
        }

        for (const stripe of this.stripes) {
            stripe.move(dt, this.velocity + this.velocityOffset);
            stripe.applyStyles();
        }
    }
}

class Stripe {
    static baseWidth = innerWidth * (0.01 + 0.005 * Math.random());

    // position from right to left
    x = 0;

    // actual width of the stripe after rotation
    actualWidth = 0;

    width = 0;

    constructor(
        public element: Ref<HTMLElement | undefined>,
        public widthMultiplier: number,
        public velocityMultiplier: number
    ) {
        this.x = innerWidth * Math.random();
        this.width = Stripe.baseWidth * this.widthMultiplier;
        this.actualWidth =
            this.width / Math.cos((angle / 180) * Math.PI) + innerHeight * Math.tan((angle / 180) * Math.PI);
    }

    move(dt: DOMHighResTimeStamp, velocity: number) {
        this.x += velocity * this.velocityMultiplier * dt;

        this.fitScreen();
    }

    /**
     * Fit position inside the window, producing a looping animation.
     */
    fitScreen() {
        const rightmost = -(this.actualWidth - this.width) / 2;
        const leftmost = (this.actualWidth + this.width) / 2 + innerWidth;

        if (this.x > leftmost) {
            this.x = rightmost;
        } else if (this.x < rightmost) {
            this.x = leftmost;
        }
    }

    applyStyles() {
        if (this.element.value) {
            this.element.value.style.width = this.width + 'px';
            this.element.value.style.transform = `translateX(${-this.x}px) rotate(${angle}deg)`;
        }
    }
}

const large = ref<HTMLElement | undefined>();
const medium = ref<HTMLElement | undefined>();
const small = ref<HTMLElement | undefined>();

// prettier-ignore
StripeManager.stripes = [
    new Stripe(large, 25, 1),
    new Stripe(medium, 8, 1.5),
    new Stripe(small, 1, 3),
];

let tickRafID = -1;
let lastTime = performance.now();
let lastScrollY = window.scrollY;

let freezeScroll = false;
let resetFreezeScrollTimer = -1;

const router = useRouter();

const cancelRouterBeforeEachGuard = router.beforeEach(() => {
    StripeManager.velocityScaleFactors['navigation'] = 50;

    clearTimeout(resetFreezeScrollTimer);
    freezeScroll = true;
});

const cancelRouterAfterEachGuard = router.afterEach((to, from, failure) => {
    // when navigating to a duplicated location, beforeEach() is not called and afterEach() is called,
    // what a stupid design of vue router...
    if (failure && failure.type === NAVIGATION_ERROR_DUPLICATED) {
        return;
    }

    StripeManager.velocityScaleFactors['navigation'] = 1;

    resetFreezeScrollTimer = setTimeout(() => (freezeScroll = false), 100);
});

onMounted(() => {
    // remember to record the initial position
    lastScrollY = window.scrollY;

    tickRafID = requestAnimationFrame(tick);
    document.addEventListener('scroll', onscroll, { passive: true });
    emitter.on('stripesVelocityScale', setVelocityScale);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(tickRafID);
    document.removeEventListener('scroll', onscroll);
    emitter.off('stripesVelocityScale', setVelocityScale);
    cancelRouterBeforeEachGuard();
    cancelRouterAfterEachGuard();
});

function tick(now: DOMHighResTimeStamp) {
    const dt = now - lastTime;
    lastTime = now;

    StripeManager.update(dt);

    tickRafID = requestAnimationFrame(tick);
}

function setVelocityScale(data: Events['stripesVelocityScale']) {
    StripeManager.velocityScaleFactors[data.id] = data.value;
}

function onscroll() {
    // when navigating to another component, the document will attempt to fit the window
    // and therefore produce a scroll (typically to the top), causing a very big jump,
    // in this case the scroll handler should be disabled to ensure the smooth transition
    // of stripe's velocity
    if (freezeScroll) {
        return;
    }

    // make sure that no error will be thrown or else the page may blow up
    try {
        const dy = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;

        StripeManager.velocityOffset = clamp(dy * 0.05, -1, 1);

        // settle the velocity when scroll has finished
        StripeManager.scheduleResettingVelocityOffset();
    } catch (e) {
        if (import.meta.env.DEV) {
            // do not warn() or error() or else the console will blow up
            logger.log(e);
        }
    }
}
</script>

<style scoped>
.stripes {
    position: fixed;
    z-index: -900;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
}

.stripe {
    position: absolute;
    top: -200px;
    bottom: -200px;
    left: 100%;
    background: rgba(var(--color-bg-invert-rgb), 0.02);
    transition: background-color var(--theme-fade-duration) ease-out;
}
</style>
