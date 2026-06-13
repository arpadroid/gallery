/**
 * @typedef {import('./galleryToggleControls.types').GalleryToggleControlsConfigType} GalleryToggleControlsConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryToggleControls extends GalleryControl {
    //////////////////////////////
    // #region Initialization
    //////////////////////////////
    /**
     * Returns the default configuration for the gallery toggle controls.
     * @returns {GalleryToggleControlsConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.toggleControls';
        this.isActive = false;
        return {
            className: 'galleryToggleControls',
            icon: 'keyboard_double_arrow_down',
            openIcon: 'keyboard_double_arrow_up',
            label: '{i18n:lblHideControls}',
            openLabel: '{i18n:lblShowControls}'
        };
    }

    // #endregion Initialization

    //////////////////////////////
    // #region Event Handlers
    //////////////////////////////

    // #endregion Actions

    //////////////////////////////
    // #region Event Callbacks
    //////////////////////////////

    _onClick() {
        this.gallery?.toggleControls();
        if (this.gallery?.isControlsHidden()) {
            this.buttonComponent?.setProp('icon', this.getProp('openIcon'));
            this.buttonComponent?.setProp('tooltip', this.getProp('openLabel'));
        } else {
            this.buttonComponent?.setProp('icon', this.getProp('icon'));
            this.buttonComponent?.setProp('tooltip', this.getProp('label'));
        }
    }

    async $onComplete() {
        super.$onComplete();
        await this?.gallery?.promise;
        await customElements.whenDefined('arpa-gallery');
    }

    // #endregion Events
}

defineCustomElement('gallery-toggle-controls', GalleryToggleControls);

export default GalleryToggleControls;
