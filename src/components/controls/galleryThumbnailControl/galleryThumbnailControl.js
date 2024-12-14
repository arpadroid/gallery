import GalleryControl from '../../galleryControl/galleryControl';

class GalleryThumbnailControl extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryThumbnailControl',
            icon: 'view_carousel',
            label: 'Thumbnail control',
            labelPosition: 'bottom'
        };
    }
}

customElements.define('gallery-thumbnail-control', GalleryThumbnailControl);

export default GalleryThumbnailControl;
