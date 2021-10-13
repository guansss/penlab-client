import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import kotlin from 'highlight.js/lib/languages/kotlin';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import marked, { Renderer, RendererThis } from 'marked';
import { logger } from '../utils/logger';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('kotlin', kotlin);

export function parseMarkdown(raw: string) {
    return marked(raw);
}

class CustomRenderer extends Renderer {
    constructor() {
        super();

        this.options.headerIds = true;
        this.options.highlight = this.highlight;
    }

    highlight(code: string, lang: string, callback?: (error: any | undefined, code?: string) => void): string | void {
        let result;

        try {
            if (lang && hljs.getLanguage(lang)) {
                result = hljs.highlight(code, {
                    language: lang,
                    ignoreIllegals: false,
                }).value;
            } else {
                result = hljs.highlightAuto(code).value;
            }
        } catch (e) {
            logger.warn('Highlighting failed.', e);

            result = code;
        }

        return result;
    }

    /**
     * Overwrite output anchors, finding the external links and make them open in new tab.
     */
    override link(this: RendererThis, href: string | null, title: string | null, text: string): string {
        const anchorHTML = super.link.call(this, href, title, text);

        try {
            const url = anchorHTML.match(/href="([^"]+)"/)?.[1];

            // check if the URL has the same origin as current website
            if (url && location.origin === new URL(url, location.href).origin) {
                return anchorHTML;
            }
        } catch (ignored) {}

        // open external links in new tab
        return anchorHTML.replace(/^<a /, '<a class="external" target="_blank" rel="noopener noreferrer"');
    }
}

marked.setOptions({ renderer: new CustomRenderer() });
