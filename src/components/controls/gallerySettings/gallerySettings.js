/**
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/resources').ListFilter} ListFilter
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 * @typedef {import('@arpadroid/forms').Field} Field
 * @typedef {import('../../gallery/gallery').default} Gallery
 * @typedef {import('@arpadroid/forms').SelectCombo} SelectCombo
 * @typedef {import('@arpadroid/forms').NumberField} NumberField
 * @typedef {import('../galleryThumbnailControl/galleryThumbnailControl').default} GalleryThumbnailControl
 * @typedef {import('@arpadroid/navigation').IconMenu} IconMenu
 * @typedef {import('./gallerySettings.types').GallerySettingsType} GallerySettingsType
 * @typedef {import('../galleryThumbnailControl/galleryThumbnailControl').ThumbnailsPositionType} ThumbnailsPositionType
 * @typedef {import('@arpadroid/ui').Tooltip} Tooltip
 * @typedef {IconMenu }
 */
import { mergeObjects, attrString, defineCustomElement } from '@arpadroid/tools';
import GalleryControl from '../../galleryControl/galleryControl';

const html = String.raw;
class GallerySettings extends GalleryControl {
    /////////////////////////////
    // #region Initialization
    ////////////////////////////
    getDefaultConfig() {
        this.i18nKey = 'gallery.controls.settings';
        this.bind('onSubmit', 'updatePlayInterval', 'updateThumbnailsPosition');
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'settings',
            lblSettings: '{i18n:lblSettings}'
        });
    }

    $initializeProperties() {
        super.$initializeProperties();
        /** @type {Gallery | null} */
        this.gallery = this.closest('.arpaList, .gallery');
        /** @type {ListResource} */
        this.galleryResource = this.gallery?.listResource;
        this._initializeSettings();

        return true;
    }

    _initializeSettings() {
        /** @type {GallerySettingsType | undefined} */
        this.settings = {
            playInterval: this.getPlayInterval(),
            thumbnailsPosition: this.getThumbnailsPosition()
        };
    }

    // #endregion

    /////////////////////////////
    // #region Get
    ////////////////////////////

    /**
     * Returns the thumbnails position.
     * @returns {ThumbnailsPositionType}
     */
    getThumbnailsPosition() {
        return (
            localStorage.getItem('gallery:thumbnails-position') ||
            this.gallery?.getProp('thumbnails-position') ||
            'bottom'
        );
    }

    getPlayInterval() {
        return this.getSavedPlayInterval() || this.gallery?.getProp('play-interval') || 5;
    }

    getSavedPlayInterval() {
        const value = localStorage.getItem('gallery:playInterval');
        return value ? parseInt(value, 10) : null;
    }

    // #endregion

    /////////////////////////////
    // #region API
    ////////////////////////////

    /**
     * Updates the thumbnails position.
     * @param {ThumbnailsPositionType} value
     */
    updateThumbnailsPosition(value) {
        localStorage.setItem('gallery:thumbnails-position', value);
        /** @type {GalleryThumbnailControl | undefined | null} */
        const thumbControl = this.gallery?.querySelector('gallery-thumbnail-control');
        thumbControl?.positionThumbnails(value);
    }

    /**
     * Updates the play interval.
     * @param {number} value
     */
    updatePlayInterval(value) {
        localStorage.setItem('gallery:playInterval', String(value));
        this.gallery?.isPlaying && this.gallery?.play(false);
    }

    // #endregion

    /////////////////////////////
    // #region Rendering
    ////////////////////////////

    $renderTemplate() {
        return html`<icon-menu
            variant="compact"
            menu-position="false"
            nav-class="gallerySettings__nav"
            ${attrString({
                ...this.getProperties('icon', 'label'),
                tooltip: this.getProp('btn-label')
            })}
        >
            <arpa-zone name="tooltip"> ${this.getProp('lblSettings')} </arpa-zone>
            <arpa-zone name="nav">
                <div class="gallerySettings__content">{form}</div>
            </arpa-zone>
        </icon-menu>`;
    }

    getTemplateVars() {
        return {
            form: this.renderForm()
        };
    }

    /**
     * Renders the form for the gallery settings.
     * @returns {string} The form HTML.
     */
    renderForm() {
        const { playInterval, thumbnailsPosition } = this.settings || {};
        return html`<arpa-form
            variant="compact"
            id="${this.gallery?.getId() || 'gallery'}-filters-form"
            has-submit="false"
            class="gallerySettings__form"
        >
            <group-field open id="general" icon="settings">
                <arpa-zone name="label">${this.i18n('lblGeneral')}</arpa-zone>
                <number-field
                    class="gallerySettings__playInterval"
                    id="playInterval"
                    value="${playInterval}"
                    min="1"
                    max="60"
                >
                    <arpa-zone name="label">${this.i18n('lblPlayInterval')}</arpa-zone>
                </number-field>
                <select-combo
                    class="gallerySettings__thumbnailsPosition"
                    id="thumbnailsPosition"
                    value="${thumbnailsPosition}"
                    label="{i18n:lblThumbnailsPosition}"
                >
                    <select-option value="top">${this.i18n('lblTop')}</select-option>
                    <select-option value="bottom">${this.i18n('lblBottom')}</select-option>
                    <select-option value="left">${this.i18n('lblLeft')}</select-option>
                    <select-option value="right">${this.i18n('lblRight')}</select-option>
                </select-combo>
            </group-field>
        </arpa-form>`;
    }

    // #endregion

    /////////////////////////////
    // #region Initialize Nodes
    ////////////////////////////

    async $initializeNodes() {
        await super.$initializeNodes();

        /** @type {IconMenu | null} */
        this.menuNode = this.querySelector('icon-menu');
        await this.menuNode?.promise;
        this.menuNode?.button?.setAttribute('variant', 'compact');
        this.menuNode?.button?.setAttribute('aria-label', this.i18nText('lblSettings'));

        this.nav = this.menuNode?.navigation;
        await this.nav?.promise;

        this.tooltip = /** @type {Tooltip | null} */ (this.menuNode?.nodes?.tooltip);
        this.setTooltipPosition('top-right');
        await this._initializeForm();
        this._initializeIconMenu();

        this.playIntervalField = /** @type {NumberField | null} */ (
            this.querySelector('.gallerySettings__playInterval')
        );
        this.playIntervalField?.on('change', this.updatePlayInterval);
        /** @type {SelectCombo | null} */
        this.thumbPositionField = /** @type {SelectCombo | null} */ (
            this.querySelector('.gallerySettings__thumbnailsPosition')
        );
        this.thumbPositionField?.on('change', this.updateThumbnailsPosition);
        return true;
    }

    async _initializeIconMenu() {
        await customElements.whenDefined('icon-menu');
        this.menuNode?.promise && (await this.menuNode.promise);
        const itemsNode = this.menuNode?.navigation?.itemsNode;
        itemsNode?.setAttribute('zone', 'gallery-settings');
    }

    async _initializeForm() {
        /** @type {FormComponent | null} */
        this.form = this.nav?.querySelector('arpa-form');
        await this.form?.promise;
        this.onSubmit && this.form?.onSubmit(this.onSubmit);
        return true;
    }

    // #endregion

    /////////////////////////////
    // #region Lifecycle
    ////////////////////////////

    /**
     * Updates the list filters.
     */
    async update() {
        await this.promise;
    }

    /**
     * Handles the form submit event.
     * @type {import('@arpadroid/forms').FormSubmitType} payload - The form payload.
     */
    onSubmit(_payload) {
        return false;
    }

    // #endregion
}

defineCustomElement('gallery-settings', GallerySettings);

export default GallerySettings;
