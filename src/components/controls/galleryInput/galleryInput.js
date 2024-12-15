import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GalleryInput extends GalleryControl {
    _initialize() {
        this.bind('_onSubmit', '_onPageFilterChange', '_onItemsChange');
        super._initialize();
        this.resource.pageFilter.on('value', this._onPageFilterChange);
        this.resource.on('items', this._onItemsChange);
    }

    getDefaultConfig() {
        return {
            className: 'galleryInput'
        };
    }

    getId() {
        return this.gallery.id + '-input';
    }

    getMax() {
        return this.gallery.items.length;
    }

    render() {
        const content = html`<form variant="mini" id="${this.getId()}" is="arpa-form" class="galleryInput__form">
            <number-field id="page" value="1" min="1" variant="compact" icon=" "></number-field>
        </form>`;
        this.innerHTML = content;
    }

    _initializeNodes() {
        this.form = this.querySelector('form');
        this.form.onSubmit(this._onSubmit);
        this.inputField = this.querySelector('number-field');
    }

    _onSubmit(values) {
        this.gallery.pause();
        this.resource.goToPage(values.page);
    }

    _onPageFilterChange(page) {
        this.inputField.setValue(page);
    }

    _onItemsChange() {
        this.inputField.input.setAttribute('max', this.resource.getTotalItems());
    }
}

customElements.define('gallery-input', GalleryInput);

export default GalleryInput;
