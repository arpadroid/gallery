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
import { expect, waitFor } from 'storybook/test';

/** @type {Meta} */
const GalleryNextStory = {
    ...GalleryStory,
    title: 'Gallery/Controls/Next'
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'next',
        id: 'gallery-next'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-next-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas } = await playSetup(canvasElement);
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

export default GalleryNextStory;
