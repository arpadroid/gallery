/**
 * @typedef {import('./galleryToggleControls.types').GalleryToggleControlsConfigType} GalleryToggleControlsConfigType
 */
import { defineCustomElement, listen } from '@arpadroid/tools';
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
        this.bind('_handleActivity');
        this.i18nKey = 'gallery.controls.toggleControls';
        this.isActive = false;
        return {
            className: 'galleryToggleControls',
            icon: 'keyboard_double_arrow_down',
            openIcon: 'keyboard_double_arrow_up',
            label: this.i18n('lblHideControls'),
            labelText: this.i18nText('lblToggleControls'),
            openLabel: this.i18n('lblShowControls')
        };
    }

    // #endregion Initialization

    //////////////////////////////
    // #region Accessors
    //////////////////////////////

    getActiveClass() {
        return this.gallery?.getProperty('active-class');
    }

    isControlsHidden() {
        const _class = this.getControlsHiddenClass();
        return this.gallery?.classList.contains(_class);
    }

    getControlsHiddenClass() {
        return this.gallery?.getProperty('controls-hidden-class') || 'gallery--hide-controls';
    }

    toggleControls() {
        this.isControlsHidden() ? this.showControls() : this.hideControls();
    }

    hideControls() {
        this.gallery?.classList.add(this.getControlsHiddenClass());
        requestAnimationFrame(() => {
            this.gallery?.classList.remove(this.getActiveClass());
        });
    }

    showControls() {
        this.gallery?.classList.remove(this.getControlsHiddenClass());
    }

    // #endregion Accessors

    //////////////////////////////
    // #region Event Handlers
    //////////////////////////////

    manageActiveState() {
        this.gallery && listen(this.gallery, ['mouseleave', 'click'], this._handleActivity);
    }

    // #endregion Actions

    //////////////////////////////
    // #region Event Callbacks
    //////////////////////////////

    _handleActivity() {
        const activeClass = this.getActiveClass();
        clearTimeout(this.activeTimeout);
        this.isActive = true;
        const activityTimeout = this.getProperty('activity-timeout') || 3000;
        if (!this.gallery?.classList.contains(activeClass)) {
            this.gallery?.classList.add(activeClass);
        }
        this.activeTimeout = setTimeout(() => {
            this.isActive = false;
            this.gallery?.classList.remove(activeClass);
        }, activityTimeout);
    }

    _onClick() {
        this.toggleControls();
        if (this.isControlsHidden()) {
            this.buttonComponent?.setIcon(this.getProperty('open-icon'));
            this.buttonComponent?.setTooltip(this.i18n('open-label'));
        } else {
            this.buttonComponent?.setIcon(this.getProperty('icon'));
            this.buttonComponent?.setTooltip(this.i18n('lblHideControls'));
        }
    }

    async _onComplete() {
        super._onComplete();
        await this?.gallery?.promise;
        await customElements.whenDefined('arpa-gallery');
        this.manageActiveState();
    }

    // #endregion Events
}

defineCustomElement('gallery-toggle-controls', GalleryToggleControls);

export default GalleryToggleControls;
