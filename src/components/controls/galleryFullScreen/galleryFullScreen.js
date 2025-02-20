import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

class GalleryFullScreen extends GalleryControl {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryFullScreen',
            icon: 'fullscreen',
            label: 'Full screen'
        });
    }

    _onClick() {
        this.gallery?.toggleFullScreen();
    }
}

defineCustomElement('gallery-full-screen', GalleryFullScreen);

export default GalleryFullScreen;
