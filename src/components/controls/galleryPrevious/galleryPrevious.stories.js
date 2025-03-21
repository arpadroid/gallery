/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
// import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor } from '@storybook/test';

// const html = String.raw;
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'previous',
        id: 'gallery-previous'
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
    title: 'Gallery/Controls/Previous'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-previous-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await Render.playSetup(canvasElement, false);
        const prevControl = await waitFor(() => canvas.getByRole('button', { name: 'Previous' }));
        await step('Renders the previous button', async () => {
            expect(prevControl).toBeInTheDocument();
        });

        await step('Focuses on the button and verifies tooltip content', async () => {
            prevControl.focus();
            await waitFor(() => {
                expect(canvas.getByText('Previous')).toBeVisible();
            });
        });

        await step('Clicks the previous button and verifies state', async () => {
            prevControl.click();
            await waitFor(() => {
                expect(
                    canvas.getByRole('heading', { level: 2, name: 'Blue II by Joan Miró (1961)' })
                ).toBeInTheDocument();
            });
        });
    }
};

export default Default;
