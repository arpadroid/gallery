/**
 * @typedef {import('@arpadroid/forms').NumberField} NumberField
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 */
import { defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GalleryInput extends GalleryControl {
    $initialize() {
        this.bind('_onSubmit', '_onPageFilterChange', '_onItemsChange');
        super.$initialize();
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

    getTotalPages() {
        return this.resource?.getTotalPages();
    }

    $renderTemplate() {
        return html`<arpa-form id="{getId()}" variant="mini" class="galleryInput__form">
            <number-field id="page" icon=" " variant="compact" value="1" min="1" max="{getTotalPages()}" enforce-value>
                <arpa-zone name="input-wrapper">
                    <arpa-tooltip handler="#{getId()}-page" position="top">
                        ${this.i18n('lblCurrentSlide')}
                    </arpa-tooltip>
                </arpa-zone>
            </number-field>
        </arpa-form>`;
    }

    async $initializeNodes() {
        /** @type {FormComponent | null} */
        this.form = this.querySelector('arpa-form'); // @ts-ignore
        this.form?.onSubmit(this._onSubmit);
        this.inputField = /** @type {NumberField | null} */ (this.querySelector('number-field'));
        this.inputField?.promise.then(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            const lblCurrentSlide = this.getProp('lbl-current-slide');
            lblCurrentSlide && this.inputField?.input?.setAttribute('aria-label', lblCurrentSlide);
        });
        return true;
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

    async $onComplete() {
        await super.$onComplete();
        const itemCount = this.gallery?.getItemCount() || 0;
        itemCount < 2 && this.remove();
    }
}

defineCustomElement('gallery-input', GalleryInput);

export default GalleryInput;
