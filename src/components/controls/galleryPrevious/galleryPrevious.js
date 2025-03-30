import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

class GalleryPrevious extends GalleryControl {
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.previous';
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryPrevious',
            icon: 'skip_previous',
            label: this.i18n('lblPrevious'),
            labelText: this.i18nText('lblPrevious')
        });
    }

    _onClick() {
        this.gallery?.pause();
        this.resource?.previousPage();
    }

    async _onComplete() {
        super._onComplete();
        const itemCount = this.gallery?.getItemCount() || 0;
        itemCount < 2 && this.remove();
    }
}

defineCustomElement('gallery-previous', GalleryPrevious);

export default GalleryPrevious;
