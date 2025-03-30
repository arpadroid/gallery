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

    async _onComplete() {
        super._onComplete();
        const itemCount = this.gallery?.getItemCount() || 0;
        itemCount < 2 && this.remove();
    }

    _onClick() {
        this.gallery?.pause();
        this.resource?.nextPage();
    }
}

defineCustomElement('gallery-next', GalleryNext);

export default GalleryNext;
