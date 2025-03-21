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
            label: this.i18n('lblShowCaptions'),
            labelText: this.i18nText('lblShowCaptions'),
            labelOff: this.i18n('lblHideCaptions')
        };
    }

    hasCaptions() {
        return this.gallery?.classList.contains('gallery--captions-on');
    }

    _onConnected() {
        this.updateCaptions(true);
    }

    updateCaptions(on = this.hasCaptions()) {
        if (!on) {
            this.gallery?.classList.remove('gallery--captions-on');
            this.buttonComponent?.setIcon(this.getProperty('icon-off'));
            this.buttonComponent?.setTooltip(this.getProperty('label-off'));
        } else {
            this.gallery?.classList.add('gallery--captions-on');
            this.buttonComponent?.setIcon(this.getProperty('icon'));
            this.buttonComponent?.setTooltip(this.getProperty('label'));
        }
    }

    _onClick() {
        this.updateCaptions(!this.hasCaptions());
    }
}

defineCustomElement('gallery-toggle-captions', GalleryToggleCaptions);

export default GalleryToggleCaptions;
