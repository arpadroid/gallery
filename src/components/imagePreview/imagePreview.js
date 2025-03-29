/**
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('../galleryItem/galleryItem').default} GalleryItem
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('@arpadroid/ui').Dialog} Dialog
 * @typedef {import('@arpadroid/tools').ZoneToolPlaceZoneType} ZoneToolPlaceZoneType
 */
import { addZone, attrString, defineCustomElement } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class ImagePreview extends ArpaElement {
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
            controls: 'spacer,darkMode,fullScreen,toggleCaptions',
            zoneSelector: ':scope > zone'
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

    async _initializeNodes() {
        /** @type {Dialog | null} */
        this.dialog = this.querySelector('arpa-dialog');
        return true;
    }

    /**
     * Manual allocation of zones.
     * @param {ZoneToolPlaceZoneType} payload
     * @returns {boolean | ((payload: ZoneToolPlaceZoneType) => any)}
     */
    _onLostZone(payload) {
        const { zoneName } = payload;
        if (zoneName && ['title', 'caption'].includes(zoneName)) {
            return this._onZonesLoaded;
        }
        return false;
    }

    /**
     * Callback for when zones are loaded.
     * @param {ZoneToolPlaceZoneType} payload
     * @returns {Promise<boolean>}
     */
    async _onZonesLoaded({ zone }) {
        this.item = this.getItem();
        console.log('this.item', this.item);
        zone && addZone(zone, this.item, this.item?._zones);
        return true;
    }

    _getTemplate() {
        return html`<arpa-dialog id="{id}-dialog" variant="compact" size="full-screen">
            <zone name="content">
                <arpa-gallery id="{id}-gallery" controls="{controls}">{item}</arpa-gallery>
            </zone>
        </arpa-dialog>`;
    }

    renderGalleryItem() {
        const image = this.getProperty('image');
        const title = this.getProperty('title');
        const caption = this.getProperty('caption');
        if (!image) return '';
        return html`<gallery-item ${attrString({ title, caption, image })} zone="item"></gallery-item>`;
    }
}

defineCustomElement('image-preview', ImagePreview);
export default ImagePreview;
