/**
 * @typedef {import('./gallery.types.js').GalleryConfigType} GalleryConfigType
 * @typedef {import('../galleryControls/galleryControls.js').default} GalleryControls
 * @typedef {import('../galleryItem/galleryItem.types.js').GalleryItemConfigType} GalleryItemConfigType
 * @typedef {import('../controls/gallerySettings/gallerySettings.js').default} GallerySettings
 */
import { List } from '@arpadroid/lists';
import GalleryItem from '../galleryItem/galleryItem';
import { observerMixin, dummySignal, goFullScreen, listen } from '@arpadroid/tools';
import { exitFullScreen, dummyListener, dummyOff, defineCustomElement } from '@arpadroid/tools';

const html = String.raw;
class Gallery extends List {
    //////////////////////////////
    // #region Initialization
    //////////////////////////////

    /** @type {GalleryConfigType} */
    _config = this._config;
    /**
     * Creates a new gallery component.
     * @param {GalleryConfigType} config
     */
    constructor(config) {
        super(config);
        this.bind('_handleActivity');
        this.signal = dummySignal;
        this.on = dummyListener;
        this.off = dummyOff;
        observerMixin(this);
        this.listResource?.on('items', this._onItemsUpdated);
    }

    hasHeaderControls() {
        return false;
    }

    /**
     * Returns the default configuration for the gallery.
     * @returns {GalleryConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {GalleryConfigType} */
        const conf = {
            activeClass: 'gallery--active',
            activityTimeout: 3000,
            autoplay: false,
            controlsHiddenClass: 'gallery--hide-controls',
            className: 'gallery',
            controls: [
                'play',
                'drag',
                'previous',
                'input',
                'next',
                'spacer',
                'toggleCaptions',
                'thumbnailControl',
                'views',
                'toggleControls',
                'darkMode',
                'fullScreen',
                'settings'
            ],
            defaultView: 'full',
            trackActivity: true,
            hasControls: true,
            hasItemsTransition: true,
            hasResource: true,
            imageSize: 'full_screen',
            itemComponent: GalleryItem,
            itemsPerPage: 1,
            itemTag: 'gallery-item',
            listSelector: 'arpa-gallery',
            loadingMode: 'loadNext',
            playInterval: 5,
            tagName: 'arpa-gallery',
            thumbnailsPosition: 'bottom',
            views: ['full']
        };
        return super.getDefaultConfig(conf);
    }

    _initialize() {
        this.bind('_onItemsUpdated');
        super._initialize();
    }

    getActiveClass() {
        return this?.getProperty('active-class');
    }

    // #endregion Initialization

    //////////////////////////////
    // #region Controls
    //////////////////////////////

    isControlsHidden() {
        const _class = this.getControlsHiddenClass();
        return this?.classList.contains(_class);
    }

    getControlsHiddenClass() {
        return this?.getProperty('controls-hidden-class') || 'gallery--hide-controls';
    }

    toggleControls() {
        this.isControlsHidden() ? this.showControls() : this.hideControls();
    }

    showControls() {
        this.classList.remove(this.getControlsHiddenClass());
    }

    hideControls() {
        this.classList.add(this.getControlsHiddenClass());
        requestAnimationFrame(() => {
            this?.classList.remove(this.getActiveClass());
        });
    }

    // #endregion Controls

    //////////////////////////////
    // #region Activity
    //////////////////////////////

    _handleActivity() {
        const activeClass = this.getActiveClass();
        clearTimeout(this.activeTimeout);
        this.isActive = true;
        const activityTimeout = this.getProperty('activity-timeout') || 3000;
        !this.classList.contains(activeClass) && this.classList.add(activeClass);
        this.activeTimeout = setTimeout(() => {
            this.isActive = false;
            this.classList.remove(activeClass);
            this.activeTimeout = undefined;
        }, activityTimeout);
    }

    // #endregion Activity

    //////////////////////////////
    // #region Get
    //////////////////////////////

    getLoadingMode() {
        return this.getProperty('loading-mode');
    }

    getLazyLoadImages() {
        return false;
    }

    getCurrentItem() {
        const itemTag = this.getProperty('item-tag') || 'gallery-item';
        return this.querySelector(itemTag);
    }

    // #endregion Get

    //////////////////////////////
    // #region Rendering
    //////////////////////////////

    renderFull() {
        return html`
            <div class="gallery__header">{title}</div>
            {info}
            <div class="gallery__body">
                <div class="gallery__view">{heading}{items}{preloader}</div>
                {aside}
            </div>
            <div class="gallery__footer">{controls}</div>
        `;
    }

    renderControls() {
        return super.renderControls({
            tagName: 'gallery-controls',
            className: 'gallery__controls'
        });
    }

    async _initializeNodes() {
        super._initializeNodes();
        this.controls = /** @type {GalleryControls | null} */ (this.querySelector('gallery-controls'));
        this.footerNode = this.querySelector('.gallery__footer');
        this.headerNode = this.querySelector('.gallery__header');
        this.bodyNode = this.querySelector('.gallery__body');
        /** @type {HTMLElement | null} */
        this.viewNode = this.querySelector('.gallery__view');
        this.controls?.promise && (await this.controls?.promise);
        /** @type {GallerySettings | null} */
        this.settings = this.querySelector('gallery-settings');
        this.getProperty('autoplay') && this.play();
        return true;
    }

    /**
     * Returns the settings node.
     * @returns {GallerySettings | null}
     */
    getSettingsNode() {
        return this.settings || this.querySelector('gallery-settings');
    }

    // #endregion Rendering

    //////////////////////////////
    // #region Lifecycle
    //////////////////////////////

    /**
     * Called when items are updated from the list resource.
     * @param {GalleryItemConfigType[]} items - The items that were updated.
     */
    _onItemsUpdated(items) {
        const loadingMode = this.getLoadingMode();
        if (loadingMode === 'loadNext') {
            const next = this.listResource?.getNextItem(items[0]);
            if (next?.image) {
                const image = new Image();
                typeof next.image === 'string' && (image.src = next.image);
            }
        }
    }

    async _onComplete() {
        await super._onComplete();
        await this.promise;
        this.trackActivity();
    }

    trackActivity() {
        listen(this, ['mouseleave', 'click', 'mouseenter', 'mousemove'], this._handleActivity);
    }

    // #endregion Lifecycle

    //////////////////////////////
    // #region Gallery API
    //////////////////////////////

    getPlayInterval() {
        return (Number(this.settings?.getPlayInterval() || this.getProperty('play-interval')) || 5) * 1000;
    }

    play(playRightAway = true) {
        if (this.listResource?.getTotalItems() < 2) return;

        const playInterval = this.getPlayInterval();
        this.playTimeout && clearTimeout(this.playTimeout);

        const gotToNextItem = () => {
            this.signal('play');
            if (this.isPlaying) {
                this.listResource?.nextPage();
                this.playTimeout = setTimeout(gotToNextItem, playInterval);
            }
        };

        if (playInterval) {
            this.isPlaying = true;
            if (playRightAway) {
                gotToNextItem();
            } else {
                this.playTimeout = setTimeout(() => gotToNextItem(), playInterval);
            }
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
        return this.isFullScreen;
    }

    // #endregion Gallery API
}

defineCustomElement('arpa-gallery', Gallery);

export default Gallery;
