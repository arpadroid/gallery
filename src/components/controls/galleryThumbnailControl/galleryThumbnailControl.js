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
            label: this.i18n('lblHideThumbnails'),
            labelText: this.i18nText('lblToggleThumbnails'),
            labelHide: this.i18n('lblHideThumbnails'),
            labelPosition: 'bottom',
            thumbnailsPosition: 'left',
            isActive: true
        };
    }

    _initialize() {
        super._initialize();
        this.isActive = this.getProperty('is-active');
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
    async getThumbnailsPosition() {
        const settingsNode = this.gallery?.getSettingsNode();
        return (
            (typeof settingsNode?.getThumbnailsPosition === 'function' && settingsNode?.getThumbnailsPosition()) ||
            this.gallery?.getProperty('thumbnails-position') ||
            this.getProperty('thumbnails-position') ||
            'bottom'
        );
    }

    /**
     * Positions the thumbnails.
     * @param {ThumbnailsPositionType} [position]
     */
    async positionThumbnails(position) {
        await customElements.whenDefined('gallery-settings');
        !position && (position = await this.getThumbnailsPosition());
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
        const position = this.getThumbnailsPosition();
        return html`<gallery-thumbnails position="${position}" id=${id}></gallery-thumbnails>`;
    }

    _onClick() {
        if (this.isActive) {
            this.gallery?.classList.remove('gallery--thumbnails');
            this.isActive = false;
            this.buttonComponent?.setTooltip(this.i18n('lblShowThumbnails'));
        } else {
            this.gallery?.classList.add('gallery--thumbnails');
            this.buttonComponent?.setTooltip(this.i18n('lblHideThumbnails'));
            this.isActive = true;
        }
    }
}

defineCustomElement('gallery-thumbnail-control', GalleryThumbnailControl);

export default GalleryThumbnailControl;
