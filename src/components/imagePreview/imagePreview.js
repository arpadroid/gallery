/**
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('@arpadroid/ui').Dialog} Dialog
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
            controls: 'previous,input,next,spacer,darkMode,fullScreen,toggleCaptions,drag'
        };
        return super.getDefaultConfig(config);
    }

    $renderTemplate() {
        return html`<arpa-node name="dialog" tag="arpa-dialog" id="{id}-dialog" variant="compact" size="full-screen">
            <arpa-zone name="content">
                <arpa-gallery id="{id}-gallery" controls="{controls}" zone="gallery" zone-target=".arpaList__items">
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
                </arpa-gallery>
            </arpa-zone>
        </arpa-node>`;
    }
}

defineCustomElement('image-preview', ImagePreview);
export default ImagePreview;
