import { ListControls } from '@arpadroid/lists';

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
}

customElements.define('gallery-controls', GalleryControls);
export default GalleryControls;
