/**
 * @typedef {import('./imageSlider.types.js').ImageSliderConfigType} ImageSliderConfigType
 * @typedef {import('../galleryItem/galleryItem').default} GalleryItem
 * @typedef {import('@arpadroid/tools').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 */
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import Gallery from '../gallery/gallery.js';
import SliderItem from '../sliderItem/sliderItem.js';

// const html = String.raw;
class ImageSlider extends Gallery {
    /**
     * Returns the default configuration for the image slider.
     * @returns {ImageSliderConfigType}
     */
    getDefaultConfig() {
        /** @type {ImageSliderConfigType} */
        const config = {
            classNames: ['imageSlider'],
            listSelector: 'image-slider',
            itemTag: 'slider-item',
            tagName: 'image-slider',
            itemComponent: SliderItem,
            controls: ['play', 'dots', 'spacer', 'fullScreen', 'drag']
        };
        return mergeObjects(super.getDefaultConfig(), config);
    }
}

defineCustomElement('image-slider', ImageSlider);
export default ImageSlider;
