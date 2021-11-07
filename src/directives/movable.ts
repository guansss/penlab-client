import { App } from 'vue';
import { logger } from '../utils/logger';

/**
 * @example
 *
 * // value provides the class name of drag handle, if omitted, it'll be the bound element itself.
 * v-movable="className"
 */
export function movable(app: App) {
    app.directive('movable', {
        mounted(el: HTMLElement, binding) {
            const movingElement = el;
            let handleElement = el;

            if (binding.value) {
                const handleTarget = el.getElementsByClassName(binding.value)[0];

                if (!handleTarget) {
                    logger.warn('v-movable', 'Could not find handle target.');
                }

                handleElement = handleTarget as HTMLElement;
            }

            // disable draggable to prevent triggering "drag" events when dragging,
            // which causes "pointermove" to never be fired
            handleElement.setAttribute('draggable', 'false');

            handleElement.addEventListener('pointerdown', onPointerDown);

            function onPointerDown(e: PointerEvent) {
                let originX = e.clientX;
                let originY = e.clientY;

                // find actual origin by existing transform
                if (movingElement.style.transform) {
                    const match = /translate\(([^p]+)px, ([^p]+)px\)/.exec(movingElement.style.transform);

                    if (match) {
                        originX -= Number(match[1]);
                        originY -= Number(match[2]);
                    }
                }

                document.addEventListener('pointermove', onPointerMove, { passive: true });
                document.addEventListener('pointerout', onPointerOut);
                document.addEventListener('pointerup', onPointerUp);

                function onPointerMove(e: PointerEvent) {
                    const translateX = e.clientX - originX;
                    const translateY = e.clientY - originY;

                    movingElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
                }

                function onPointerOut(e: PointerEvent) {
                    // end moving when cursor leaves the document
                    if (e.target === document.documentElement) {
                        onPointerUp(e);
                    }
                }

                function onPointerUp(e: PointerEvent) {
                    document.removeEventListener('pointermove', onPointerMove);
                    document.removeEventListener('pointerout', onPointerOut);
                    document.removeEventListener('pointerup', onPointerUp);
                }
            }
        },
    });
}
