const TITLE_SUFFIX = 'Pencil\'s Lab';

export function setPageTitle(title) {
    document.title = title ? title + ' - ' + TITLE_SUFFIX : TITLE_SUFFIX;
}
