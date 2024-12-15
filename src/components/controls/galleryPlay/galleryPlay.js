import GalleryControl from '../../galleryControl/galleryControl.js';

class GalleryPlay extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryPlay',
            icon: 'play_arrow',
            iconPause: 'pause',
            label: 'Play',
            labelPosition: 'bottom',
            playInterval: this.gallery?.getProperty('play-interval') || 5000
        };
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
        this.button.setIcon('pause');
    }

    _onPause() {
        this.button.setIcon('play_arrow');
    }
}

customElements.define('gallery-play', GalleryPlay);

export default GalleryPlay;
