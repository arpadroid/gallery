import { List } from '@arpadroid/lists';
import GalleryThumbnail from '../galleryThumbnail/galleryThumbnail';
import { mergeObjects, mapHTML } from '@arpadroid/tools';

const html = String.raw;

class GalleryThumbnails extends List {
    thumbnails = [];
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            className: 'galleryThumbnails',
            renderMode: 'minimal',
            itemComponent: GalleryThumbnail,
            itemTag: 'gallery-thumbnail',
            hasArrows: false,
            position: 'right',
            selectedClass: 'galleryThumbnail--selected'
        });
    }

    async _initialize() {
        await customElements.whenDefined('arpa-gallery');
        this.bind('_initializeThumbnails', '_handleSelectedItem');
        this.gallery = this.closest('.gallery');
        this.resource = this.gallery?.listResource;
        this.handleResize();
        this.resource.on('set_items', this._initializeThumbnails);
        this.resource.on('items', this._handleSelectedItem);
    }

    getPosition() {
        return this.getProperty('position') || 'bottom';
    }

    _handleSelectedItem(items) {
        const selectedClass = this.getProperty('selected-class');
        const selected = items?.[0];
        if (!selected) return;
        const selectedItems = this.querySelectorAll(`.${selectedClass}`);
        selectedItems.forEach(item => item.classList.remove(selectedClass));
        const thumbnail = this.querySelector(`gallery-thumbnail[item-id="${selected.id}"]`);
        thumbnail?.classList.add(selectedClass);
    }

    //////////////////////////////
    // #region Data handling
    /////////////////////////////

    getThumbnailsPayload() {
        return this.resource?.getItems().map((item, index) => ({
            id: `gallery-thumbnail-${item.id || index}`,
            itemId: item.id,
            image: item.thumbnail,
            title: item.title
        }));
    }

    _initializeThumbnails() {
        this.thumbnailMask.innerHTML = this.renderItems();
    }

    positionThumbnails(position = this.thumbnails?.getProperty('position') || 'bottom') {
        if (position === 'bottom') {
            this.gallery.footerNode.append(this.thumbnails);
        } else if (position === 'top') {
            this.gallery.headerNode.prepend(this.thumbnails);
        } else {
            this.gallery.append(this.thumbnails);
        }
    }

    ///////////////////////////////
    // #region Rendering
    ///////////////////////////////

    render() {
        const position = this.getProperty('position');
        position && this.classList.add(`galleryThumbnails--${position}`);
        const hasArrows = this.getProperty('has-arrows');
        const content = html`
            ${(hasArrows && this.renderArrowBack()) || ''}
            <div class="galleryThumbnails__mask"></div>
            ${(hasArrows && this.renderArrowForward()) || ''}
        `;
        this.innerHTML = content;
    }

    _initializeNodes() {
        this.thumbnailMask = this.querySelector('.galleryThumbnails__mask');
        this.thumbnailMask.append(...this._childNodes);
        this.arrowBack = this.querySelector('.galleryThumbnails__arrowBack');
        this.arrowForward = this.querySelector('.galleryThumbnails__arrowForward');
        this.arrowBack?.addEventListener('click', this.scrollBack);
        this.arrowForward?.addEventListener('click', this.scrollForward());
    }

    renderItems(items = this.getThumbnailsPayload()) {
        const position = this.getProperty('position');
        const imageSize = ['left', 'right'].includes(position) ? 'thumbnail_vertical' : 'thumbnail';
        return mapHTML(
            items,
            item =>
                html`<gallery-thumbnail
                    id="${item.id}"
                    render-mode="minimal"
                    title="${item.title}"
                    image="${item.image}"
                    image-size="${imageSize}"
                    item-id="${item.itemId}"
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
        const viewWidth = this.getViewWidth();
        const rect = this.thumbnailMask.getBoundingClientRect();
        const left = this.adjustBackScroll(rect.left + viewWidth);
        this.thumbnailMask.style.left = `${left}px`;
    }

    adjustBackScroll(left) {
        if (left > 0) left = 0;
        return left;
    }

    scrollForward() {
        const viewWidth = this.getViewWidth();
        const rect = this.thumbnailMask.getBoundingClientRect();
        const left = this.adjustForwardScroll(rect.left - viewWidth);
        this.thumbnailMask.style.left = `${left}px`;
    }

    adjustForwardScroll(left) {
        const maxScroll = -this.thumbnailMask.clientWidth + this.getViewWidth();
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
        const maskRect = this.thumbnailMask.getBoundingClientRect();
        const item = this.thumbnailMask.childNodes[index];
        if (!item) {
            throw new Error(`Item with index ${index} not found`);
        }
        const rect = item.getBoundingClientRect();
        if (position === 'left') {
            const left = this.adjustForwardScroll(-rect.left + maskRect.left);
            this.thumbnailMask.style.left = `${left}px`;
        } else if (position === 'right') {
            const left = this.adjustBackScroll(-rect.left + maskRect.left - rect.width + this.getViewWidth());
            this.thumbnailMask.style.left = `${left}px`;
        }
    }
    /////////////////////////////////
    // #endregion SCROLLING
    ////////////////////////////////
}

customElements.define('gallery-thumbnails', GalleryThumbnails);

export default GalleryThumbnails;
