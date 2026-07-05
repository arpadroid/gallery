/**
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('@arpadroid/list-manager').ListControlsConfigType} ListControlsConfigType
 */
import { ListControls } from '@arpadroid/list-manager';
import { defineCustomElement } from '@arpadroid/tools';

const html = String.raw;
class GalleryControls extends ListControls {
    $initializeProperties() {
        /** @type {Gallery | null} */
        this.list = /** @type {Gallery | null} */ (this.closest('.arpaList, arpa-gallery'));
        this.listResource = this.list?.listResource;
        return super.$initializeProperties();
    }

    /**
     * Returns default config.
     * @returns {ListControlsConfigType}
     */
    getDefaultConfig() {
        this.list = this.getList();
        return {
            ...super.getDefaultConfig(),
            className: 'listControls',
            controls: this.list?.getControls()
        };
    }

    renderFilters() {
        return html`<list-filters></list-filters>`;
    }
}

defineCustomElement('gallery-controls', GalleryControls);

export default GalleryControls;
