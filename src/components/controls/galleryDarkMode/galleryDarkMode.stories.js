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
const GalleryDarkModeStory = {
    ...GalleryStory,
    title: 'Gallery/Controls/Dark Mode',
    args: {
        ...GalleryStory.args,
        controls: 'darkMode',
        id: 'gallery-darkMode'
    }
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory
};

/** @type {StoryObj} */
export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-darkMode-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas } = await playSetup(canvasElement);
        const darkModeControl = await waitFor(() => canvas.getByRole('button', { name: 'Dark mode' }));
        await step('Renders the Dark Mode button', async () => {
            expect(darkModeControl).toBeInTheDocument();
        });

        await step('Clicks the Dark Mode button and verifies state', async () => {
            darkModeControl.click();
            await waitFor(() => {
                expect(darkModeControl).toHaveTextContent('Light mode');
                expect(darkModeControl.querySelector('arpa-icon')).toHaveTextContent('light_mode');
                const stylesheet = document.getElementById('dark-styles');
                expect(stylesheet).toBeInTheDocument();
                expect(stylesheet).not.toHaveAttribute('disabled');
            });
        });

        await step('Clicks the Dark Mode button again and verifies state', async () => {
            darkModeControl.click();
            await waitFor(() => {
                expect(darkModeControl).toHaveTextContent('Dark mode');
                expect(darkModeControl.querySelector('arpa-icon')).toHaveTextContent('dark_mode');
                const stylesheet = document.getElementById('dark-styles');
                expect(stylesheet).toBeInTheDocument();
                expect(stylesheet).toHaveAttribute('disabled');
            });
        });
    }
};

export default GalleryDarkModeStory;
