import GalleryControl from '../../galleryControl/galleryControl';

class GalleryPrevious extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryPrevious',
            icon: 'arrow_back_ios',
            label: 'Previous'
        };
    }
}

customElements.define('gallery-previous', GalleryPrevious);

export default GalleryPrevious;
