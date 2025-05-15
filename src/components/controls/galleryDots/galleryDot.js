/**
 * @typedef {import('./galleryDot.types').GalleryDotConfigType} GalleryDotConfigType
 */
import { defineCustomElement, mergeObjects, renderNode } from '@arpadroid/tools';
import { PagerItem } from '@arpadroid/ui';

const html = String.raw;
class GalleryDot extends PagerItem {
    /**
     * Returns the default configuration for the gallery dot.
     * @returns {GalleryDotConfigType}
     */
    getDefaultConfig() {
        /** @type {GalleryDotConfigType} */
        const config = {
            className: 'galleryDot',
            ariaLabel: undefined,
            isActive: false,
            hasInput: false
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    appendChildren() {
        return this.getPage() ? '' : super.appendChildren();
    }

    renderSelected() {
        return renderNode(html`<span class="pagerItem__content"></span>`);
    }
}

export default GalleryDot;
defineCustomElement('gallery-dot', GalleryDot);
