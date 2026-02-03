/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
// import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor } from 'storybook/test';

// const html = String.raw;
/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'next',
        id: 'gallery-next'
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
    title: 'Gallery/Controls/Next'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-next-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await Render.playSetup(canvasElement, false);
        const prevControl = await waitFor(() => canvas.getByRole('button', { name: 'Next' }));
        await step('Renders the next button', async () => {
            expect(prevControl).toBeInTheDocument();
        });

        await step('Focuses on the button and verifies tooltip content', async () => {
            prevControl.focus();
            await waitFor(() => {
                expect(canvas.getByText('Next')).toBeVisible();
            });
        });

        await step('Clicks the next button and verifies state', async () => {
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
