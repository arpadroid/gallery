/**
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('./galleryControl.types').GalleryControlConfigType} GalleryControlConfigType
 */
import { ArpaElement } from '@arpadroid/ui';
import {
    camelToDashed,
    defineCustomElement,
    dummyListener,
    dummyOff,
    dummySignal,
    observerMixin
} from '@arpadroid/tools';
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
        this.classList.add('galleryControl');
        this.on = dummyListener;
        this.signal = dummySignal;
        this.off = dummyOff;
        observerMixin(this);
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
            debounceTime: 500,
            handleContent: false
        };
        return super.getDefaultConfig(config);
    }

    getAriaLabel() {
        return this.resolveAriaLabel(this.getProp('label') || '');
    }

    $renderTemplate() {
        const lbl = this.getProp('label') || '';
        return html`<arpa-node
            tag="icon-button"
            name="button"
            variant="compact"
            icon="{icon}"
            aria-label="{getAriaLabel()}"
            tooltip-position="{getTooltipPosition()}"
            on-click="{_onClicked}"
        >
            <arpa-zone name="tooltip">${lbl}</arpa-zone>
        </arpa-node>`;
    }

    setTooltipPosition(position = this.getTooltipPosition()) {
        this.tooltip?.setAttribute('position', position);
    }

    getTooltipPosition() {
        const controls = (this.gallery?.getControls() || []).map(control => 'gallery-' + camelToDashed(control));
        const tagName = this.tagName.toLowerCase();
        const isFirstControl = controls?.indexOf(tagName) === 0;
        const isLastControl = controls?.indexOf(tagName) === controls.length - 1;
        let tooltipPosition = 'top';
        if (isFirstControl) {
            tooltipPosition = 'top-left';
        } else {
            isLastControl && (tooltipPosition = 'top-right');
        }
        return tooltipPosition;
    }

    initializeGallery() {
        /** @type {Gallery | null} */
        this.gallery = this.closest('.gallery');
        /** @type {ListResource} */
        this.resource = this.gallery?.listResource;
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        await this.onNodesReady();
        this.initializeGallery();
        this.buttonComponent = /** @type {IconButton | null} */ (this.nodes.button);
        await this.buttonComponent?.promise;

        /** @type {Tooltip | null} */
        this.tooltip = this.querySelector('arpa-tooltip');
        setTimeout(() => {
            this.setTooltipPosition();
        }, 200);
        return true;
    }

    /**
     * Handles the click event.
     * @param {MouseEvent} event - The click event.
     */
    _onClicked(event) {
        const debounceTime = this.getProp('debounce-time');
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
