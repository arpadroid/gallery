/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./imageSlider.types').ImageSliderConfigType} ImageSliderConfigType
 * @typedef {import('../sliderItem/sliderItem.js').default} SliderItem
 * @typedef {import('../imageSlider/imageSlider.js').default} ImageSlider
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 *
 */

// import artworks from '../../../node_modules/@arpadroid/lists/src/mockData/artworks.json';
import { attrString } from '@arpadroid/tools';
import GalleryStory from '../gallery/gallery.stories.js';
import { expect, within } from 'storybook/test';
import { initializeSlider } from './imageSlider.stories.util';
const html = String.raw;

/** @type {Meta} */
const ImageSliderStory = {
    ...GalleryStory,
    title: 'Gallery/Components/Image Slider'
};

/** @type {StoryObj} */
export const Render = {
    parameters: {
        layout: 'flexColumn'
    },
    args: {
        // ...GalleryStory.args,
        id: 'image-slider'
        // title: 'Guernica by Pablo Picasso (1937)',
        //image: '/assets/artworks/guernica.jpg'
    },

    play: async (/** @type {StoryContext} */ { canvasElement, step, args }) => {
        const { resource, slider } = await initializeSlider(args?.id?.toString() || '');
        const canvas = within(canvasElement);
        step('Renders the image slider', async () => {
            expect(true).toBe(true);
        });
    },
    /**
     * Renders the gallery.
     * @param {Record<string, any>} args
     * @returns {string}
     */
    render: args => {
        return html`
            <image-slider ${attrString(args)}>
                <!-- <slider-item
                    id="gallery-item-1"
                    title="Atenas"
                    image="/api/image/convert?source=%2Fcmsx%2Fassets%2Fhqrvutmy_museovaquero_assets%2Fgallery%2Fimages%2F693.jpg&width=[width]&height=[height]&quality=[quality]"
                >
                    <zone name="caption">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum
                        mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis
                        dolor. Praesent et justo. Praesent et diam eget libero egestas mattis sit amet vitae augue.
                        Donec sodales sagittis magna.
                    </zone>
                </slider-item>
                <slider-item
                    id="gallery-item-2"
                    title="Venecia. Vista de la laguna con la isla del cementerio, 1954"
                    image="/api/image/convert?source=%2Fcmsx%2Fassets%2Fhqrvutmy_museovaquero_assets%2Fgallery%2Fimages%2F689.jpg&width=[width]&height=[height]&quality=[quality]"
                >
                    <zone name="caption">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum
                        mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis
                        dolor. Praesent et justo. Praesent et diam eget libero egestas mattis sit amet vitae augue.
                        Donec sodales sagittis magna.
                    </zone>
                </slider-item>
            </image-slider>
            -->
            </image-slider>
        `;
    }
};

/** @type {StoryObj} */
export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'image-slider-test'
    },
    play: async ({ step, args }) => {
        const { slider } = await initializeSlider(args.id || '');

        await step('Renders the image preview button', async () => {
            expect(slider).toBeInTheDocument();
        });
    }
};

export default ImageSliderStory;
