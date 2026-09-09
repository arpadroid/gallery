/**
 * @typedef {import('./imagePreview').default} ImagePreview
 * @typedef {import('./imagePreview.types').ImagePreviewConfigType} ImagePreviewConfigType
 * @typedef {import('@storybook/web-components-vite').Meta<ImagePreviewConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<ImagePreviewConfigType>} StoryObj
 * @typedef {import('@arpadroid/ui').Button} Button
 * @typedef {import('./imagePreview').Dialog} Dialog
 * @typedef {import('@arpadroid/gallery').Gallery} Gallery
 */
import { attrString } from '@arpadroid/tools';
import { expect, waitFor, within, userEvent } from 'storybook/test';

const html = String.raw;
const captionText =
    'Besides being Picasso most famous painting, Guernica is also one of the world’s most famous and moving antiwar statements. It was inspired by the brutal 1937 bombing of the Basque city of Guernica during the Spanish Civil War. That same year, with war still raging, the embattled Leftist government of Spain commissioned the piece as a mural for the 1937 World’s Fair inParis.';

/** @type {Meta} */
const ImagePreviewStory = {
    title: 'Gallery/Components/Image Preview',
    args: {
        dialogContainer: '#storybook-root',
        id: 'image-preview',
        image: '/test-assets/artworks/guernica.jpg',
        title: 'Guernica by Pablo Picasso (1937)',
        caption: captionText
    },
    beforeEach: async ({ canvasElement }) => canvasElement.querySelector('arpa-dialogs')?.remove(),
    component: 'image-preview',
    parameters: {
        layout: 'centered'
    },
    render: args => {
        return html`
            <arpa-button icon="image">
                View image
                <image-preview ${attrString(args)}></image-preview>
            </arpa-button>
        `;
    }
};

/** @type {StoryObj} */
export const Render = {};

/** @type {StoryObj} */
export const TestSingle = {
    args: {
        id: 'image-preview-test'
    },

    play: async ({ canvasElement, step }) => {
        const arpaButton = await waitFor(() => /** @type {Button} */ (canvasElement.querySelector('arpa-button')));
        await arpaButton?.promise;
        const button = arpaButton.button;
        let dialog = /** @type {Dialog} */ (document.querySelector('#image-preview-test-dialog'));
        await dialog?.promise;
        await step('Renders the image preview button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Clicks on the button and opens the preview modal', async () => {
            button && (await userEvent.click(button));
            await waitFor(() => {
                dialog = /** @type {import('./imagePreview').Dialog} */ (
                    document.querySelector('#image-preview-test-dialog')
                );
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeInTheDocument();
            });
        });

        await step('Renders and loads the image', async () => {
            await waitFor(() => {
                const image = document.querySelector('.galleryItem__image img');
                expect(image).toBeInTheDocument();
            });
        });

        await step('Shows the caption and verifies it', async () => {
            await waitFor(() => {
                expect(within(dialog).getByText(captionText)).toBeInTheDocument();
            });
            const captionsButton = within(dialog).getByRole('button', { name: 'Show captions' });
            await userEvent.click(captionsButton);
        });

        await step('Closes the dialog', async () => {
            /** @type {Button | null} */
            const buttonComponent = dialog.querySelector('.dialog__close');
            await buttonComponent?.promise;

            const button = /** @type {HTMLButtonElement | null} */ buttonComponent?.button;
            expect(button).toBeInTheDocument();
            button && (await userEvent.click(button));
            await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
            expect(dialog).not.toBeVisible();
        });
    }
};

/** @type {StoryObj} */
export const TestMultiple = {
    args: {
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
                        <gallery-item image="/test-assets/artists/phidias.jpg" title="Phidias"></gallery-item>
                        <gallery-item
                            image="/test-assets/artworks/guernica.jpg"
                            title="Guernica by Pablo Picasso (1937)"
                            caption="${captionText}"
                        ></gallery-item>
                    </arpa-zone>
                </image-preview>
            </arpa-button>
        `;
    },
    play: async ({ canvasElement, step, canvas }) => {
        const imagePreview = /** @type {ImagePreview} */ (canvasElement.querySelector('image-preview'));
        await imagePreview?.promise;
        const gallery = /** @type {Gallery} */ (canvasElement.querySelector('arpa-gallery'));
        await gallery?.onNodesReady();

        const button = /** @type {Button} */ (canvas.getByRole('button', { name: 'Open Gallery' }));

        await step('Clicks on the button and opens the preview modal', async () => {
            expect(button).toBeInTheDocument();
            await userEvent.click(button, { delay: 50 });
            const dialog = /** @type {Dialog} */ (imagePreview.dialog);
            await waitFor(() => {
                expect(within(dialog).getByText('Phidias')).toBeInTheDocument();
            });
        });

        await step('Clicks next and shows next image', async () => {
            const dialog = imagePreview.nodes.dialog;
            const nextButton = dialog.querySelector('.galleryNext button');
            expect(nextButton).toBeInTheDocument();
            await userEvent.click(nextButton, { delay: 50 });
            await waitFor(() => {
                expect(within(dialog).getByText('Guernica by Pablo Picasso (1937)')).toBeInTheDocument();
            });
        });

        await step('Sets previous image and then closes the dialog', async () => {
            const dialog = imagePreview.nodes.dialog;
            const prevButton = dialog.querySelector('.galleryPrevious button');

            await userEvent.click(prevButton, { delay: 50 });
            await waitFor(() => {
                expect(within(dialog).getByText('Phidias')).toBeVisible();
            });
            const button = within(dialog).getByRole('button', { name: 'close' });
            await userEvent.click(button);
            await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
            expect(dialog).not.toBeVisible();
        });
    }
};

export default ImagePreviewStory;
