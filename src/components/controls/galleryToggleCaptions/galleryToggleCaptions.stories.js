/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor } from '@storybook/test';

export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'toggleCaptions',
        id: 'gallery-captions'
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
    title: 'Gallery/Controls/Captions'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-captions-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await Render.playSetup(canvasElement, false);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Show captions' }));
        await step('Renders the captions button and checks captions are not visible', async () => {
            expect(button).toBeInTheDocument();
            const captions = canvasElement.querySelectorAll('.galleryItem__caption');
            captions.forEach(caption => expect(caption).not.toBeVisible());
        });

        await step('Focuses the captions button and checks the tooltip is visible', async () => {
            button.focus();
            await waitFor(() => expect(canvas.getByText('Show captions')).toBeVisible());
        });

        await step('Clicks the captions button and checks captions are visible', async () => {
            button.click();
            await waitFor(() => expect(canvasElement.querySelector('.galleryItem__caption')).toBeVisible());
        });
    }
};

export default Default;
