import { mergeObjects } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

class GalleryPrevious extends GalleryControl {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryPrevious',
            icon: 'skip_previous',
            label: 'Previous'
        });
    }

    _onClick() {
        this.gallery.pause();
        this.resource.previousPage();
    }
}

customElements.define('gallery-previous', GalleryPrevious);

export default GalleryPrevious;
