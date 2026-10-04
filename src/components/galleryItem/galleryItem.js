/**
 * @typedef {import('./galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 */
import { ListManagerItem } from '@arpadroid/list-manager';
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
const html = String.raw;
class GalleryItem extends ListManagerItem {
    /** @type {GalleryItemConfigType} */
    _config = this._config;
    isGrid = false;
    /**
     * Returns the default configuration for the list item.
     * @returns {GalleryItemConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {GalleryItemConfigType} */
        const config = {
            imageSize: 'adaptive',
            className: 'galleryItem',
            titleTag: 'h2',
            listSelector: '.gallery',
            truncateCaption: 'false'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    async hasCaption() {
        return Boolean(this.getProp('caption') || this.hasProp('hasCaption'));
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    $renderTemplate() {
        return html`<arpa-node {wrapperAttr()}>
            <div class="galleryItem__contentWrapper">{titleWrapper}{content}{image}</div>
            <arpa-node tag="truncate-text" name="caption" max-length="{truncateCaption}" defer="hasCaption">
            </arpa-node>
        </arpa-node>`;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.onNodesReady();
        this.captionNode = this.querySelector('.galleryItem__caption');
        return true;
    }

    getImageAttributes() {
        return {
            ...super.getImageAttributes(),
            preventUpscale: true,
            isDraggable: 'false'
        };
    }
}

defineCustomElement('gallery-item', GalleryItem);

export default GalleryItem;
