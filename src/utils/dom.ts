// https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
export function lockPageScroll() {
    document.body.style.top = -window.scrollY + 'px';
    document.body.style.position = 'fixed';
}

export function unlockPageScroll() {
    const scrollY = -parseInt(document.body.style.top) || 0;

    document.body.style.position = '';
    document.body.style.top = '';

    if (scrollY > 0) {
        window.scroll(0, scrollY);
    }
}
