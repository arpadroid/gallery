import { ListControls } from '@arpadroid/lists';

const html = String.raw;
class GalleryControls extends ListControls {
    initializeProperties() {
        this.list = this.closest('.arpaList, arpa-gallery');
        this.listResource = this.list?.listResource;
        super.initializeProperties();
    }

    getDefaultConfig() {
        this.list = this.getList();
        return {
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
