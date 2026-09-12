/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('@arpadroid/ui').IconButton} IconButton
 */
import { playSetup } from '../../gallery/gallery.stories.util';
import GalleryStory from '../../gallery/gallery.stories';
import { expect, waitFor, userEvent } from 'storybook/test';

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
        const btnComponent = /** @type {IconButton} */ (canvasElement.querySelector('.galleryControl__button'));
        await btnComponent.promise;
        await step('Renders the Dark Mode button', async () => {
            const btn = canvas.getByRole('button', { name: 'Dark mode' });
            expect(btn).toBeInTheDocument();
        });

        await step('Clicks the Dark Mode button and verifies state', async () => {
            const btn = canvas.getByRole('button', { name: 'Dark mode' });
            expect(btn).toHaveTextContent('Dark mode');

            await userEvent.click(btn, { delay: 100 });
            await waitFor(() => {
                expect(btn).toHaveTextContent('Light mode');
                expect(btn.querySelector('arpa-icon')).toHaveTextContent('light_mode');
                const stylesheet = document.getElementById('dark-styles');
                expect(stylesheet).toBeInTheDocument();
                expect(stylesheet).not.toHaveAttribute('disabled');
            });
        });

        await step('Clicks the Dark Mode button again and verifies state', async () => {
            const btn = canvas.getByRole('button', { name: 'Dark mode' });
            await userEvent.click(btn, { delay: 200 });
            await waitFor(() => {
                expect(btn).toHaveTextContent('Dark mode');
                expect(btn.querySelector('arpa-icon')).toHaveTextContent('dark_mode');
                const stylesheet = document.getElementById('dark-styles');
                expect(stylesheet).toBeInTheDocument();
                expect(stylesheet).toHaveAttribute('disabled');
            });
        });
    }
};

export default GalleryDarkModeStory;
