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
        this.button?.setIcon('pause');
        const pauseLabel = this.getProperty('label-pause');
        this.button?.setLabel(pauseLabel);
    }

    /**
     * Handles the pause event.
     */
    _onPause() {
        this.button?.setIcon('play_arrow');
        const playLabel = this.getProperty('label');
        this.button?.setLabel(playLabel);
    }
}

defineCustomElement('gallery-play', GalleryPlay);

export default GalleryPlay;
