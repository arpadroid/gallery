/**
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('@arpadroid/list-manager').ListControlsConfigType} ListControlsConfigType
 */
import { ListControls } from '@arpadroid/list-manager';
import { defineCustomElement, mergeObjects } from '@arpadroid/tools';
import { getArpaElementWithTag } from '@arpadroid/ui';

const html = String.raw;
class GalleryControls extends ListControls {
    async $initializeProperties() {
        await super.$initializeProperties();
        /** @type {Gallery | null} */
        this.list = /** @type {Gallery | null} */ (this.getList());
        this.listResource = this.list?.listResource;
        return true;
    }

    /**
     * Returns the list component.
     * @returns {Gallery | null}
     */
    getList() {
        return /** @type {Gallery | null} */ (getArpaElementWithTag(this, 'arpa-gallery'));
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
