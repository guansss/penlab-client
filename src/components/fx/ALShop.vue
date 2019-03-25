<template>
    <canvas id="al-shop" :width="width" :height="height"></canvas>
</template>

<style scoped lang="stylus">
#al-shop
    touch-action auto !important
</style>

<script>
import { Application, loader, Sprite } from 'pixi.js';

export default {
    name: 'ALShop',
    data: () => ({
        width: META.width,
        height: META.height,
        pixiApp: null,
    }),
    async mounted() {
        this.pixiApp = await initAnim(this.$el);

        jumpBirds(this.pixiApp);

        this.$el.addEventListener('touchstart', () => jumpBirds(this.pixiApp));
        this.$el.addEventListener('mouseover', () => jumpBirds(this.pixiApp));
    },
    beforeDestroy() {
        finishAnim(this.pixiApp);
    },
};

const META = {
    file: '/pixi/al-shop.json',
    width: 692,
    height: 568,
    birds: [[390, 46], [364, 40], [338, 34], [312, 28]],
    frameOffsetY: [0, -7, -20, -25],
    duration: 100, // ms per frame
};

const BIRDS = Symbol();
const ALIVE = Symbol();

async function initAnim(canvas) {
    const app = (window.pixiApp = new Application({
        autoStart: false,
        view: canvas,
        width: META.width,
        height: META.height,
        transparent: true,
    }));

    app.renderer.plugins.interaction.autoPreventDefault = false;

    if (!loader.resources[META.file]) {
        console.info('load textures');
        await new Promise(resolve => {
            loader.add(META.file).load(resolve);
        });
    }

    const textures = loader.resources[META.file].textures;

    const bg = new Sprite(textures['bg']);
    app.stage.addChild(bg);

    function Bird(x, y) {
        // setup 4 frames for jumping
        this.sprites = Array(4)
            .fill(0)
            .map((v, i) => {
                const sprite = new Sprite(textures['bird' + i]);
                sprite.position.set(x, y + META.frameOffsetY[i]);
                sprite.visible = i === 0; // show first frame as default
                return sprite;
            });

        const IDLE = Symbol();
        const JUMPING = Symbol();
        const FALLING = Symbol();

        let state = IDLE;
        let curFrame = 0;
        let duration = META.duration;

        this.nextTime = 0;

        this.update = now => {
            if (state === IDLE) return false;

            this.sprites[curFrame].visible = false;

            if (state === JUMPING) {
                if (++curFrame === 3) state = FALLING;
            } else if (state === FALLING) {
                if (--curFrame === 0) state = IDLE;
            }

            this.sprites[curFrame].visible = true;
            this.nextTime = now + duration;

            return true;
        };

        this.jump = (dur = META.duration) => {
            if (state === IDLE) {
                duration = dur;
                state = JUMPING;
            }
        };
    }

    const birds = Array(4)
        .fill(0)
        .map((v, i) => new Bird(...META.birds[i]));

    birds
        .slice()
        .reverse()
        .forEach(bird =>
            bird.sprites.forEach(sprite => app.stage.addChild(sprite)),
        );

    app[BIRDS] = birds;
    app[ALIVE] = true;
    app.render();

    function tick(now) {
        if (app[ALIVE]) requestAnimationFrame(tick);

        let stageUpdated = false;

        for (const bird of birds)
            if (now > bird.nextTime)
                stageUpdated = bird.update(now) || stageUpdated;

        if (stageUpdated) app.render();
    }

    requestAnimationFrame(tick);

    return app;
}

async function jumpBirds(pixiApp) {
    for (const bird of pixiApp[BIRDS]) {
        bird.jump(80);
        await new Promise(resolve => setTimeout(resolve, 150));
    }
}

function finishAnim(pixiApp) {
    if (pixiApp) {
        pixiApp[ALIVE] = false;
        pixiApp.destroy(false, { children: true });
    }
}
</script>
