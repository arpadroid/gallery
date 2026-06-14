/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../gallery/gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { attrString } from '@arpadroid/tools';
import GalleryStory from '../gallery/gallery.stories';
import { expect, waitFor, within, userEvent } from 'storybook/test';
import { playSetup } from '../gallery/gallery.stories.util';
const html = String.raw;
const captionText =
    'Besides being Picasso most famous painting, Guernica is also one of the world’s most famous and moving antiwar statements. It was inspired by the brutal 1937 bombing of the Basque city of Guernica during the Spanish Civil War. That same year, with war still raging, the embattled Leftist government of Spain commissioned the piece as a mural for the 1937 World’s Fair inParis.';

/** @type {Meta} */
const ImagePreviewStory = {
    title: 'Gallery/Components/Image Preview'
};

/** @type {StoryObj} */
export const Render = {
    parameters: {
        layout: 'centered'
    },
    args: {
        ...GalleryStory.args,
        id: 'image-preview',
        image: '/test-assets/artworks/guernica.jpg'
    },
    render: args => {
        return html`
            <arpa-button icon="image">
                View image
                <image-preview ${attrString(args)}>
                    <arpa-zone name="title">Guernica by Pablo Picasso (1937)</arpa-zone>
                    <arpa-zone name="caption">${captionText}</arpa-zone>
                </image-preview>
            </arpa-button>
        `;
    },
    play: async ({ canvasElement }) => {
        await playSetup(canvasElement, { initList: false });
    }
};

/** @type {StoryObj} */
export const TestSingle = {
    ...Render,
    args: {
        ...Render.args,
        id: 'image-preview-test'
    },

    play: async ({ canvasElement, step }) => {
        await customElements.whenDefined('delete-dialog');
        await customElements.whenDefined('arpa-dialogs');
        const button = await waitFor(() => /** @type {HTMLButtonElement} */ (canvasElement.querySelector('button')));
        let dialog = /** @type {HTMLElement} */ (document.querySelector('#image-preview-test-dialog'));
        await step('Renders the image preview button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Clicks on the button and opens the preview modal', async () => {
            await userEvent.click(button);
            await waitFor(() => {
                dialog = /** @type {import('./imagePreview').Dialog} */ (
                    document.querySelector('#image-preview-test-dialog')
                );
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeInTheDocument();
            });
        });

        await step('Renders and loads the image', async () => {
            await waitFor(() => {
                const image = document.querySelector('.listItem__image img');
                expect(image).toBeInTheDocument();
            });
        });

        // await step('Shows the caption', async () => {
        //     const captionsButton = within(dialog).getByRole('button', { name: 'Show caption' });
        //     console.log('captionsButton', captionsButton);
        // });

        await step('Closes the dialog', async () => {
            /** @type {HTMLButtonElement | null} */
            const button = dialog.querySelector('.dialog__close');
            expect(button).toBeInTheDocument();
            button?.click?.();
            await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
            expect(dialog).not.toBeVisible();
        });
    }
};

/** @type {StoryObj} */
export const TestMultiple = {
    ...Render,
    args: {
        ...Render.args,
        id: 'image-preview-test-multiple',
        title: 'Phidias',
        image: undefined
    },
    render: args => {
        return html`
            <arpa-button icon="image">
                Open Gallery
                <image-preview ${attrString(args)}>
                    <arpa-zone name="title">My preview gallery</arpa-zone>
                    <arpa-zone name="gallery">
                        <gallery-item image="/test-assets/artists/phidias.jpg" title="Phidias"> </gallery-item>
                        <gallery-item
                            image="/test-assets/artworks/guernica.jpg"
                            title="Guernica by Pablo Picasso (1937)"
                        >
                            <arpa-zone name="caption">${captionText}</arpa-zone>
                        </gallery-item>
                    </arpa-zone>
                </image-preview>
            </arpa-button>
        `;
    },
    play: async ({ canvasElement, step }) => {
        await customElements.whenDefined('image-preview');
        await customElements.whenDefined('arpa-dialogs');

        const button = await waitFor(() => /** @type {HTMLButtonElement} */ (canvasElement.querySelector('button')));
        let dialog = /** @type {HTMLElement} */ (document.querySelector('#image-preview-test-multiple-dialog'));

        await step('Renders the image preview button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Clicks on the button and opens the preview modal', async () => {
            await userEvent.click(button);
            await waitFor(() => {
                dialog = /** @type {HTMLElement} */ (document.querySelector('#image-preview-test-multiple-dialog'));
                expect(within(dialog).getByText('Phidias')).toBeVisible();
            });
        });

        await step('Clicks next and shows next image', async () => {
            const nextButton = within(dialog).getByRole('button', { name: 'Next' });
            await userEvent.click(nextButton);
            await waitFor(() => {
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeInTheDocument();
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

export default ImagePreviewStory;
