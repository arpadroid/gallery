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
            labelPause: this.i18n('lblPause'),
            labelPosition: 'bottom',
            playInterval: this.gallery?.getProp('play-interval') || 5000
        };
        return config;
    }

    $initialize() {
        this.bind('_onPlay', '_onPause');
        super.$initialize();
        this.gallery?.on('play', this._onPlay);
        this.gallery?.on('pause', this._onPause);
    }

    _onClick() {
        this.gallery?.isPlaying ? this.gallery?.pause() : this.gallery?.play();
    }

    _onPlay() {
        this.buttonComponent?.setProp('icon', this.getProp('icon-pause'));
        const pauseLabel = this.getProp('label-pause');
        this.buttonComponent?.setProp('tooltip', pauseLabel);
    }

    /**
     * Handles the pause event.
     */
    _onPause() {
        this.buttonComponent?.setProp('icon', this.getProp('icon'));
        const playLabel = this.getProp('label');
        this.buttonComponent?.setProp('tooltip', playLabel);
    }

    async $onComplete() {
        super.$onComplete();
        const itemCount = this.gallery?.getItemCount() || 0;
        itemCount < 2 && this.remove();
    }
}

defineCustomElement('gallery-play', GalleryPlay);

export default GalleryPlay;
