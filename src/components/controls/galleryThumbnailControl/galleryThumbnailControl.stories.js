/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { playSetup, renderStatic } from '../../gallery/gallery.stories.util';
import GalleryStory from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent } from 'storybook/test';

/** @type {Meta} */
const GalleryThumbnailControlStory = {
    title: 'Gallery/Controls/Thumbnails',

    render: args => renderStatic(args)
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'thumbnailControl',
        id: 'gallery-thumbnails'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-thumbnails-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas, galleryNode } = await playSetup(canvasElement);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Toggle thumbnails' }));
        const thumbnails = canvasElement.querySelector('gallery-thumbnails');
        await customElements.whenDefined('gallery-thumbnails');

        await step('Renders the thumbnail control and the thumbnails', async () => {
            expect(button).toBeInTheDocument();
            expect(thumbnails).toBeInTheDocument();
            expect(galleryNode).toHaveClass('gallery--thumbnails');
        });

        await step('Selects the second item', async () => {
            /** @type {Element | undefined} */
            let item;
            await waitFor(() => {
                item = canvasElement.querySelectorAll('.galleryThumbnail')[1];
                expect(item).toBeInTheDocument();
            });
            await new Promise(resolve => setTimeout(resolve, 200));
            const button = item?.querySelector('button');
            button && fireEvent.click(button);
            await waitFor(() => {
                expect(canvas.getByText('Leonardo da Vinci')).toBeVisible();
            });
        });

        await step('Focuses on the button and displays tooltip', async () => {
            button.focus();
            await waitFor(() => {
                expect(canvas.getByText('Hide thumbnails')).toBeVisible();
            });
        });

        await step('Hides the thumbnails', async () => {
            fireEvent.click(button);
            await waitFor(() => {
                expect(canvas.getByText('Show thumbnails')).toBeVisible();
                expect(galleryNode).not.toHaveClass('gallery--thumbnails');
            });
        });
    }
};

export default GalleryThumbnailControlStory;
