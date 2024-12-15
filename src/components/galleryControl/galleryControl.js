/**
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('../gallery/gallery').default} Gallery
 */
import { ArpaElement } from '@arpadroid/ui';
import { ObserverTool } from '@arpadroid/tools';
const html = String.raw;
class GalleryControl extends ArpaElement {
    _initialize() {
        this.bind('_onClick', '_onClicked');
        ObserverTool.mixin(this);
        /** @type {Gallery} */
        this.gallery = this.closest('arpa-gallery');
        /** @type {ListResource} */
        this.resource = this.gallery?.listResource;
    }

    getDefaultConfig() {
        return super.getDefaultConfig({
            className: 'galleryControl',
            icon: 'sports_esports',
            label: 'Gallery control',
            debounceTime: 500
        });
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
        /** @type {IconButton} */
        this.button = this.querySelector('button');
        this.button?.removeEventListener('click', this._onClicked);
        this.button?.addEventListener('click', this._onClicked);
    }

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

    _onClick() {
        // Abstract method
    }
}

customElements.define('gallery-control', GalleryControl);
export default GalleryControl;
