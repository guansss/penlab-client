import { Router } from 'vue-router';
import { equalsWithoutHash } from './url';

const enabled = location.origin === import.meta.env.VITE_SERVER;

if (!enabled || !window.gtag) {
    window.gtag = () => {};
}

export function mountGtag(router: Router) {
    router.afterEach((to, from, failure) => {
        // do not track when only the hash has changed
        if (!failure && !equalsWithoutHash(to, from)) {
            gtag('event', 'page_view', {
                page_title: to.name,
                page_location: location.href,
                page_path: to.path,
            });
        }
    });
}

export function sendLoadTime() {
    gtag('event', 'timing_complete', {
        name: 'load',
        value: Math.round(performance.now()),
        event_category: 'JS Dependencies',
    });
}

export function sendRevealLogo() {
    gtag('event', 'reveal_logo', {
        event_category: 'interaction',
        value: 1,
    });
}
