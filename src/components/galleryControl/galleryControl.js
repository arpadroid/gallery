import { ArpaElement } from '@arpadroid/ui';
const html = String.raw;
class GalleryControl extends ArpaElement {
    _initialize() {
        this.gallery = this.closest('arpa-gallery');
        console.log('this.gallery', this.gallery);
    }

    getDefaultConfig() {
        return super.getDefaultConfig({
            className: 'galleryControl',
            icon: 'sports_esports',
            label: 'Gallery control'
        });
    }

    render() {
        const content = html`<button
            is="icon-button"
            variant="compact"
            icon="${this.getProperty('icon')}"
            class="galleryControl__button"
            label="${this.getProperty('label')}"
        ></button>`;
        this.innerHTML = content;
    }
}

customElements.define('gallery-control', GalleryControl);
export default GalleryControl;
