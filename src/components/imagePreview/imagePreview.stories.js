/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 */
import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../gallery/gallery.stories';
import { expect, waitFor, fireEvent, within } from '@storybook/test';
const html = String.raw;
const captionText =
    'Besides being Picasso most famous painting, Guernica is also one of the world’s most famous and moving antiwar statements. It was inspired by the brutal 1937 bombing of the Basque city of Guernica during the Spanish Civil War. That same year, with war still raging, the embattled Leftist government of Spain commissioned the piece as a mural for the 1937 World’s Fair inParis.';
export const Render = {
    ...GalleryStory,
    parameters: {
        layout: 'centered'
    },
    args: {
        ...GalleryStory.args,
        id: 'image-preview',
        // title: 'Guernica by Pablo Picasso (1937)',
        image: '/assets/artworks/guernica.jpg'
    },
    /**
     * Renders the gallery.
     * @param {Record<string, any>} args
     * @returns {string}
     */
    render: args => {
        return html`
            <arpa-button icon="image">
                View image
                <image-preview ${attrString(args)}>
                    <zone name="title" owner="gallery-item">Guernica by Pablo Picasso (1937)</zone>
                    <zone name="caption" owner="gallery-item">${captionText}</zone>
                </image-preview>
            </arpa-button>
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
    title: 'Gallery/Image Preview'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-play-test'
    },

    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await GalleryStory.playSetup(canvasElement, false);
        const button = await waitFor(() => canvas.getByRole('button'));
        await customElements.whenDefined('arpa-dialogs');
        await step('Renders the image preview button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Clicks on the button and opens the preview modal', async () => {
            await fireEvent.click(button);
            
            await waitFor(() => {
                const dialog = /** @type {HTMLElement} */ (document.querySelector('arpa-dialog'));
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeInTheDocument();
            });
        });

        // await step('Shows the caption', async () => {
        //     const captionsButton = within(dialog).getByRole('button', { name: 'Show caption' });
        //     console.log('captionsButton', captionsButton);
        // });
    }
};

export default Default;
