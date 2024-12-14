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
    renderPlay() {
        return html`<gallery-play></gallery-play>`;
    }

    renderPrevious() {
        return html`<gallery-previous></gallery-previous>`;
    }

    renderInput() {
        return html`<gallery-input></gallery-input>`;
    }

    renderNext() {
        return html`<gallery-next></gallery-next>`;
    }

    renderThumbnailControl() {
        return html`<gallery-thumbnail-control></gallery-thumbnail-control>`;
    }

    renderFullScreen() {
        return html`<gallery-full-screen></gallery-full-screen>`;
    }
}

customElements.define('gallery-controls', GalleryControls);
export default GalleryControls;
