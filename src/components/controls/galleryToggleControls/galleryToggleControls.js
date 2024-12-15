import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryToggleControls extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryToggleControls',
            icon: 'keyboard_double_arrow_down',
            openIcon: 'keyboard_double_arrow_up',
            label: 'Toggle controls'
        };
    }

    _onClick() {
        this.gallery.toggleControls();
        if (this.gallery.isControlsHidden()) {
            this.button?.setIcon(this.getProperty('open-icon'));
        } else {
            this.button?.setIcon(this.getProperty('icon'));
        }
    }
}

customElements.define('gallery-toggle-controls', GalleryToggleControls);

export default GalleryToggleControls;
