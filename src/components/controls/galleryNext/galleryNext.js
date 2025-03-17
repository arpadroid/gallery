import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

class GalleryNext extends GalleryControl {
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.next';
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryNext',
            icon: 'skip_next',
            label: this.i18n('lblNext'),
            labelText: this.i18nText('lblNext')
        });
    }

    _onClick() {
        this.gallery?.pause();
        this.resource?.nextPage();
    }
}

defineCustomElement('gallery-next', GalleryNext);

export default GalleryNext;
