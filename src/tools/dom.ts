const TITLE_SUFFIX = "Pencil's Lab";

export function setPageTitle(title: string) {
    document.title = title ? title + ' - ' + TITLE_SUFFIX : TITLE_SUFFIX;
}
