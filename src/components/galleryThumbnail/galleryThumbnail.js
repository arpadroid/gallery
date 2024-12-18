/**
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./galleryThumbnailInterface.js').GalleryThumbnailInterface} GalleryThumbnailInterface
 * @typedef {import('../galleryThumbnails/galleryThumbnails.js').default} GalleryThumbnails
 */

import { ListItem } from '@arpadroid/lists';
import { mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class GalleryThumbnail extends ListItem {
    /**
     * Returns the default config.
     * @returns {GalleryThumbnailInterface}
     */
    getDefaultConfig() {
        this.bind('_onClick');
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryThumbnail',
            lazyLoadImage: true,
            hasNativeLazy: false,
            action: this._onClick
        });
    }

    _onConnected() {
        super._onConnected();
        this.gallery = this.closest('arpa-gallery, .gallery');
        /** @type {ListResource} */
        this.galleryResource = this.gallery?.listResource;
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    getTemplate() {
        const wrapperComponent = this.getWrapperComponent();
        return html`
                <${wrapperComponent} ${this.getWrapperAttrs()}>
                    {image}
                </${wrapperComponent}>
                ${this.renderRhs()}
            `;
        // <arpa-tooltip class="tooltip--contained" text="${this.title}" position="right"></arpa-tooltip>
    }

    getImageAttributes() {
        const attr = super.getImageAttributes();
        attr.hasThumbnail = 'false';
        attr.lazyLoaderBatchSize = 2;
        attr.hasPreloader = 'false';
        return attr;
    }

    _onClick() {
        const itemId = this.getProperty('item-id');
        const item = this.galleryResource?.getItem(itemId);
        const index = this.galleryResource?.getItemIndex(item) + 1;
        this.galleryResource.goToPage(index);
    }
}

customElements.define('gallery-thumbnail', GalleryThumbnail);

export default GalleryThumbnail;
