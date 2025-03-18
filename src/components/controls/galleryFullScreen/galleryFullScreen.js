import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

class GalleryFullScreen extends GalleryControl {
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.fullScreen';
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryFullScreen',
            icon: 'fullscreen',
            label: this.i18n('lblEnterFullScreen'),
            labelText: this.i18nText('lblToggleFullScreen')
        });
    }

    _initialize() {
        this.bind('_onFullScreenChange');
        super._initialize();
        document.addEventListener('fullscreenchange', this._onFullScreenChange);
    }

    _onFullScreenChange() {
        if (!document.fullscreenElement) {
            this.onExit();
            this.gallery && (this.gallery.isFullScreen = false);
        }
    }

    _onClick() {
        const isFullScreen = this.gallery?.toggleFullScreen();
        isFullScreen ? this.onEnter() : this.onExit();
    }

    onExit() {
        this.button?.setLabel(this.i18n('lblEnterFullScreen'));
    }

    onEnter() {
        this.button?.setLabel(this.i18n('lblExitFullScreen'));
    }

    _onDestroy() {
        super._onDestroy();
        document.removeEventListener('fullscreenchange', this._onFullScreenChange);
    }
}

defineCustomElement('gallery-full-screen', GalleryFullScreen);

export default GalleryFullScreen;
