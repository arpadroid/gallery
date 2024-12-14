import GalleryControl from '../../galleryControl/galleryControl';

class GalleryNext extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryNext',
            icon: 'arrow_forward_ios',
            label: 'Next'
        };
    }
}

customElements.define('gallery-next', GalleryNext);

export default GalleryNext;
