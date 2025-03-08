/**
 * @typedef {import('./gallery.types').GalleryConfigType} GalleryConfigType
 * @typedef {import('../galleryControls/galleryControls.js').default} GalleryControls
 * @typedef {import('../galleryItem/galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 * @typedef {import('../controls/gallerySettings/gallerySettings.js').default} GallerySettings
 */
import { List } from '@arpadroid/lists';
import GalleryItem from '../galleryItem/galleryItem';
import { observerMixin, dummySignal, goFullScreen } from '@arpadroid/tools';
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
        this.signal = dummySignal;
        this.on = dummyListener;
        this.off = dummyOff;
        observerMixin(this);
        this.listResource?.on('items', this._onItemsUpdated);
    }

    /**
     * Returns the default configuration for the gallery.
     * @returns {GalleryConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {GalleryConfigType} */
        const conf = {
            className: 'gallery',
            controls: [
                'play',
                'previous',
                'input',
                'next',
                'spacer',
                'thumbnailControl',
                'views',
                'toggleControls',
                'darkMode',
                'fullScreen',
                'settings'
            ],
            thumbnailsPosition: 'bottom',
            // trackActivity: true,
            activityTimeout: 3000,
            defaultView: 'full',
            hasControls: true,
            activeClass: 'gallery--active',
            autoplay: false,
            hasItemsTransition: true,
            hasResource: true,
            imageSize: 'full_screen',
            itemComponent: GalleryItem,
            itemsPerPage: 1,
            itemTag: 'gallery-item',
            listSelector: 'arpa-gallery',
            playInterval: 5,
            views: ['full'],
            loadingMode: 'loadNext',
            controlsHiddenClass: 'gallery--hide-controls'
        };
        return super.getDefaultConfig(conf);
    }

    _initialize() {
        this.bind('_onItemsUpdated', '_handleActivity');
        super._initialize();
        this.isActive = false;
        this.manageActiveState();
    }

    manageActiveState() {
        this.removeEventListener('mousemove', this._handleActivity);
        this.addEventListener('mousemove', this._handleActivity);
    }

    _handleActivity() {
        const activeClass = this.getProperty('active-class');
        clearTimeout(this.activeTimeout);
        this.isActive = true;
        const activityTimeout = this.getProperty('activity-timeout') || 3000;
        if (!this.classList.contains(activeClass)) {
            this.classList.add(activeClass);
        }
        this.activeTimeout = setTimeout(() => {
            this.isActive = false;
            this.classList.remove(activeClass);
        }, activityTimeout);
    }

    // #endregion Initialization

    //////////////////////////////
    // #region Get
    //////////////////////////////

    isControlsHidden() {
        return this.classList.contains(this.getControlsHiddenClass());
    }

    getControlsHiddenClass() {
        return this.getProperty('controls-hidden-class') || 'gallery--hide-controls';
    }

    getLoadingMode() {
        return this.getProperty('loading-mode');
    }

    getLazyLoadImages() {
        return false;
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
                <div class="arpaList__bodyMain">{heading}{items}{preloader}</div>
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
        this.controls?.promise && (await this.controls?.promise);
        /** @type {GallerySettings | null} */
        this.settings = this.querySelector('gallery-settings');
        this.getProperty('autoplay') && this.play();
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

    // #endregion Lifecycle

    //////////////////////////////
    // #region Gallery API
    //////////////////////////////

    play(playRightAway = true) {
        const playInterval = this.settings?.getPlayInterval() * 1000;
        this.playTimeout && clearTimeout(this.playTimeout);
        if (this.listResource?.getTotalItems() < 2) {
            return;
        }

        const nextPage = () => {
            if (this.isPlaying) {
                this.listResource?.nextPage();
                this.playTimeout = setTimeout(nextPage, playInterval);
            }
        };

        if (playInterval) {
            this.isPlaying = true;
            if (playRightAway) {
                nextPage();
                this.signal('play');
            } else {
                this.playTimeout = setTimeout(() => {
                    nextPage();
                    this.signal('play');
                }, playInterval);
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
    }

    toggleControls() {
        this.isControlsHidden() ? this.showControls() : this.hideControls();
    }

    hideControls() {
        this.classList.add(this.getControlsHiddenClass());
    }

    showControls() {
        this.classList.remove(this.getControlsHiddenClass());
    }

    // #endregion Gallery API
}

defineCustomElement('arpa-gallery', Gallery);

export default Gallery;
