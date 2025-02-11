/**
 * @typedef {import('./galleryDarkMode.types').GalleryDarkModeConfigType} GalleryDarkModeConfigType
 */
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
            this.button?.setIcon(this.getProperty('icon-light'));
            this.button?.setLabel(this.getProperty('label-light'));
        } else {
            styleNode && (styleNode.disabled = true);
            this.button?.setIcon(this.getProperty('icon'));
            this.button?.setLabel(this.getProperty('label'));
        }
    }
}

customElements.define('gallery-dark-mode', GalleryDarkMode);

export default GalleryDarkMode;
