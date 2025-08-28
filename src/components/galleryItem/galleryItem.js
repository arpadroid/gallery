/**
 * @typedef {import('./galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 */
import { ListItem } from '@arpadroid/lists';
import { classNames, mergeObjects, defineCustomElement, attrString } from '@arpadroid/tools';
const html = String.raw;
class GalleryItem extends ListItem {
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
            classNames: ['galleryItem'],
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
    _getTemplate() {
        return html`<{wrapperComponent} {wrapperAttributes}>
            <div class="galleryItem__contentWrapper">{titleContainer}{children}{image}</div>
            {caption} 
        </{wrapperComponent}>`;
    }

    /**
     * Returns the attributes for the list item wrapper.
     * @returns {Record<string, any>}
     */
    getWrapperAttrs() {
        return {
            href: this.link,
            class: classNames('galleryItem__main', { listItem__link: this.link })
        };
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            caption: this.renderCaption()
        };
    }

    getCaption() {
        return this.getProperty('caption');
    }

    /**
     * Handles a lost zone.
     * @param {import('@arpadroid/ui').ZoneToolPlaceZoneType} event - The event object.
     * @returns {boolean | undefined} Whether the zone was handled.
     */
    _onLostZone({ zone, zoneName }) {
        if (zoneName === 'caption') {
            this.promise.then(() => zone && this.captionNode?.append(...zone.childNodes));
            return true;
        }
    }

    renderCaption(hasContent = this.hasContent('caption')) {
        if (!hasContent) return '';
        const attr = {
            class: 'galleryItem__caption',
            zone: 'caption',
            maxLength: this.getProperty('truncate-caption') ?? 200
        };
        return html`<truncate-text ${attrString(attr)}>${this.getCaption() || ''}</truncate-text>`;
    }

    async _initializeNodes() {
        await super._initializeNodes();
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
