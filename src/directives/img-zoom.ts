import { App } from 'vue';
import { emitter } from '../event';

export function imgZoom(app: App) {
    app.directive('img-zoom', (el: HTMLElement, binding) => {
        const imgs = el.getElementsByTagName('img');

        for (const img of imgs as any as HTMLImageElement[]) {
            if (!binding.value || img.classList.contains(binding.value)) {
                img.classList.add('zoomable');
            }
        }

        el.addEventListener('click', handleClick);
    });
}

function handleClick(event: MouseEvent) {
    if (
        !(
            (event.target as HTMLElement).tagName === 'IMG' &&
            (event.target as HTMLImageElement).classList.contains('zoomable')
        )
    ) {
        return;
    }

    emitter.emit('imgZoom', {
        img: event.target as HTMLImageElement,
    });
}
