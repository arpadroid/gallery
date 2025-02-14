/**
 * @typedef {import('../gallery/gallery').default} Gallery
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('../galleryItem/galleryItem.types').GalleryItemConfigType} GalleryItemConfigType
 * @typedef {import('./galleryThumbnails.types').GalleryThumbnailsConfigType} GalleryThumbnailsConfigType
 */
import { List } from '@arpadroid/lists';
import GalleryThumbnail from '../galleryThumbnail/galleryThumbnail';
import { mergeObjects, mapHTML } from '@arpadroid/tools';

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
        this.resource?.on('set_items', this._initializeThumbnails);
        this.resource?.on('items', this._handleSelectedItem);
    }

    /**
     * Handles the selected item.
     * @param {GalleryItem[]} items
     */
    async _handleSelectedItem(items) {
        const selectedClass = this.getProperty('selected-class');
        const selected = items?.[0];
        if (!selected) return;
        const selectedItems = this.querySelectorAll(`.${selectedClass}`);
        selectedItems.forEach(item => item.classList.remove(selectedClass));
        const thumbnail = this.querySelector(`gallery-thumbnail[item-id="${selected.id}"]`);
        thumbnail?.classList.add(selectedClass);
        const index = thumbnail ? Array.from(this.thumbnailMask?.children || []).indexOf(thumbnail) : 0;
        this.scrollToItem(index, 'left');
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
                title: item.title
            }))
        );
    }

    _initializeThumbnails() {
        this.thumbnailMask && (this.thumbnailMask.innerHTML = this.renderItems());
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

    _initializeNodes() {
        /** @type {HTMLElement | null} */
        this.thumbnailMask = this.querySelector('.galleryThumbnails__mask');
        this.thumbnailMask?.append(...(this._childNodes || []));
        this.arrowBack = this.querySelector('.galleryThumbnails__arrowBack');
        /** @type {HTMLElement | null} */
        this.arrowForward = this.querySelector('.galleryThumbnails__arrowForward');
        this.arrowBack?.addEventListener('click', this.scrollBack);
        this.arrowForward?.addEventListener('click', this.scrollForward);
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
        return html`<button
            is="icon-button"
            icon="keyboard_arrow_left"
            class="galleryThumbnails__arrowBack galleryThumbnails__arrow"
        ></button>`;
    }

    renderArrowForward() {
        return html`<button
            is="icon-button"
            icon="keyboard_arrow_right"
            class="galleryThumbnails__arrowForward galleryThumbnails__arrow"
        ></button>`;
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
     * Scrolls to an item index.
     * @param {number} index
     * @param {'center' | 'left' | 'right'} position
     * @throws {Error} If item with index not found.
     */
    scrollToItem(index, position = 'center') {
        if (!this.thumbnailMask) return;
        const maskRect = this.thumbnailMask.getBoundingClientRect();
        const item = /** @type {HTMLElement | null} */ (this.thumbnailMask.childNodes[index]);

        if (!item) throw new Error(`Item with index ${index} not found.`);
        const itemRect = item.getBoundingClientRect();
        let left = maskRect.left - itemRect.left;
        if (position === 'center') left += maskRect.width / 2 - itemRect.width / 2;
        else if (position === 'right') left += maskRect.width - itemRect.width;
        this.thumbnailMask.style.left = `${left}px`;
    }
    /////////////////////////////////
    // #endregion SCROLLING
    ////////////////////////////////
}

customElements.define('gallery-thumbnails', GalleryThumbnails);

export default GalleryThumbnails;
