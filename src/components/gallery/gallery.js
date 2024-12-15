import { List } from '@arpadroid/lists';
import { ObserverTool, goFullScreen, exitFullScreen } from '@arpadroid/tools';

import GalleryItem from '../galleryItem/galleryItem';
const html = String.raw;
class Gallery extends List {
    _initialize() {
        this.bind('_onItemsUpdated');
        super._initialize();
        ObserverTool.mixin(this);
        this.listResource?.on('items', this._onItemsUpdated);
    }

    getDefaultConfig() {
        this.playInterval = undefined;
        return super.getDefaultConfig({
            className: 'gallery',
            controls: ['play', 'previous', 'input', 'next', 'thumbnailControl', 'fullScreen', 'views', 'toggleControls'],
            defaultView: 'full',
            hasControls: true,
            autoplay: false,
            hasItemsTransition: true,
            hasResource: true,
            imageSize: 'full_screen',
            itemComponent: GalleryItem,
            itemsPerPage: 1,
            itemTag: 'gallery-item',
            listSelector: 'arpa-gallery',
            playInterval: 5000,
            views: ['full'],
            loadingMode: 'loadNext',
            controlsHiddenClass: 'gallery--hide-controls'
        });
    }

    getLazyLoadImages() {
        return false;
    }

    _onItemsUpdated(items) {
        const loadingMode = this.getLoadingMode();
        if (loadingMode === 'loadNext') {
            const next = this.listResource.getNextItem(items[0]);
            if (next?.image) {
                const image = new Image();
                image.src = next.image;
            }
        }
    }

    getLoadingMode() {
        return this.getProperty('loading-mode');
    }

    renderControls() {
        return super.renderControls({
            tagName: 'gallery-controls',
            className: 'gallery__controls'
        });
    }

    renderFull() {
        return html`
            <div class="gallery__header">{title}</div>
            {info}
            <div class="gallery__body">
                <div class="arpaList__bodyMain">{heading}{items}{preloader}</div>
                {aside}
            </div>
            {controls}
        `;
    }

    getPlayInterval() {
        return this.getProperty('play-interval');
    }

    _onConnected() {
        super._onConnected();
        this.getProperty('autoplay') && this.play();
    }

    play() {
        const playInterval = this.getPlayInterval();
        if (this.playTimeout) {
            clearTimeout(this.playTimeout);
        }
        if (this.listResource.getTotalItems() < 2) {
            return;
        }

        const nextPage = () => {
            if (this.isPlaying) {
                this.listResource.nextPage();
                this.playTimeout = setTimeout(nextPage, playInterval);
            }
        };

        if (playInterval) {
            this.isPlaying = true;
            nextPage();
            this.signal('play');
        }
    }

    pause() {
        if (this.isPlaying) {
            clearTimeout(this.playTimeout);
            this.playTimeout = undefined;
            this.isPlaying = false;
            this.signal('pause');
        }
    }

    toggleFullScreen() {
        this.isFullScreen ? exitFullScreen() : goFullScreen(this);
        this.isFullScreen = Boolean(!this.isFullScreen);
    }

    toggleControls() {
        this.isControlsHidden() ? this.showControls() : this.hideControls();
    }

    isControlsHidden() {
        const { controlsHiddenClass } = this.getConfig();
        return this.classList.contains(controlsHiddenClass);
    }

    hideControls() {
        const { controlsHiddenClass } = this.getConfig();
        this.classList.add(controlsHiddenClass);
    }

    showControls() {
        const { controlsHiddenClass } = this.getConfig();
        this.classList.remove(controlsHiddenClass);
    }
}

customElements.define('arpa-gallery', Gallery);
export default Gallery;
