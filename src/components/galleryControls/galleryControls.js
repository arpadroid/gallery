/**
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('@arpadroid/list-manager').ListControlsConfigType} ListControlsConfigType
 */
import { ListControls } from '@arpadroid/list-manager';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';

const html = String.raw;
class GalleryControls extends ListControls {
    
    async $initializeProperties() {
        await super.$initializeProperties();
        /** @type {Gallery | null} */
        this.list = /** @type {Gallery | null} */ (this.closest('.arpaList, arpa-gallery'));
        this.listResource = this.list?.listResource;
        return true;
    }

    /**
     * Returns default config.
     * @returns {ListControlsConfigType}
     */
    getDefaultConfig() {
        this.list = this.getList();
        return mergeObjects(super.getDefaultConfig(), {
            className: 'listControls'
        });
    }

    renderFilters() {
        return html`<list-filters></list-filters>`;
    }
}

defineCustomElement('gallery-controls', GalleryControls);

export default GalleryControls;
