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
const GalleryToggleControlsStory = {
    title: 'Gallery/Controls/Toggle Controls',
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'toggleControls',
        id: 'gallery-toggle-controls'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-toggle-controls-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas } = await playSetup(canvasElement);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Hide controls' }));

        await step('Renders the toggle control', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Focuses the toggle control and displays tooltip', async () => {
            button.focus();
            await waitFor(() => {
                expect(canvas.getByText('Hide controls')).toBeVisible();
            });
        });

        await step('Clicks the toggle control and hides the controls', async () => {
            const controls = canvasElement.querySelector('gallery-controls');
            expect(controls).toBeVisible();
            expect(canvas.getByText('Hide controls')).toBeVisible();
            button.click();
            await waitFor(() => {
                expect(controls).not.toBeVisible();
            });
        });

        await step('Clicks on the gallery and shows the controls', async () => {
            const controls = canvasElement.querySelector('gallery-controls');
            expect(controls).not.toBeVisible();
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            button.dispatchEvent(event);
            await waitFor(() => {
                expect(controls).toBeVisible();
            });
        });
    }
};

export default GalleryToggleControlsStory;
