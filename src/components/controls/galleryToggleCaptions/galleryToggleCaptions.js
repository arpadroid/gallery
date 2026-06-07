/**
 * @typedef {import('./galleryToggleCaptions.types').GalleryToggleCaptionsConfigType} GalleryToggleCaptionsConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryToggleCaptions extends GalleryControl {
    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryToggleCaptionsConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.toggleCaptions';
        return {
            icon: 'subtitles',
            iconOff: 'subtitles_off',
            label: this.i18nText('lblShowCaptions'),
            labelOff: this.i18n('lblHideCaptions')
        };
    }

    hasCaptions() {
        return this.gallery?.classList.contains('gallery--captions-on');
    }

    $onConnected() {
        this.updateCaptions(true);
    }

    updateCaptions(on = this.hasCaptions()) {
        if (!on) {
            this.gallery?.classList.remove('gallery--captions-on');
            this.buttonComponent?.setIcon(this.getProp('icon-off'));
            this.buttonComponent?.setTooltip(this.getProp('label-off'));
        } else {
            this.gallery?.classList.add('gallery--captions-on');
            this.buttonComponent?.setIcon(this.getProp('icon'));
            this.buttonComponent?.setTooltip(this.getProp('label'));
        }
    }

    _onClick() {
        this.updateCaptions(!this.hasCaptions());
    }
}

defineCustomElement('gallery-toggle-captions', GalleryToggleCaptions);

export default GalleryToggleCaptions;
