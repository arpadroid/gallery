/**
 * @typedef {import('./sliderItem.types').SliderItemConfigType} SliderItemConfigType
 */
import { mergeObjects, defineCustomElement } from '@arpadroid/tools';
import GalleryItem from '../galleryItem/galleryItem';
// const html = String.raw;
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
            listSelector: 'image-slider',
            classNames: ['galleryItem', 'listItem', 'sliderItem', 'listItem--full'],
            defaultImageSize: 'full_screen',
            imageSize: 'full_screen',
            
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars()
        };
    }

    getImageAttributes() {
        return {
            ...super.getImageAttributes(),
        };
    }
}

defineCustomElement('slider-item', SliderItem);

export default SliderItem;
