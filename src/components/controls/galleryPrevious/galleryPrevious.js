import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
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
        this.gallery?.pause();
        this.resource?.previousPage();
    }
}

defineCustomElement('gallery-previous', GalleryPrevious);

export default GalleryPrevious;
