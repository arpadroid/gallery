/**
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('../gallery/gallery').default} Gallery
 * @typedef {import('./galleryControl.types').GalleryControlConfigType} GalleryControlConfigType
 */
import { ArpaElement } from '@arpadroid/ui';
import { defineCustomElement, dummyListener, dummyOff, dummySignal, observerMixin } from '@arpadroid/tools';
const html = String.raw;
class GalleryControl extends ArpaElement {
    /** @type {GalleryControlConfigType} */
    _config = this._config;
    /**
     * Creates a new gallery control.
     * @param {GalleryControlConfigType} config - The configuration for the control.
     */
    constructor(config) {
        super(config);
        this.bind('_onClick', '_onClicked');
        this.on = dummyListener;
        this.signal = dummySignal;
        this.off = dummyOff;
        observerMixin(this);
    }

    _initialize() {
        /** @type {Gallery | null} */
        this.gallery = this.closest('arpa-gallery');
        /** @type {ListResource} */
        this.resource = this.gallery?.listResource;
    }

    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryControlConfigType} The default configuration.
     */
    getDefaultConfig() {
        /** @type {GalleryControlConfigType} */
        const config = {
            className: 'galleryControl',
            icon: 'sports_esports',
            label: 'Gallery control',
            debounceTime: 500
        };
        return super.getDefaultConfig(config);
    }

    render() {
        const content = html`<button
            is="icon-button"
            variant="compact"
            icon="${this.getProperty('icon')}"
            class="galleryControl__button"
            label="${this.getProperty('label')}"
            tooltip-position="top"
        ></button>`;
        this.innerHTML = content;
        return true;
    }

    _initializeNodes() {
        /** @type {IconButton | null} */
        this.button = /** @type {IconButton | null} */ (this.querySelector('button'));
        this.button?.removeEventListener('click', this._onClicked);
        this.button?.addEventListener('click', this._onClicked);
    }

    /**
     * Handles the click event.
     * @param {MouseEvent} event - The click event.
     */
    _onClicked(event) {
        const debounceTime = this.getProperty('debounce-time');
        if (debounceTime && this.isClicking) return;
        this.isClicking = true;
        this.signal('click', {
            event,
            gallery: this.gallery,
            control: this
        });
        this._onClick(event);
        debounceTime && setTimeout(() => (this.isClicking = false), debounceTime);
    }

    /**
     * Handles the click event.
     * @param {MouseEvent} _event - The click event.
     */
    _onClick(_event) {
        // Abstract method
    }
}

defineCustomElement('gallery-control', GalleryControl);

export default GalleryControl;
