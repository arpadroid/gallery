import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GalleryDots extends GalleryControl {
    /**
     * Returns the default configuration for the gallery dots.
     * @returns {import('./galleryDots.types').GalleryDotsConfigType}
     */
    getDefaultConfig() {
        return {
            className: 'galleryDots',
            ariaLabel: undefined
        };
    }

    _getTemplate() {
        return html`<arpa-pager
            id="${this.id}-listPager"
            has-arrow-controls="false"
            class="arpaList__pager"
            item-component="gallery-dot"
            max-nodes="${this.gallery?.getProperty('max-pager-nodes') || 12}"
            total-pages="${this.gallery?.listResource?.getTotalPages()}"
            current-page="${this.gallery?.listResource?.getCurrentPage()}"
            url-param="${this.gallery?.getParamName('page')}"
        ></arpa-pager>`;
    }
    _initialize() {
        super._initialize();
        this.classList.add('galleryDots');
        this._container = this.querySelector('.galleryDots__container');
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.classList.add('galleryDots__container');
            this.appendChild(this._container);
        }
    }

    async _initializeNodes() {
        await super._initializeNodes();
        this.gallery?._initializePager();
        return true;
    }
}

export default GalleryDots;

defineCustomElement('gallery-dots', GalleryDots);
