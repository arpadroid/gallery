/**
 * @typedef {import('@arpadroid/forms').NumberField} NumberField
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 */
import { attrString, defineCustomElement } from '@arpadroid/tools';
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
        this.i18nKey = 'gallery.controls.input';
        return {
            className: 'galleryInput',
            lblCurrentSlide: this.i18nText('lblCurrentSlide')
        };
    }

    getId() {
        return this.gallery?.id + '-input';
    }

    getMax() {
        return this.gallery?.getItemCount();
    }

    render() {
        const formId = `form_${this.getId()}`;
        const attr = attrString({
            value: 1,
            max: this.resource?.getTotalPages(),
            variant: 'compact',
            icon: ' '
        });
        const content = html`<arpa-form id="${formId}" variant="mini" class="galleryInput__form">
            <number-field id="page" variant="compact" value="1" min="1" enforce-value ${attr}>
                <zone name="input-wrapper">
                    <arpa-tooltip handler="#${formId}-page" position="top">
                        ${this.i18n('lblCurrentSlide')}
                    </arpa-tooltip>
                </zone>
            </number-field>
        </arpa-form>`;
        this.innerHTML = content;
        return true;
    }

    _initializeNodes() {
        /** @type {FormComponent | null} */
        this.form = this.querySelector('arpa-form'); // @ts-ignore
        this.form?.onSubmit(this._onSubmit);
        /** @type {NumberField | null} */
        this.inputField = this.querySelector('number-field');
        this.inputField?.promise.then(() => {
            const lblCurrentSlide = this.getProperty('lbl-current-slide');
            lblCurrentSlide && this.inputField?.input?.setAttribute('aria-label', lblCurrentSlide);
        });
    }

    /**
     * Handles the form submission.
     * @param {{ page?: number}} values - The form values.
     */
    _onSubmit(values = {}) {
        this.gallery?.pause();
        const totalItems = this.resource?.getTotalItems();
        if (Number(values?.page) > totalItems) {
            values.page = totalItems;
            this.inputField?.setValue(totalItems);
        }
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
        const totalItems = this.resource?.getTotalItems();
        this.inputField?.input?.setAttribute('max', totalItems);
    }
}

defineCustomElement('gallery-input', GalleryInput);

export default GalleryInput;
