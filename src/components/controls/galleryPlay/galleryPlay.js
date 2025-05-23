/**
 * @typedef {import('./galleryPlay.types').GalleryPlayConfigType} GalleryPlayConfigType
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryPlay extends GalleryControl {
    /** @type {GalleryPlayConfigType} */
    _config = this._config;
    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryPlayConfigType} The default configuration.
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.play';
        /** @type {GalleryPlayConfigType} */
        const config = {
            className: 'galleryPlay',
            icon: 'play_arrow',
            iconPause: 'pause',
            label: this.i18n('lblPlay'),
            labelText: this.i18nText('lblPlay'),
            labelPause: this.i18n('lblPause'),
            labelPosition: 'bottom',
            playInterval: this.gallery?.getProperty('play-interval') || 5000
        };
        return config;
    }

    _initialize() {
        this.bind('_onPlay', '_onPause');
        super._initialize();
        this.gallery?.on('play', this._onPlay);
        this.gallery?.on('pause', this._onPause);
    }

    _onClick() {
        this.gallery?.isPlaying ? this.gallery?.pause() : this.gallery?.play();
    }

    _onPlay() {
        this.buttonComponent?.setIcon('pause');
        const pauseLabel = this.getProperty('label-pause');
        this.buttonComponent?.setTooltip(pauseLabel);
    }

    /**
     * Handles the pause event.
     */
    _onPause() {
        this.buttonComponent?.setIcon('play_arrow');
        const playLabel = this.getProperty('label');
        this.buttonComponent?.setTooltip(playLabel);
    }

    async _onComplete() {
        super._onComplete();
        const itemCount = this.gallery?.getItemCount() || 0;
        itemCount < 2 && this.remove();
    }
}

defineCustomElement('gallery-play', GalleryPlay);

export default GalleryPlay;
