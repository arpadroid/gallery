/**
 * @typedef {import('./galleryDarkMode.types').GalleryDarkModeConfigType} GalleryDarkModeConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryDarkMode extends GalleryControl {
    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryDarkModeConfigType} The default configuration.
     */
    getDefaultConfig() {
        return {
            className: 'galleryDarkMode',
            icon: 'dark_mode',
            iconLight: 'light_mode',
            label: 'Dark mode',
            labelLight: 'Light mode'
        };
    }

    _onClick() {
        const styleNode = /** @type {HTMLLinkElement | null} */ (document.getElementById('dark-styles'));
        if (styleNode?.disabled) {
            styleNode.removeAttribute('disabled');
            this.buttonComponent?.setIcon(this.getProperty('icon-light'));
            this.buttonComponent?.setTooltip(this.getProperty('label-light'));
        } else {
            styleNode && (styleNode.disabled = true);
            this.buttonComponent?.setIcon(this.getProperty('icon'));
            this.buttonComponent?.setTooltip(this.getProperty('label'));
        }
    }
}

defineCustomElement('gallery-dark-mode', GalleryDarkMode);

export default GalleryDarkMode;
