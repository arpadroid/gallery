import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

class GalleryNext extends GalleryControl {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryNext',
            icon: 'skip_next',
            label: 'Next'
        });
    }

    _onClick() {
        this.gallery?.pause();
        this.resource?.nextPage();
    }
}

defineCustomElement('gallery-next', GalleryNext);

export default GalleryNext;
