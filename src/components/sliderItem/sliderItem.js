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
            imageSize: 'full_screen'
            // contentOverlay: true,
            // contentPosition: 'right'
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    /**
     * Returns the template for the list item.
     * @returns {string}
     */
    _getTemplate() {
        if (this.getProperty('content-overlay') && !this.hasAttribute('content-overlay')) {
            this.setAttribute('content-overlay', '');
        }
        if (this.getProperty('content-position') && !this.hasAttribute('content-position')) {
            this.setAttribute('content-position', this.getProperty('content-position'));
        }
        return html`<{wrapperComponent} {wrapperAttributes}>
            {image}
            <div class="sliderItem__content">
                {titleContainer}{children}{caption} 
            </div>
        </{wrapperComponent}>`;
    }
}

defineCustomElement('slider-item', SliderItem);

export default SliderItem;
