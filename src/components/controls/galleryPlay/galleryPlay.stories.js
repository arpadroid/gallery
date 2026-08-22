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
import { expect, waitFor, fireEvent } from 'storybook/test';

/** @type {Meta} */
const GalleryPlayStory = {
    title: 'Gallery/Controls/Play'
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    play: async ({ canvasElement }) => {
        await playSetup(canvasElement);
    },
    args: {
        ...GalleryStory.args,
        controls: 'play',
        id: 'gallery-play-render'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-play-test'
    },
    play: async ({ canvasElement, step }) => {
        const { canvas } = await playSetup(canvasElement);
        const playControl = await waitFor(() => canvas.getByRole('button', { name: 'Play' }));
        await step('Renders the play control', async () => {
            expect(playControl).toBeInTheDocument();
        });
        await step('Clicks the play control and verifies state', async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            expect(
                canvas.getByRole('heading', { level: 2, name: 'Phidias' })
            ).toBeInTheDocument();
            await fireEvent.click(playControl);
            await waitFor(() => expect(playControl).toHaveTextContent('Pause'));
            expect(playControl.querySelector('arpa-icon')).toHaveTextContent('pause');
            await waitFor(() => {
                expect(canvas.getByText('Leonardo da Vinci')).toBeVisible();
            });
        });

        await step('Pauses playback and verifies state', async () => {
            playControl.click();
            await waitFor(() => expect(playControl).toHaveTextContent('Play'));
            expect(playControl.querySelector('arpa-icon')).toHaveTextContent('play_arrow');
        });
    }
};

export default GalleryPlayStory;
