/**
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('../galleryItem/galleryItem').default} GalleryItem
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('@arpadroid/ui').Dialog} Dialog
 * @typedef {import('@arpadroid/tools').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 */
import { insertZone, attrString, defineCustomElement } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class ImagePreview extends ArpaElement {
    /** @type {Dialog | undefined} */ // @ts-ignore
    dialog = this.dialog;
    _initializeContent() {
        super._initializeContent();
    }
    /**
     * Returns the default configuration for the image preview.
     * @returns {ImagePreviewConfigType}
     */
    getDefaultConfig() {
        this.bind('_onZonesLoaded');
        /** @type {ImagePreviewConfigType} */
        const config = {
            id: 'imagePreview',
            className: 'imagePreview',
            handler: undefined,
            controls: 'previous,input,next,spacer,darkMode,fullScreen,toggleCaptions,drag'
        };
        return super.getDefaultConfig(config);
    }

    getTemplateVars() {
        return {
            ...super.getTemplateVars(),
            item: this.renderGalleryItem(),
            id: this.getProperty('id') || 'imagePreview',
            controls: this.getProperty('controls')
        };
    }

    /**
     * Returns the item node.
     * @returns {GalleryItem | null | undefined}
     */
    getItem() {
        return this.item || this.dialog?.querySelector('gallery-item');
    }

    /**
     * Manual allocation of zones.
     * @param {ZoneToolPlaceZoneType} payload
     * @returns {boolean | ((payload: ZoneToolPlaceZoneType) => any)}
     */
    _onLostZone({ zoneName }) {
        return zoneName && ['title', 'caption', 'gallery'].includes(zoneName) ? this._onZonesLoaded : false;
    }

    /**
     * Callback for when zones are loaded.
     * @param {ZoneToolPlaceZoneType} payload
     */
    _onZonesLoaded({ zone, zoneName }) {
        this.item = this.getItem();
        /** @type {Gallery | null} */
        this.gallery = this.dialog?.querySelector('arpa-gallery');
        const itemCount = Number(this.gallery?.getItemCount());
        if (zoneName === 'title' && itemCount < 2) {
            zone && insertZone(zone, this.dialog);
        } else if (zoneName === 'caption') {
            zone && insertZone(zone, this.item);
        } else if (zoneName === 'gallery') {
            const children = /** @type {HTMLElement []} */ (Array.from(zone?.childNodes || []));
            this.gallery?.addChildNodes(children);
        }
    }

    _getTemplate() {
        return html`<arpa-dialog class="imagePreview__dialog" id="{id}-dialog" variant="compact" size="full-screen">
            <zone name="content">
                <arpa-gallery id="{id}-gallery" controls="{controls}" zone="gallery">{item}</arpa-gallery>
            </zone>
        </arpa-dialog>`;
    }

    renderGalleryItem() {
        const image = this.getProperty('image');
        const title = this.getProperty('title') || '';
        const caption = this.getProperty('caption');
        if (!image) return '';
        return html`<gallery-item ${attrString({ title, caption, image })} zone="item"></gallery-item>`;
    }
}

defineCustomElement('image-preview', ImagePreview);
export default ImagePreview;
