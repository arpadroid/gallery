import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GalleryInput extends GalleryControl {
    getDefaultConfig() {
        return {
            className: 'galleryInput'
            // icon: 'add_a_photo',
            // label: 'Input',
            // labelPosition: 'bottom'
        };
    }

    render() {
        const content = html`<form is="arpa-form" class="galleryInput__form">
            <number-field id="currentItem" value="1" min="1" max="10" label="Current item"></number-field>
        </form>`;
        this.innerHTML = content;
    }
}

customElements.define('gallery-input', GalleryInput);

export default GalleryInput;
