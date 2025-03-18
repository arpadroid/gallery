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
        controls: 'fullScreen',
        id: 'gallery-full-screen'
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
    title: 'Gallery/Controls/Full Screen'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-full-screen-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await Render.playSetup(canvasElement, false);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Toggle full screen' }));
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

export default Default;
