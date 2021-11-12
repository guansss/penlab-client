let touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

document.body.addEventListener('touchstart', onTouchStart);

function onTouchStart() {
    touchSupported = true;

    document.body.removeEventListener('touchstart', onTouchStart);
}

/**
 * The check is not fully reliable until user performs an interaction!
 */
export function supportsTouch() {
    return touchSupported;
}
