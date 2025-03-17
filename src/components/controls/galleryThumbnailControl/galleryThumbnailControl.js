/**
 * @typedef {import('./galleryThumbnailControl.types').GalleryThumbnailControlConfigType} GalleryThumbnailControlConfigType
 * @typedef {import('./galleryThumbnailControl.types').ThumbnailsPositionType} ThumbnailsPositionType
 * @typedef {import('../../gallery/gallery').GallerySettings} GallerySettings
 */
/* eslint-disable sonarjs/no-duplicate-string */
import { defineCustomElement, renderNode } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GalleryThumbnailControl extends GalleryControl {
    /**
     * Returns the default configuration for the gallery control.
     * @returns {GalleryThumbnailControlConfigType} The default configuration.
     */
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.thumbnails';
        return {
            className: 'galleryThumbnailControl',
            icon: 'view_carousel',
            label: this.i18n('lblShowThumbnails'),
            labelText: this.i18n('lblToggleThumbnails'),
            labelHide: this.i18n('lblHideThumbnails'),
            labelPosition: 'bottom',
            thumbnailsPosition: 'left'
        };
    }

    _initialize() {
        super._initialize();
        this.isActive = false;
        this._initializeThumbnails();
    }

    _initializeThumbnails() {
        this.thumbnails && this.thumbnails.remove();
        this.thumbnails = renderNode(this.renderThumbnails());
        this.gallery?.append(this.thumbnails);
        this.positionThumbnails();
    }

    /**
     * Returns the position of the thumbnails.
     * @returns {Promise<ThumbnailsPositionType>}
     */
    async getThumbnailPosition() {
        const settingsNode = this.gallery?.getSettingsNode();
        return settingsNode?.getThumbnailsPosition() || 'bottom';
    }

    /**
     * Positions the thumbnails.
     * @param {ThumbnailsPositionType} [position]
     */
    async positionThumbnails(position) {
        await customElements.whenDefined('gallery-settings');
        !position && (position = await this.getThumbnailPosition());
        this.gallery?.controls?.promise && (await this.gallery.controls.promise);
        if (position === 'bottom') {
            this.gallery?.footerNode?.append(this.thumbnails);
        } else if (position === 'top') {
            this.gallery?.headerNode?.prepend(this.thumbnails);
        } else {
            this.gallery?.append(this.thumbnails);
        }
        this.thumbnails.setAttribute('position', position);
    }

    renderThumbnails() {
        this.gallery?.classList.add('gallery--thumbnails');
        const id = `${this.resource?.id}-thumbnails`;
        const position =
            this.gallery?.getProperty('thumbnails-position') || this.getProperty('thumbnails-position') || 'bottom';
        return html`<gallery-thumbnails position="${position}" id=${id}></gallery-thumbnails>`;
    }

    _onClick() {
        if (this.isActive) {
            this.gallery?.classList.remove('gallery--thumbnails');
            this.isActive = false;
            this.button?.setLabel(this.getProperty('label'));
        } else {
            this.gallery?.classList.add('gallery--thumbnails');
            this.button?.setLabel(this.getProperty('label-hide'));
            this.isActive = true;
        }
    }
}

defineCustomElement('gallery-thumbnail-control', GalleryThumbnailControl);

export default GalleryThumbnailControl;
