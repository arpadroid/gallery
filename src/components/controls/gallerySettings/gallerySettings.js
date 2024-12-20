/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @typedef {import('@arpadroid/resources/src').ListResource} ListResource
 * @typedef {import('@arpadroid/resources/src').ListFilter} ListFilter
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 * @typedef {import('@arpadroid/forms').Field} Field
 * @typedef {import('../../gallery/gallery').default} Gallery
 */
import { mergeObjects, attrString } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class GallerySettings extends ArpaElement {
    // #region INITIALIZATION
    getDefaultConfig() {
        this.bind('onSubmit', 'updatePlayInterval', 'updateThumbnailsPosition');
        return mergeObjects(super.getDefaultConfig(), {
            icon: 'settings'
        });
    }

    initializeProperties() {
        super.initializeProperties();
        /** @type {Gallery} */
        this.gallery = this.closest('.arpaList, .gallery');
        /** @type {ListResource} */
        this.galleryResource = this.list?.listResource;
        this._initializeSettings();

        return true;
    }

    _initializeSettings() {
        this.settings = {
            playInterval: this.getPlayInterval(),
            thumbnailsPosition: this.getThumbnailsPosition()
        };
    }

    getThumbnailsPosition() {
        return (
            localStorage.getItem('gallery:thumbnails-position') ||
            this.gallery.getProperty('thumbnails-position') ||
            'bottom'
        );
    }

    updateThumbnailsPosition(value) {
        localStorage.setItem('gallery:thumbnails-position', value);
        const thumbControl = this.gallery.querySelector('gallery-thumbnail-control');
        thumbControl.positionThumbnails(value);
    }

    getPlayInterval() {
        return this.getSavedPlayInterval() || this.gallery?.getProperty('play-interval') || 5;
    }

    getSavedPlayInterval() {
        const value = localStorage.getItem('gallery:playInterval');
        return value ? parseInt(value, 10) : null;
    }

    updatePlayInterval(value) {
        localStorage.setItem('gallery:playInterval', value);
        this.gallery.isPlaying && this.gallery.play(false);
    }

    async render() {
        const props = {
            ...this.getProperties('icon', 'label'),
            tooltip: this.getProperty('btn-label')
        };
        this.innerHTML = html`<icon-menu menu-position="false" ${attrString(props)} nav-class="gallerySettings__nav">
            <div class="gallerySettings__content">${this.renderForm()}</div>
        </icon-menu>`;
        this.menuNode = this.querySelector('icon-menu');
        this._initializeForm();
        this._initializeIconMenu();
    }

    async _initializeIconMenu() {
        await customElements.whenDefined('icon-menu');
        await this.menuNode.promise;
        const itemsNode = this.menuNode?.navigation?.itemsNode;
        itemsNode?.setAttribute('zone', 'gallery-settings');
    }

    async _initializeForm() {
        /** @type {FormComponent} */
        this.form = this.querySelector('.gallerySettings__form');
        await this.form?.promise;
        this.form?.onSubmit(this.onSubmit);
    }

    /**
     * Renders the form for the gallery settings.
     * @returns {string} The form HTML.
     */
    renderForm() {
        const { playInterval, thumbnailsPosition } = this.settings;
        return html`<form
            variant="compact"
            id="${this.gallery.getId()}-filters-form"
            has-submit="false"
            is="arpa-form"
            class="gallerySettings__form"
        >
            <number-field
                class="gallerySettings__playInterval"
                id="playInterval"
                label="Play interval"
                value="${playInterval}"
                min="1"
                max="60"
            ></number-field>
            <select-combo
                class="gallerySettings__thumbnailsPosition"
                id="thumbailsPosition"
                label="Thumbnails position"
                value="${thumbnailsPosition}"
            >
                <select-option value="top">Top</select-option>
                <select-option value="bottom">Bottom</select-option>
                <select-option value="left">Left</select-option>
                <select-option value="right">Right</select-option>
            </select-combo>
        </form>`;
    }

    _initializeNodes() {
        this.playIntervalField = this.querySelector('.gallerySettings__playInterval');
        this.playIntervalField?.on('change', this.updatePlayInterval);
        this.thumbPositionField = this.querySelector('.gallerySettings__thumbnailsPosition');
        this.thumbPositionField?.on('change', this.updateThumbnailsPosition);
    }

    /**
     * Updates the list filters.
     */
    async update() {
        await this.promise;
    }

    onSubmit(payload) {
        console.log('payload', payload);
    }

    // #endregion

    // #region ACCESSORS

    // #endregion
}

customElements.define('gallery-settings', GallerySettings);

export default GallerySettings;
