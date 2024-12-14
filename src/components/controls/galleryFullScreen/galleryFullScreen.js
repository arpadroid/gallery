import GalleryControl from '../../galleryControl/galleryControl';

class GalleryFullScreen extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryFullScreen',
            icon: 'fullscreen',
            label: 'Full screen'
        };
    }
}

customElements.define('gallery-full-screen', GalleryFullScreen);

export default GalleryFullScreen;
