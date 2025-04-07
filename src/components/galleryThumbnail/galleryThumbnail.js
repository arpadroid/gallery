/**
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./galleryThumbnail.types').GalleryThumbnailConfigType} GalleryThumbnailConfigType
 * @typedef {import('../galleryThumbnails/galleryThumbnails.js').default} GalleryThumbnails
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 */

import { ListItem } from '@arpadroid/lists';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class GalleryThumbnail extends ListItem {
    _preInitialize() {
        super._preInitialize();
        /** @type {Gallery | null} */
        this.gallery = this.closest('.gallery');
        /** @type {ListResource} */
        this.galleryResource = this.gallery?.listResource;
        this.resourceItem = this.getGalleryItem();
        /** @type {GalleryItem} */
        this.itemNode = this.resourceItem?.node;
        this.itemThumbnail = this.getItemThumbnail();
        this.itemThumbnail && this.setAttribute('image', this.itemThumbnail);
    }

    /**
     * Returns the default config.
     * @returns {GalleryThumbnailConfigType}
     */
    getDefaultConfig() {
        this.bind('_onClick');

        return /** @type {GalleryThumbnailConfigType} */ (
            mergeObjects(super.getDefaultConfig(), {
                className: 'galleryThumbnail',
                lazyLoadImage: true,
                hasNativeLazy: false,
                image: this.itemThumbnail,
                action: this._onClick
            })
        );
    }

    getItemThumbnail() {
        return this.itemNode?.getProperty('thumbnail') || this.itemNode?.getProperty('image');
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    _getTemplate() {
        return html`
                <{wrapperComponent} {wrapperAttributes}>
                    {image}
                </{wrapperComponent}>
                {rhs}
            `;
        // <arpa-tooltip class="tooltip--contained" text="${this.title}" position="right"></arpa-tooltip>
    }

    getGalleryItem() {
        const itemId = this.getProperty('item-id');
        return this.galleryResource?.getItem(itemId);
    }

    getImageAttributes() {
        const attr = super.getImageAttributes();
        attr.hasThumbnail = 'false';
        attr.lazyLoaderBatchSize = 2;
        attr.hasPreloader = 'false';
        return attr;
    }

    _onClick() {
        this.gallery?.pause();
        const index = this.resourceItem ? (this.galleryResource?.getItemIndex(this.resourceItem) || 0) + 1 : 0;
        this.galleryResource?.goToPage(index);
    }
}

defineCustomElement('gallery-thumbnail', GalleryThumbnail);

export default GalleryThumbnail;
