/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../gallery/gallery.stories';
import { expect, waitFor, fireEvent, within, userEvent } from 'storybook/test';
const html = String.raw;
const captionText =
    'Besides being Picasso most famous painting, Guernica is also one of the world’s most famous and moving antiwar statements. It was inspired by the brutal 1937 bombing of the Basque city of Guernica during the Spanish Civil War. That same year, with war still raging, the embattled Leftist government of Spain commissioned the piece as a mural for the 1937 World’s Fair inParis.';/** @type {StoryObj} */export const Render = {
    ...GalleryStory,
    parameters: {
        layout: 'centered'
    },
    args: {
        ...GalleryStory.args,
        id: 'image-preview',
        // title: 'Guernica by Pablo Picasso (1937)',
        image: '/test-assets/artworks/guernica.jpg'
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
    title: 'Gallery/Components/Image Preview'
};

export const TestSingle = {
    ...Render,
    args: {
        ...Render.args,
        id: 'image-preview-test'
    },

    play: async (/** @type{StoryContext} */ { canvasElement, step, canvas }) => {
        const button = canvas.getByRole('button');
        const dialog = /** @type {import('./imagePreview').Dialog} */ (document.querySelector('arpa-dialog'));

        await step('Renders the image preview button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Clicks on the button and opens the preview modal', async () => {
            await userEvent.click(button);
            await waitFor(() => {
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeInTheDocument();
            });
        });

        // await step('Shows the caption', async () => {
        //     const captionsButton = within(dialog).getByRole('button', { name: 'Show caption' });
        //     console.log('captionsButton', captionsButton);
        // });

        await step('Closes the dialog', async () => {
            /** @type {HTMLButtonElement | null} */
            const button = dialog.querySelector('.dialog__close');
            // const button = within(dialog).getByRole('button', { name: 'close' });
            expect(button).toBeInTheDocument();
            button?.click?.();
            await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
            expect(dialog).not.toBeVisible();
        });
    }
};

export const TestMultiple = {
    ...Render,
    args: {
        ...Render.args,
        id: 'image-preview-test-multiple',
        title: 'Phidias',
        image: undefined
    },
    /**
     * Renders the gallery.
     * @param {Record<string, any>} args
     * @returns {string}
     */
    render: args => {
        return html`
            <arpa-button icon="image">
                Open Gallery
                <image-preview ${attrString(args)}>
                    <!--<zone name="title" owner="gallery-item">My preview gallery</zone> -->
                    <zone name="gallery">
                        <gallery-item image="/test-assets/artists/phidias.jpg">
                            <zone name="title">Phidias</zone>
                        </gallery-item>
                        <gallery-item image="/test-assets/artworks/guernica.jpg">
                            <zone name="title">Guernica by Pablo Picasso (1937)</zone>
                            <zone name="caption">${captionText}</zone>
                        </gallery-item>
                    </zone>
                </image-preview>
            </arpa-button>
        `;
    },

    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {

        const { canvas } = await GalleryStory.playSetup(canvasElement, false);
        const button = await waitFor(() => canvas.getByRole('button'));
        const dialog = /** @type {import('./imagePreview').Dialog} */ (document.querySelector('arpa-dialog'));
        // await waitFor(() => expect(dialog.querySelector('arpa-gallery')).toBeInTheDocument());
        await step('Renders the image preview button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Clicks on the button and opens the preview modal', async () => {
            await fireEvent.click(button);
            await waitFor(() => {
                expect(within(dialog).getByText('Phidias')).toBeVisible();
            });
        });

        await step('Clicks next and shows next image', async () => {
            
            const nextButton = within(dialog).getByRole('button', { name: 'Next' });
            await fireEvent.click(nextButton);
            await waitFor(() => {
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeVisible();
            });
        });

        await step('Closes the dialog', async () => {
            const button = within(dialog).getByRole('button', { name: 'close' });
            expect(button).toBeInTheDocument();
            button.click();
            await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
            expect(dialog).not.toBeVisible();
        });
    }
};

export default Default;
