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

import { playSetup } from '../../gallery/gallery.stories.util';
import GalleryStory from '../../gallery/gallery.stories';
import { expect, waitFor } from 'storybook/test';

/** @type {Meta} */
const GalleryFullScreenStory = {
    title: 'Gallery/Controls/Full Screen'
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        controls: 'fullScreen',
        id: 'gallery-full-screen'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-full-screen-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas } = await playSetup(canvasElement);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Enter full screen' }));
        const control = button.closest('gallery-full-screen');
        await step('Renders the full screen control', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Focuses the control and displays the tooltip', async () => {
            button.focus();
            await waitFor(() => {
                expect(canvas.getByText('Enter full screen')).toBeVisible();
            });
        });

        await step('Simulates the full screen event', async () => {
            control.onExit();
            await waitFor(() => {
                expect(canvas.getByText('Enter full screen')).toBeVisible();
            });
        });
    }
};

export default GalleryFullScreenStory;
