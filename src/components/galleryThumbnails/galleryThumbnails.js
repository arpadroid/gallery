/**
 * @typedef {import('../gallery/gallery').default} Gallery
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('../galleryItem/galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 * @typedef {import('./galleryThumbnails.types').GalleryThumbnailsConfigType} GalleryThumbnailsConfigType
 * @typedef {import('../controls/gallerySettings/gallerySettings').GalleryThumbnailControl} GalleryThumbnailControl
 */
import { List } from '@arpadroid/lists';
import GalleryThumbnail from '../galleryThumbnail/galleryThumbnail';
import { mergeObjects, mapHTML, defineCustomElement } from '@arpadroid/tools';
import { Tooltip } from '@arpadroid/ui';

const html = String.raw;
class GalleryThumbnails extends List {
    /**
     * Returns the default configuration for the gallery thumbnails.
     * @returns {GalleryThumbnailsConfigType} The default configuration.
     */
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryThumbnails',
            renderMode: 'minimal',
            itemComponent: GalleryThumbnail,
            itemTag: 'gallery-thumbnail',
            hasArrows: false,
            selectedClass: 'galleryThumbnail--selected'
        });
    }

    async _initialize() {
        super._initialize();
        await customElements.whenDefined('arpa-gallery');
        this.bind('_initializeThumbnails', '_handleSelectedItem');
        /** @type {Gallery | null} */
        this.gallery = this.closest('.gallery');
        /** @type {ListResource | null} */
        this.resource = this.gallery?.listResource;
        this.handleResize();
        this.resource?.on('items', this._initializeThumbnails);
        this.resource?.on('items', this._handleSelectedItem);
    }
    /**
     * Handles the selected item.
     * @param {GalleryItem[]} items
     */
    async _handleSelectedItem(items) {
        if (!items?.length) return;
        const selectedClass = this.getProperty('selected-class');
        const selected = items && items?.[0];
        if (!selected) return;
        const selectedItems = this.querySelectorAll(`.${selectedClass}`);
        selectedItems.forEach(item => item.classList.remove(selectedClass));
        /** @type {GalleryThumbnail | null} */
        const thumbnail = this.querySelector(`gallery-thumbnail[item-id="${selected.id}"]`);
        thumbnail?.classList.add(selectedClass);
        this.scrollToItem(thumbnail);
    }

    //////////////////////////////
    // #region Data handling
    /////////////////////////////

    /**
     * Returns the thumbnails payload.
     * @returns {GalleryItemConfigType[] | undefined}
     */
    getThumbnailsPayload() {
        return /** @type {GalleryItemConfigType[] | undefined} */ (
            this.resource?.getItems()?.map((item, index) => ({
                id: `gallery-thumbnail-${(item?.id || index).toString()}`,
                itemId: item.id,
                image: item.thumbnail,
                title: item.title || ''
            }))
        );
    }

    thumbnailsInitialized = false;

    _initializeThumbnails() {
        if (this.thumbnailsInitialized) return;
        this.thumbnailMask && (this.thumbnailMask.innerHTML = this.renderItems());
        this.thumbnailsInitialized = true;
    }

    ///////////////////////////////
    // #region Rendering
    ///////////////////////////////

    render() {
        const hasArrows = this.getProperty('has-arrows');
        const content = html`
            ${(hasArrows && this.renderArrowBack()) || ''}
            <div class="galleryThumbnails__mask"></div>
            ${(hasArrows && this.renderArrowForward()) || ''}
        `;
        this.innerHTML = content;
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars()
        };
    }

    async _initializeNodes() {
        await super._initializeNodes();
        /** @type {HTMLElement | null} */
        this.thumbnailMask = this.querySelector('.galleryThumbnails__mask');
        this.thumbnailMask?.append(...(this._childNodes || []));
        this.arrowBack = this.querySelector('.galleryThumbnails__arrowBack');
        /** @type {HTMLElement | null} */
        this.arrowForward = this.querySelector('.galleryThumbnails__arrowForward');
        this.arrowBack?.addEventListener('click', this.scrollBack);
        this.arrowForward?.addEventListener('click', this.scrollForward);
        this._initializeTooltip();
        return true;
    }

    async _initializeTooltip() {
        const cursorTooltipPosition = this.getCursorTooltipPosition();
        const tooltip = new Tooltip({
            text: 'Thumbnails tooltip',
            className: 'galleryThumbnails__tooltip',
            handler: /** @type {HTMLElement} */ (this.thumbnailMask),
            position: 'cursor',
            cursorPositionAxis: this.getCursorAxis(),
            cursorTooltipPosition,
            onMouseTargetUpdate: (/** @type {HTMLElement} */ target) => {
                /** @type {GalleryThumbnail | null} */
                const item = target.closest('gallery-thumbnail');
                const payload = item?.getPayload();
                const content = payload?.title;
                tooltip.contentNode && (tooltip.contentNode.style.display = content ? 'block' : 'none');
                if (typeof content === 'string') {
                    tooltip.setContent(content);
                }
            }
        });
        await this.gallery?.promise;
        const thumbnailControl = /** @type {GalleryThumbnailControl | null | undefined} */ (
            this.gallery?.getControl('thumbnailControl')
        );
        thumbnailControl?.on('positionChange', () => {
            tooltip.setCursorPosition(this.getCursorAxis(), this.getCursorTooltipPosition());
        });
        this.gallery?.appendChild(tooltip);
    }

    getCursorTooltipPosition() {
        const position = this.getProperty('position');
        if (position === 'top') return 'bottom';
        if (position === 'bottom') return 'top';
        if (position === 'left') return 'right';
        if (position === 'right') return 'left';
        return 'top';
    }

    getCursorAxis() {
        const position = this.getProperty('position');
        if (['top', 'bottom'].includes(position)) return 'x';
        if (['left', 'right'].includes(position)) return 'y';
        return 'x';
    }

    /**
     * Renders the items.
     * @param {GalleryItemConfigType[]} items
     * @returns {string}
     */
    renderItems(items = this.getThumbnailsPayload() || []) {
        const position = this.getProperty('position');
        const imageSize = ['left', 'right'].includes(position) ? 'thumbnail_vertical' : 'thumbnail';
        return mapHTML(
            items,
            (/** @type {GalleryItemConfigType} */ item) =>
                html`<gallery-thumbnail
                    item-id="${item.itemId}"
                    render-mode="minimal"
                    title="${item.title}"
                    image="${item.image}"
                    image-size="${imageSize}"
                    item-id="${item.id}"
                ></gallery-thumbnail>`
        );
    }

    renderArrowBack() {
        return html`<icon-button
            icon="keyboard_arrow_left"
            class="galleryThumbnails__arrowBack galleryThumbnails__arrow"
        ></icon-button>`;
    }

    renderArrowForward() {
        return html`<icon-button
            icon="keyboard_arrow_right"
            class="galleryThumbnails__arrowForward galleryThumbnails__arrow"
        ></icon-button>`;
    }

    /////////////////////////////
    // #endregion Rendering
    ////////////////////////////

    ///////////////////////////////
    // #region Scrolling
    ///////////////////////////////

    scrollBack() {
        if (!this.thumbnailMask) return;
        const viewWidth = this.getViewWidth();
        const rect = this.thumbnailMask.getBoundingClientRect();
        const left = this.adjustBackScroll(rect.left + viewWidth);
        this.thumbnailMask.style.left = `${left}px`;
    }

    /**
     * Adjusts the scroll back.
     * @param {number} left
     * @returns {number}
     */
    adjustBackScroll(left) {
        if (left > 0) left = 0;
        return left;
    }

    scrollForward() {
        if (!this.thumbnailMask) return;
        const viewWidth = this.getViewWidth();
        const rect = this.thumbnailMask.getBoundingClientRect();
        const left = this.adjustForwardScroll(rect.left - viewWidth);
        this.thumbnailMask.style.left = `${left}px`;
    }

    /**
     * Adjusts the scroll forward.
     * @param {number} left
     * @returns {number}
     */
    adjustForwardScroll(left) {
        const maxScroll = -(this.thumbnailMask?.clientWidth || 0) + this.getViewWidth();
        if (left < maxScroll) left = maxScroll;
        return left;
    }

    getViewWidth() {
        return this.clientWidth;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.adjustScroll(), 400);
        });
    }

    adjustScroll() {
        if (!this.thumbnailMask) return;
        let left = this.thumbnailMask.getBoundingClientRect().left;
        left = this.adjustBackScroll(left);
        left = this.adjustForwardScroll(left);
        this.thumbnailMask.style.left = `${left}px`;
    }

    /**
     * Scrolls to an thumbnail.
     * @param {HTMLElement | null} [thumbnail]
     */
    scrollToItem(thumbnail) {
        requestAnimationFrame(() => {
            thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    /////////////////////////////////
    // #endregion SCROLLING
    ////////////////////////////////
}

defineCustomElement('gallery-thumbnails', GalleryThumbnails);

export default GalleryThumbnails;
