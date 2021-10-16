import { Application } from '@pixi/app';
import { BatchRenderer, Renderer, Texture } from '@pixi/core';
import { Loader } from '@pixi/loaders';
import { Sprite } from '@pixi/sprite';
import { SpritesheetLoader } from '@pixi/spritesheet';
import { logger } from '../../utils/logger';
import { delay } from '../../utils/misc';

Renderer.registerPlugin('batch', BatchRenderer);
Loader.registerPlugin(SpritesheetLoader);

const LOG_TAG = 'ALShop';
const spriteFile = '/sprites/al-shop.json';
export const canvasWidth = 692;
export const canvasHeight = 568;
const birdPositions = [
    [390, 46],
    [364, 40],
    [338, 34],
    [312, 28],
] as [x: number, y: number][];
const frameOffsetY = [0, -7, -20, -25];
const frameDuration = 100; // ms

let animationEnabled = false;
let shouldRender = false;
let pixiApp: Application | undefined;
let birds: Bird[] = [];
let tickerHandle = -1;

type BirdFrameIndices = 0 | 1 | 2 | 3;
type SpriteSheetTextures = {
    [K in 'bg' | `bird${BirdFrameIndices}`]: Texture;
};

let loadingSpriteSheet: Promise<SpriteSheetTextures> | undefined;

export async function loadSpriteSheet() {
    if (!loadingSpriteSheet) {
        loadingSpriteSheet = new Promise<SpriteSheetTextures>((resolve, reject) => {
            if (Loader.shared.resources && Loader.shared.resources[spriteFile]) {
                onload();
            } else {
                Loader.shared.onComplete.add(onload);
                Loader.shared.onError.add(onerror);
                Loader.shared.add(spriteFile).load();
            }

            function onload() {
                resolve(Loader.shared.resources[spriteFile].textures as SpriteSheetTextures);
            }

            function onerror(e: unknown) {
                reject(new Error('ALShop: Failed to load sprite.'));
            }
        });
    }

    return loadingSpriteSheet;
}

export async function setupAnimation(canvas: HTMLCanvasElement) {
    clearAnimation();

    logger.log(LOG_TAG, 'Setting up animation');

    animationEnabled = true;

    const textures = await loadSpriteSheet();

    if (!animationEnabled) {
        return;
    }

    pixiApp = new Application({
        view: canvas,
        backgroundAlpha: 0,
        width: canvasWidth,
        height: canvasHeight,
    });

    const bg = new Sprite(textures['bg']);
    pixiApp.stage.addChild(bg);

    birds = [3, 2, 1, 0].map((i) => new Bird(textures, birdPositions[i]));

    shouldRender = true;

    tickerHandle = requestAnimationFrame(tick);
}

function tick(now: DOMHighResTimeStamp) {
    if (!pixiApp) {
        logger.warn(LOG_TAG, 'Pixi app is missing, canceling the animation loop.');
        return;
    }

    tickerHandle = requestAnimationFrame(tick);

    for (const bird of birds) {
        // render stage only when the birds are actually updated
        shouldRender ||= bird.update(now);
    }

    if (shouldRender) {
        shouldRender = false;

        pixiApp.render();
    }
}

export async function jumpBirds() {
    for (let i = birds.length - 1; i >= 0; i--) {
        birds[i].jump();

        await delay(150);
    }
}

export function clearAnimation() {
    logger.log(LOG_TAG, 'Clearing animation');

    animationEnabled = false;

    cancelAnimationFrame(tickerHandle);

    if (pixiApp) {
        pixiApp.destroy(false, { children: true });
        pixiApp = undefined;
    }

    birds = [];
}

class Bird {
    state: 'idle' | 'jumping' | 'falling' = 'idle';

    curFrame = 0;
    nextTime = 0;

    sprites: Sprite[];

    constructor(textures: SpriteSheetTextures, position: [x: number, y: number]) {
        if (!pixiApp) {
            throw new Error('Attempting to create sprites but pixiApp is undefined.');
        }

        // set up 4 frames for jumping animation
        this.sprites = [0, 1, 2, 3].map((i) => {
            const texture = textures[('bird' + 1) as keyof SpriteSheetTextures];
            const sprite = new Sprite(texture);

            sprite.position.set(position[0], position[1] + frameOffsetY[i]);
            sprite.visible = i === 0; // show first frame as default

            pixiApp!.stage.addChild(sprite);

            return sprite;
        });
    }

    update(now: DOMHighResTimeStamp) {
        if (this.state === 'idle' || this.nextTime > now) {
            return false;
        }

        this.sprites[this.curFrame].visible = false;

        if (this.state === 'jumping') {
            if (++this.curFrame === 3) {
                this.state = 'falling';
            }
        } else if (this.state === 'falling') {
            if (--this.curFrame === 0) {
                this.state = 'idle';
            }
        }

        this.sprites[this.curFrame].visible = true;
        this.nextTime = now + frameDuration;

        return true;
    }

    jump() {
        if (this.state === 'idle') {
            this.state = 'jumping';
        }
    }
}
