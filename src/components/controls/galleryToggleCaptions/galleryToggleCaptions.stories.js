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
import { expect, waitFor, userEvent } from 'storybook/test';

/** @type {Meta} */
const GalleryToggleCaptionsStory = {
    title: 'Gallery/Controls/Captions'
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'toggleCaptions',
        id: 'gallery-captions'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-captions-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas } = await playSetup(canvasElement);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Show captions' }));
        await step('Renders the captions button and checks captions are not visible', async () => {
            expect(button).toBeInTheDocument();
            const captions = canvasElement.querySelectorAll('.galleryItem__caption');
            await waitFor(() => {
                captions.forEach(caption => expect(caption).not.toBeVisible());
            });
        });

        await step('Focuses the captions button and checks the tooltip is visible', async () => {
            button.focus();
            await waitFor(() => expect(canvas.getByText('Show captions')).toBeVisible());
        });

        await step('Clicks the captions button and checks captions are visible', async () => {
            await userEvent.click(button);
            await waitFor(() => {
                expect(canvasElement.querySelector('.galleryItem__caption')).toBeInTheDocument();
            });
        });
    }
};

export default GalleryToggleCaptionsStory;
