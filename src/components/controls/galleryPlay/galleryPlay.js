import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryPlay extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryPlay',
            icon: 'play_arrow',
            label: 'Play',
            labelPosition: 'bottom'
        };
    }
}

customElements.define('gallery-play', GalleryPlay);

export default GalleryPlay;
