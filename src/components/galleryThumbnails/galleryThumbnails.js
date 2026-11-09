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
            hasArrows: true,
            hasItemsTransition: false,
            selectedClass: 'galleryThumbnail--selected'
        });
    }

    async $initialize() {
        this.bind('_handleSelectedItem');
        super.$initialize();
    }

    /**
     * Returns the thumbnails payload.
     * @returns {GalleryItemConfigType[] | undefined}
     */
    getThumbnailsPayload() {
        return /** @type {GalleryItemConfigType[] | undefined} */ (
            Array.from(this.resource?.getItems() || []).map((item, index) => ({
                id: `gallery-thumbnail-${(item?.id || index).toString()}`,
                itemId: item.id,
                image: item.thumbnail,
                title: item.title || ''
            }))
        );
    }

    getImageSize() {
        const position = this.getProp('position');
        const imageSize = ['left', 'right'].includes(position) ? 'thumbnail_vertical' : 'thumbnail';
        return imageSize;
    }

    $renderTemplate() {
        this.gallery = /** @type {Gallery | null} */ (this.closest('.gallery'));
        /** @type {ListResource | null} */
        this.resource = this.gallery?.listResource;
        const thumbnails = /** @type {unknown[]} */ (this.getThumbnailsPayload());
        return html`
            <arpa-node
                name="thumbnails"
                class-name="galleryThumbnails__mask"
                is-content
                on-mousedown="{onThumbnailsDown}"
                on-mouseup="{onThumbnailsUp}"
                on-mousemove="{onThumbnailsMove}"
                on-mouseleave="{onThumbnailsUp}"
            >
                ${mapHTML(
                    thumbnails,
                    ({ id, title, image, itemId }) =>
                        html`<gallery-thumbnail
                            id="${id}"
                            item-id="${itemId}"
                            render-mode="minimal"
                            title="${title}"
                            image="${image}"
                            image-size="{getImageSize()}"
                        ></gallery-thumbnail>`
                )}
            </arpa-node>
        `;
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars()
        };
    }

    async $initializeNodes() {
        await super.$initializeNodes();
        /** @type {HTMLElement | null} */
        this.thumbnailMask = this.querySelector('.galleryThumbnails__mask');
        this._initializeTooltip();
        this.resource?.on('items', this._handleSelectedItem);
        this._handleSelectedItem();
        return true;
    }

    /**
     * Handles the selected item.
     */
    async _handleSelectedItem() {
        const selectedClass = this.getProp('selected-class');
        const selected = /** @type {import('@arpadroid/resources').ListResourceItemType} */ (
            this.resource?._getItems()?.[0]
        );
        const selectedItems = this.thumbnailMask?.querySelectorAll(`.${selectedClass}`);
        selectedItems?.forEach(item => item.classList.remove(selectedClass));
        const thumbnail = /** @type {HTMLElement | null} */ (
            this.querySelector(`gallery-thumbnail[item-id="${String(selected?.id)}"]`)
        );
        if (thumbnail) {
            thumbnail?.classList.add(selectedClass);
            this.scrollToItem(thumbnail);
        }
    }

    // #endregion Rendering

    ////////////////////////////////
    // #region Thumbnails Drag
    ////////////////////////////////

    thumbDown = false;

    onThumbnailsDown() {
        this._stopInertia();
        this.dragSpeed = 0;
        this.thumbsDown = true;
    }

    onThumbnailsUp() {
        if (!this.thumbsDown) return;
        this.thumbsDown = false;
        if (Math.abs(this.dragSpeed) > 1) {
            this._startInertia();
        }
    }

    dragSpeed = 0;
    inertiaFriction = 0.95;
    inertiaFrame = 0;

    _startInertia() {
        this._stopInertia();
        const thumbs = this.nodes.thumbnails;
        let velocity = Math.sign(this.dragSpeed) * Math.abs(this.dragSpeed) ** 2.5;
        const step = () => {
            if (Math.abs(velocity) <= 0.4) {
                this.inertiaFrame = 0;
                return;
            }
            const previous = thumbs.scrollLeft;
            thumbs.scrollLeft += velocity * -1.5;
            velocity *= this.inertiaFriction;
            if (thumbs.scrollLeft === previous) {
                this.inertiaFrame = 0;
                return;
            }
            this.inertiaFrame = requestAnimationFrame(step);
        };
        this.inertiaFrame = requestAnimationFrame(step);
    }

    _stopInertia() {
        if (this.inertiaFrame) {
            cancelAnimationFrame(this.inertiaFrame);
            this.inertiaFrame = 0;
        }
    }
    /**
     * @param {MouseEvent} event
     */
    onThumbnailsMove(event) {
        if (!this.thumbsDown) return;
        const thumbs = this.nodes.thumbnails;
        const delta = -1;
        thumbs.scrollLeft += event.movementX * delta;
        this.dragSpeed = event.movementX;
    }

    // #endregion Drag

    ///////////////////////////////
    // #region Scrolling
    ///////////////////////////////

    /**
     * Scrolls to an thumbnail.
     * @param {HTMLElement | null} [thumbnail]
     */
    scrollToItem(thumbnail) {
        thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // #endregion SCROLLING

    /////////////////////////////////
    // #region Tooltip
    ////////////////////////////////

    createTooltip() {
        const cursorTooltipPosition = this.getCursorTooltipPosition();
        const tooltip = new Tooltip({
            content: '',
            classNames: ['galleryThumbnails__tooltip '],
            handler: /** @type {HTMLElement} */ (this.thumbnailMask),
            position: 'cursor',
            hasCursorPosition: true,
            cursorPositionAxis: this.getCursorAxis(),
            cursorTooltipPosition,
            onMouseTargetUpdate: (/** @type {HTMLElement} */ target) => {
                /** @type {GalleryThumbnail | null} */
                const item = target.closest('gallery-thumbnail');
                const payload = item?.getPayload();
                const content = payload?.title;
                tooltip.nodes.content instanceof HTMLElement &&
                    (tooltip.nodes.content.style.display = content ? 'block' : 'none');
                if (typeof content === 'string') {
                    tooltip.setContent(content);
                }
            }
        });
        return tooltip;
    }

    async _initializeTooltip() {
        const tooltip = this.tooltip || this.createTooltip();
        this.tooltip = tooltip;
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
        const position = this.getProp('position');
        if (position === 'top') return 'bottom';
        if (position === 'bottom') return 'top';
        if (position === 'left') return 'right';
        if (position === 'right') return 'left';
        return 'top';
    }

    getCursorAxis() {
        const position = this.getProp('position');
        if (['top', 'bottom'].includes(position)) return 'x';
        if (['left', 'right'].includes(position)) return 'y';
        return 'x';
    }
    // #endregion Tooltip
}

defineCustomElement('gallery-thumbnails', GalleryThumbnails);

export default GalleryThumbnails;
