/**
 * @typedef {import('./sliderItem.types').SliderItemConfigType} SliderItemConfigType
 */
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import GalleryItem from '../galleryItem/galleryItem';
const html = String.raw;
class SliderItem extends GalleryItem {
    /** @type {SliderItemConfigType} */
    _config = this._config;

    /**
     * Returns the default configuration for the list item.
     * @returns {SliderItemConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {SliderItemConfigType} */
        const config = {
            truncateCaption: '0',
            listSelector: 'image-slider',
            classNames: ['galleryItem', 'listItem', 'sliderItem', 'listItem--full'],
            defaultImageSize: 'full_screen',
            imageSize: 'full_screen',
            contentOverlay: true,
            defaultContentPosition: 'bottom',
            defaultContentOverlay: false
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    _getTemplate() {
        this.getContentOverlay() && this.setAttribute('content-overlay', '');
        const contentPosition = this.getContentPosition();
        contentPosition && this.setAttribute('content-position', contentPosition);
        return html`<{wrapperComponent} {wrapperAttributes}>
            {image}
            <div class="sliderItem__content">
                {titleContainer}{children}{caption} 
            </div>
        </{wrapperComponent}>`;
    }

    getContentOverlay() {
        return (
            this.payload?.contentOverlay ||
            this.getProperty('content-overlay') ||
            this.list?.getProperty('content-overlay') ||
            this.getProperty('default-content-overlay')
        );
    }

    getContentPosition() {
        return (
            this.payload?.contentPosition ||
            this.getProperty('content-position') ||
            this.list?.getProperty('content-position') ||
            this.getProperty('default-content-position')
        );
    }
}

defineCustomElement('slider-item', SliderItem);

export default SliderItem;
