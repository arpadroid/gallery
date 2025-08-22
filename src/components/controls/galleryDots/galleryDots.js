/**
 * @typedef {import('@arpadroid/ui').Pager} Pager
 * @typedef {import('../../galleryThumbnail/galleryThumbnail').default} GalleryThumbnail
 * @typedef {import('@arpadroid/resources').ListResourceItemType} ListResourceItemType
 */
import { attrString, defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';
import { Image, Tooltip } from '@arpadroid/ui';

const html = String.raw;
class GalleryDots extends GalleryControl {
    //////////////////////////////
    // #region Initialization
    //////////////////////////////
    prevItemNumber = 0;

    /** @type {ListResourceItemType | undefined} */
    thumbnailPayload = undefined;

    /**
     * Returns the default configuration for the gallery dots.
     * @returns {import('./galleryDots.types').GalleryDotsConfigType}
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.galleryDots';
        this.bind('onTargetUpdate', '_onItemChanged', '_onThumbnailLoaded', '_onThumbnailError');
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
            max-nodes="1000"
            total-pages="${this.gallery?.listResource?.getTotalPages()}"
            current-page="${this.gallery?.listResource?.getCurrentPage()}"
            url-param="${this.gallery?.getParamName('page')}"
        ></arpa-pager>`;
    }
    _initialize() {
        super._initialize();
        this.pageFilter = this.gallery?.listResource?.getFilter('page');
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
        /** @type {Pager | null} */
        this.pager = this.querySelector('arpa-pager');

        this.pager?.onRendered(() => {
            requestIdleCallback(() => this._initializeTooltip());
        });
        this.gallery?._initializePager();
        await this.pager?.promise;
        await this.gallery?.promise;
        this.gallery?.listResource?.pageFilter?.on('value', this._onItemChanged);

        return true;
    }

    /**
     * Handles when the page filter changes.
     * @param {string} pageNumber - The new page number.
     */
    _onItemChanged(pageNumber) {
        const pagerItem = this.pager?.getItemByPage(pageNumber);
        pagerItem?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }

    async _initializeTooltip() {
        if (this.tooltip) {
            await this.gallery?.promise;
            this.pager?.itemsNode && this.tooltip.setHandler(this.pager?.itemsNode);
            return;
        }

        this.tooltip = new Tooltip({
            text: 'Thumbnails tooltip',
            className: 'galleryDots__tooltip',
            handler: /** @type {HTMLElement} */ (this.pager?.itemsNode),
            position: 'cursor',
            hasCursorPosition: true,
            onMouseTargetUpdate: this.onTargetUpdate
        });
        await this.gallery?.promise;
        this.gallery?.appendChild(this.tooltip);
    }

    // #endregion Initialization

    ////////////////////
    // #region Get
    ////////////////////

    /**
     * Returns the title for the thumbnail.
     * @param {import('@arpadroid/resources').ListResourceItemType} payload - The payload containing the item data.
     * @returns {string}
     */
    getThumbTitle(payload) {
        return (payload?.title && `${this.prevItemNumber}. ${payload.title}`) || '';
    }

    /**
     * Returns the page number from a dot node.
     * @param {HTMLElement | null} node
     * @returns {string | null | undefined}
     */
    resolvePage(node) {
        let page = node?.getAttribute('data-page');
        if (!page && node) {
            node = node?.closest('gallery-dot');
            page = node && node?.getAttribute('page');
        }
        return page;
    }

    /**
     * Returns an item payload given a dot node.
     * @param {number} page
     * @returns {import('@arpadroid/resources').ListResourceItemType | undefined}
     */
    getItemPayloadByPage(page) {
        return this.gallery?.listResource?.getItems()[page - 1];
    }

    // #endregion Get

    ////////////////////
    // #region Lifecycle
    ////////////////////

    _onComplete() {
        requestIdleCallback(() => this._initializeTooltip());
    }

    // #endregion Lifecycle

    ///////////////////////////
    // #region Event Handlers
    ///////////////////////////

    /**
     * Handles the target update event for the tooltip.
     * @param {HTMLElement} target - The target element.
     * @returns {void}
     */
    onTargetUpdate(target) {
        const page = this.resolvePage(target);
        if (!page) return;
        const payload = this.getItemPayloadByPage(Number(page));
        const itemNumber = Number(target.getAttribute('data-page'));
        if (!payload?.id || itemNumber === 0) {
            return;
        }
        this.prevItemNumber = itemNumber;
        /** @type {GalleryThumbnail | undefined | null} */
        this.thumbnail = this.tooltip?.querySelector('gallery-thumbnail');
        this.thumbnailPayload = payload;
        if (!this.thumbnail) {
            this.createThumbnail();
        } else {
            this.updateThumbnail();
        }
    }

    /**
     * Creates a thumbnail for the tooltip.
     * @param {ListResourceItemType | undefined} payload - The payload containing the item data.
     * @returns {void}
     * @throws {Error} If the payload is invalid.
     */
    createThumbnail(payload = this.thumbnailPayload) {
        if (!payload?.id) {
            throw new Error('Payload is required to create a thumbnail');
        }
        this.tooltip?.setContent(
            html`<gallery-thumbnail
                ${attrString({
                    imagePosition: payload?.imagePosition,
                    itemId: payload?.id,
                    title: this.getThumbTitle(payload),
                    hasTitle: 'true',
                    hasImageThumbnail: 'true',
                    image: payload?.image,
                    imageSize: 'small'
                })}
            ></gallery-thumbnail>`
        );
    }

    thumbnailLoadStartTime = 0;

    /**
     * Updates the thumbnail with new content.
     * @param {ListResourceItemType | undefined} payload - The payload containing the new content.
     * @returns {void}
     * @throws {Error} If the payload is invalid.
     */
    updateThumbnail(payload = this.thumbnailPayload) {
        if (!payload?.id) {
            throw new Error('Payload is required to update a thumbnail');
        }
        if (this.thumbnail?.image?.image?.src === payload.image) {
            return;
        }
        /** @type {Image | undefined | null} */
        const imageComponent = this.thumbnail?.image;
        if (!imageComponent) return;
        this.thumbnailLoadStartTime = performance.now();
        imageComponent.style.opacity = '0';

        const image = payload?.image;
        this._updateThumbnailTitle();
        setTimeout(() => {
            imageComponent?.on('load', this._onThumbnailLoaded);
            imageComponent?.on('error', this._onThumbnailError);
            const errThumb = this.i18nText('errLoadThumbnail');
            imageComponent?.addConfig({ errLoad: errThumb });
            image && this.thumbnail?.setImage(image);
        }, 50);
    }

    /**
     * Called when the thumbnail fails to load.
     * @param {Event} event
     * @param {ListResourceItemType | undefined} _payload - The payload containing the item data.
     */
    _onThumbnailError(event, _payload = this.thumbnailPayload) {
        const imageComponent = this.thumbnail?.image;
        if (!imageComponent) return;
        imageComponent.style.opacity = '1';
    }

    /**
     * Called when the thumbnail loads successfully.
     * @param {{ image?: HTMLImageElement, event?: Event, message?: string}} _payload
     * @param {ListResourceItemType | undefined} _thumbPayload - The payload containing the thumbnail data.
     */
    _onThumbnailLoaded(_payload = {}, _thumbPayload = this.thumbnailPayload) {
        let timeout = 100;
        const loadTime = Math.round(performance.now() - this.thumbnailLoadStartTime);
        if (loadTime < timeout) {
            timeout -= loadTime;
        }
        requestAnimationFrame(() => {
            const imageComponent = this.thumbnail?.image;
            if (!imageComponent) return;
            imageComponent.style.opacity = '1';
        });
    }

    /**
     * Updates the title of the thumbnail.
     * @param {ListResourceItemType | undefined} payload - The payload containing the item data.
     */
    _updateThumbnailTitle(payload = this.thumbnailPayload) {
        const title = payload && this.getThumbTitle(payload);
        title && this.thumbnail?.setTitle(title);
    }

    // #endregion Event Handlers
}

export default GalleryDots;

defineCustomElement('gallery-dots', GalleryDots);
