/**
 * @typedef {import('../gallery/gallery.js').default} Gallery
 */
import { ListControls } from '@arpadroid/lists';

const html = String.raw;
class GalleryControls extends ListControls {
    initializeProperties() {
        /** @type {Gallery | null} */
        this.list = /** @type {Gallery | null} */ (this.closest('.arpaList, arpa-gallery'));
        this.listResource = this.list?.listResource;
        return super.initializeProperties();
    }

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

customElements.define('gallery-controls', GalleryControls);
export default GalleryControls;
