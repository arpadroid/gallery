/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent } from '@storybook/test';

export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'thumbnailControl',
        id: 'gallery-thumbnails'
    },
    play: async () => {},
    /**
     * Renders the gallery.
     * @param {Record<string, any>} args
     * @returns {string}
     */
    render: args => GalleryStory.renderStatic(args)
};

const Default = {
    ...Render,
    title: 'Gallery/Controls/Thumbnails'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-thumbnails-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas, galleryNode } = await Render.playSetup(canvasElement, false);
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
                expect(canvas.getByText('Blue II by Joan Miró (1961)')).toBeVisible();
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

export default Default;
