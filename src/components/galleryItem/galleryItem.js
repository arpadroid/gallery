/**
 * @typedef {import('./galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 */
import { ListItem } from '@arpadroid/lists';
import { classNames, mergeObjects, attrString, defineCustomElement } from '@arpadroid/tools';
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
        return mergeObjects(super.getDefaultConfig(), {
            imageSize: 'adaptive',
            titleTag: 'h2'
        });
    }

    /**
     * Returns the template for the list item.
     * @param {boolean} isGrid - Indicates whether the list item is in grid view.
     * @param {string} link - The link for the list item.
     * @returns {string}
     */
    getTemplate(isGrid = this.isGrid, link = this.link) {
        const attrs = attrString({
            href: link,
            class: classNames('galleryItem__main', { listItem__link: link })
        });
        const wrapperComponent = this.link ? 'a' : this.getWrapperComponent();
        const innerContent = this.renderInnerContent(isGrid) || this.hasZone('content');
        const hasInnerContent = typeof innerContent === 'string' && innerContent?.trim()?.length;
        const innerHTML = hasInnerContent ? html`<div class="galleryItem__contentWrapper">${innerContent}</div>` : '';
        return html`<${wrapperComponent} ${attrs}>${innerHTML}{caption}</${wrapperComponent}>`;
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
        return html`<div class="galleryItem__caption" zone="caption">${this.getCaption()}</div>`;
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
