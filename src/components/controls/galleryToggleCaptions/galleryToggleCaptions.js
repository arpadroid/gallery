/**
 * @typedef {import('./galleryToggleCaptions.types').GalleryToggleCaptionsConfigType} GalleryToggleCaptionsConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryToggleCaptions extends GalleryControl {
    /** @type {GalleryToggleCaptionsConfigType} */
    _config = this._config;
    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryToggleCaptionsConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.toggleCaptions';
        return {
            icon: 'subtitles',
            iconOff: 'subtitles_off',
            label: '{i18n:lblShowCaptions}',
            labelOff: '{i18n:lblHideCaptions}',
            toggleClass: 'gallery--captions-on',
            enabled: false
        };
    }

    hasCaptions() {
        return this.gallery?.classList.contains('gallery--captions-on');
    }

    async $onComplete() {
        const { enabled = false } = this._config || {};
        this.updateCaptions(enabled, true);
    }

    updateCaptions(on = this.hasCaptions(), isInitial = false) {
        if (!on) {
            this.gallery?.classList.remove(this.getProp('toggleClass'));
            this.buttonComponent?.setIcon(this.getProp('icon'));
            !isInitial && this.buttonComponent?.setTooltip(this.getProp('label'));
        } else {
            this.gallery?.classList.add(this.getProp('toggleClass'));
            this.buttonComponent?.setIcon(this.getProp('icon'));
            !isInitial && this.buttonComponent?.setTooltip(this.getProp('labelOff'));
        }
    }

    _onClick() {
        this.updateCaptions(!this.hasCaptions());
    }
}

defineCustomElement('gallery-toggle-captions', GalleryToggleCaptions);

export default GalleryToggleCaptions;
