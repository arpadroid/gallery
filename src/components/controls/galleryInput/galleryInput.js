/**
 * @typedef {import('@arpadroid/forms').NumberField} NumberField
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GalleryInput extends GalleryControl {
    _initialize() {
        this.bind('_onSubmit', '_onPageFilterChange', '_onItemsChange');
        super._initialize();
        this.resource?.pageFilter?.on('value', this._onPageFilterChange);
        this.resource?.on('items', this._onItemsChange);
    }

    getDefaultConfig() {
        return {
            className: 'galleryInput'
        };
    }

    getId() {
        return this.gallery?.id + '-input';
    }

    getMax() {
        return this.gallery?.getItemCount();
    }

    render() {
        const content = html`<form variant="mini" id="${this.getId()}" is="arpa-form" class="galleryInput__form">
            <number-field id="page" value="1" min="1" variant="compact" icon=" "></number-field>
        </form>`;
        this.innerHTML = content;
        return true;
    }

    _initializeNodes() {
        this.form = this.querySelector('form');
        this.form?.onSubmit(this._onSubmit);
        /** @type {NumberField | null} */
        this.inputField = this.querySelector('number-field');
    }

    /**
     * Handles the form submission.
     * @param {{ page?: number}} values - The form values.
     */
    _onSubmit(values) {
        this.gallery?.pause();
        values.page && this.resource?.goToPage(values.page);
    }

    /**
     * Handles the page filter change.
     * @param {number} page - The new page.
     */
    _onPageFilterChange(page) {
        this.inputField?.setValue(page);
    }

    _onItemsChange() {
        this.inputField?.input?.setAttribute('max', this.resource?.getTotalItems());
    }
}

defineCustomElement('gallery-input', GalleryInput);

export default GalleryInput;
