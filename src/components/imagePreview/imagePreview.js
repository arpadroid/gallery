/**
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('@arpadroid/ui').Dialog} Dialog
 * @typedef {import('@arpadroid/ui').ArpaZone} ArpaZone
 * @typedef {import('../gallery/gallery.js').default} Gallery
 */
import { defineCustomElement } from '@arpadroid/tools';
import { ArpaElement } from '@arpadroid/ui';

const html = String.raw;
class ImagePreview extends ArpaElement {
    /** @type {Dialog | undefined} */ // @ts-ignore
    dialog = this.dialog;

    /**
     * Returns the default configuration for the image preview.
     * @returns {ImagePreviewConfigType}
     */
    getDefaultConfig() {
        /** @type {ImagePreviewConfigType} */
        const config = {
            id: 'imagePreview',
            className: 'imagePreview',
            handler: undefined,
            controls: 'play,previous,input,next,spacer,darkMode,fullScreen,toggleCaptions'
        };
        return super.getDefaultConfig(config);
    }

    $renderTemplate() {
        return html`
            <arpa-node
                id="{id}-dialog"
                name="dialog"
                tag="arpa-dialog"
                variant="compact"
                size="full-screen"
                container="{dialogContainer}"
            >
                <arpa-node
                    tag="arpa-gallery"
                    name="gallery"
                    id="{id}-gallery"
                    controls="{controls}"
                    zone-target=".arpaList__items"
                >
                    ${(this.getProp('image') &&
                        html`<gallery-item
                            name="item"
                            can-render
                            title="{title}"
                            caption="{caption}"
                            image="{image}"
                            zone="item"
                        ></gallery-item>`) ||
                    ''}
                </arpa-node>
            </arpa-node>
        `;
    }

    async $onComplete() {
        await this.waitForArpaNodes();
        this.dialog = /** @type {Dialog | undefined} */ (this.nodes.dialog);
        const gallery = /** @type {Gallery | undefined} */ (this.dialog?.nodes?.gallery);
        if (gallery) {
            this.gallery = this.nodes.gallery = gallery;
        }
        return true;
    }
}

defineCustomElement('image-preview', ImagePreview);
export default ImagePreview;
