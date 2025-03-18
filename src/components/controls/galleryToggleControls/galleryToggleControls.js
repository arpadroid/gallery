/**
 * @typedef {import('./galleryToggleControls.types').GalleryToggleControlsConfigType} GalleryToggleControlsConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryToggleControls extends GalleryControl {
    /**
     * Returns the default configuration for the gallery toggle controls.
     * @returns {GalleryToggleControlsConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.toggleControls';
        return {
            className: 'galleryToggleControls',
            icon: 'keyboard_double_arrow_down',
            openIcon: 'keyboard_double_arrow_up',
            label: this.i18n('lblHideControls'),
            labelText: this.i18nText('lblToggleControls'),
            openLabel: this.i18n('lblShowControls')
        };
    }

    _onClick() {
        this.gallery?.toggleControls();
        if (this.gallery?.isControlsHidden()) {
            this.button?.setIcon(this.getProperty('open-icon'));
            this.button?.setLabel(this.i18n('open-label'));
        } else {
            this.button?.setIcon(this.getProperty('icon'));
            this.button?.setLabel(this.i18n('lblHideControls'));
        }
    }
}

defineCustomElement('gallery-toggle-controls', GalleryToggleControls);

export default GalleryToggleControls;
