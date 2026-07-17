/**
 * @typedef {import('./galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 */
import { ListManagerItem } from '@arpadroid/list-manager';
import { mergeObjects, defineCustomElement, attrString } from '@arpadroid/tools';
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
            truncateCaption: 200
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    $renderTemplate() {
        return html`<arpa-node {wrapperAttr()}>
            <div class="galleryItem__contentWrapper">{titleWrapper}{content}{image}</div>
            {caption}
        </arpa-node>`;
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            caption: this.renderCaption()
        };
    }

    getCaption() {
        return this.getProp('caption');
    }

    renderCaption(hasContent = this.hasContent('caption')) {
        if (!hasContent) return '';
        const attr = {
            class: 'galleryItem__caption',
            zone: 'caption',
            maxLength: this.getProp('truncate-caption') ?? 200
        };
        return html`<truncate-text ${attrString(attr)}>${this.getCaption() || ''}</truncate-text>`;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
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
