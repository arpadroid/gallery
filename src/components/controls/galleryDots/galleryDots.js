/**
 * @typedef {import('@arpadroid/ui').Pager} Pager
 */
import { attrString, defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';
import { Tooltip } from '@arpadroid/ui';

const html = String.raw;
class GalleryDots extends GalleryControl {
    prevItemNumber = 0;
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
            this._initializeTooltip();
        });
        this.gallery?._initializePager();
        await this.pager?.promise;
        await this.gallery?.promise;

        return true;
    }

    _onComplete() {
        requestIdleCallback(() => this._initializeTooltip());
    }

    async _initializeTooltip() {
        // console.log('this.pager?.itemsNode', this.pager?.itemsNode);
        if (this.tooltip) {
            this.pager?.itemsNode && this.tooltip.setHandler(this.pager?.itemsNode);
            return;
        }
        this.tooltip = new Tooltip({
            text: 'Thumbnails tooltip',
            className: 'galleryDots__tooltip',
            handler: /** @type {HTMLElement} */ (this.pager?.itemsNode),
            position: 'cursor',
            hasCursorPosition: true,
            onMouseTargetUpdate: target => {
                const page = this.resolvePage(target);
                if (!page) return; // @ts-ignore
                const payload = this.getItemPayloadByPage(page);
                const itemNumber = Number(target.getAttribute('data-page'));
                if (!payload?.id || this.prevItemNumber === itemNumber || itemNumber === 0) {
                    return;
                }
                this.prevItemNumber = itemNumber;
                let title = payload?.title || '';
                title && (title = `${itemNumber}. ${title}`);

                this.tooltip?.setContent(html`
                    <gallery-thumbnail
                        ${attrString({
                            imagePosition: payload?.imagePosition,
                            itemId: payload?.id,
                            title,
                            hasTitle: true,
                            image: payload?.image,
                            imageSize: 'small'
                        })}
                    ></gallery-thumbnail>
                `);
            }
        });
        await this.gallery?.promise;
        this.gallery?.appendChild(this.tooltip);
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
}

export default GalleryDots;

defineCustomElement('gallery-dots', GalleryDots);
