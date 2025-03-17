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
            titleTag: 'h2',
            listSelector: 'arpa-gallery',
            truncateCaption: 200
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Returns the template for the list item.
     * @param {boolean} isGrid - Indicates whether the list item is in grid view.
     * @returns {string}
     */
    getTemplate(isGrid = this.isGrid) {
        const innerContent = this.renderInnerContent(isGrid);
        const hasInnerContent = this.hasZone('content') || innerContent?.trim()?.length;
        const content = hasInnerContent ? html`<div class="galleryItem__contentWrapper">${innerContent}</div>` : '';
        return html`<{wrapperComponent} {wrapperAttributes}>${content}{caption}</{wrapperComponent}>`;
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

    renderCaption() {
        if (!this.hasContent('caption')) return '';
        const attr = {
            class: 'galleryItem__caption',
            zone: 'caption',
            maxLength: this.getProperty('truncate-caption') || 200,
        };
        return html`<truncate-text ${attrString(attr)} has-button>${this.getCaption()}</truncate-text>`;
    }

    /**
     * Returns the inner content for the list item.
     * @param {boolean} _isGrid
     * @returns {string}
     */
    renderInnerContent(_isGrid = this.isGrid) {
        const image = this.renderImage();
        const titleContainer = this.renderTitleContainer();
        return html`${titleContainer}${image}${this.renderContent()}`;
    }

    getImageAttributes() {
        return {
            ...super.getImageAttributes(),
            preventUpscale: true
        };
    }
}

defineCustomElement('gallery-item', GalleryItem);

export default GalleryItem;
