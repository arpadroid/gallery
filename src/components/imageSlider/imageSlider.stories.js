/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../gallery/gallery.js').default} Gallery

 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./imageSlider.types').ImageSliderConfigType} ImageSliderConfigType
 */

import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../gallery/gallery.stories';
import { expect, waitFor, fireEvent, within } from '@storybook/test';
const html = String.raw;
export const Render = {
    ...GalleryStory,
    parameters: {
        layout: 'flexColumn'
    },
    args: {
        // ...GalleryStory.args,
        id: 'image-slider'
        // title: 'Guernica by Pablo Picasso (1937)',
        //image: '/assets/artworks/guernica.jpg'
    },
    /**
     * Renders the gallery.
     * @param {Record<string, any>} args
     * @returns {string}
     */
    render: args => {
        return html`
            <image-slider ${attrString(args)}>
                <slider-item
                    id="gallery-item-1"
                    title="Atenas"
                    image="/api/image/convert?source=%2Fcmsx%2Fassets%2Fhqrvutmy_museovaquero_assets%2Fgallery%2Fimages%2F693.jpg&width=[width]&height=[height]&quality=[quality]"
                >
                    <zone name="caption"> </zone>
                </slider-item>
                <slider-item
                    id="gallery-item-2"
                    title="Venecia. Vista de la laguna con la isla del cementerio, 1954"
                    image="/api/image/convert?source=%2Fcmsx%2Fassets%2Fhqrvutmy_museovaquero_assets%2Fgallery%2Fimages%2F689.jpg&width=[width]&height=[height]&quality=[quality]"
                >
                    <zone name="caption"> </zone>
                </slider-item>
            </image-slider>
        `;
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement }} args
     * @returns {Promise<void>}
     */
    play: async ({ canvasElement }) => {
        await Render.playSetup(canvasElement, false);
    }
};

const Default = {
    ...Render,
    title: 'Gallery/Components/Image Slider'
};

export default Default;

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'image-slider-test'
    },

    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await GalleryStory.playSetup(canvasElement, false);
        console.log('canvas', canvas);
        await step('Renders the image preview button', async () => {});
    }
};
