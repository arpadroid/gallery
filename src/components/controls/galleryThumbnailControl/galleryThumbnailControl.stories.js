/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../gallery/gallery.types.js').GalleryConfigType} GalleryConfigType
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta<GalleryConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<GalleryConfigType>} Story
 * @typedef {import('../../galleryThumbnails/galleryThumbnails.js').default} GalleryThumbnails
 */
import { playSetup, renderStatic } from '../../gallery/gallery.stories.util';
import GalleryStory from '../../gallery/gallery.stories';
import { expect, waitFor, userEvent } from 'storybook/test';

/** @type {Meta} */
const GalleryThumbnailControlStory = {
    title: 'Gallery/Controls/Thumbnails',

    render: args => renderStatic(args)
};

/** @type {Story} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'thumbnailControl',
        id: 'gallery-thumbnails'
    }
};

/** @type {Story} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-thumbnails-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas, galleryNode } = await playSetup(canvasElement);
        await step('Renders the thumbnail control and the thumbnails', async () => {
            await waitFor(() => {
                const button = canvas.getByRole('button', { name: 'Hide thumbnails' });
                expect(button).toBeInTheDocument();
                const thumbnails = /** @type {GalleryThumbnails | null} */ (
                    canvasElement.querySelector('gallery-thumbnails')
                );
                expect(thumbnails).toBeInTheDocument();
                expect(galleryNode).toHaveClass('gallery--thumbnails');
            });
        });

        await step('Selects the second item', async () => {
            /** @type {Element | undefined} */
            let item;
            await waitFor(() => {
                item = canvasElement.querySelectorAll('.galleryThumbnail')[1];
                expect(item).toBeInTheDocument();
            });
            const button = item?.querySelector('button');
            if (!button) throw new Error('Thumbnail button not found');
            await userEvent.click(button);
            await waitFor(() => {
                expect(canvas.getByText('Leonardo da Vinci')).toBeVisible();
            });
        });

        await step('Focuses on the button and displays tooltip', async () => {
            const button = canvas.getByRole('button', { name: 'Hide thumbnails' });
            button.focus();
            await waitFor(() => {
                expect(canvas.getByText('Hide thumbnails')).toBeVisible();
            });
        });

        await step('Hides the thumbnails', async () => {
            const button = canvas.getByRole('button', { name: 'Hide thumbnails' });
            await userEvent.click(button);
            await waitFor(() => {
                expect(canvas.getByText('Show thumbnails')).toBeVisible();
                expect(galleryNode).not.toHaveClass('gallery--thumbnails');
            });
        });
    }
};

export default GalleryThumbnailControlStory;
