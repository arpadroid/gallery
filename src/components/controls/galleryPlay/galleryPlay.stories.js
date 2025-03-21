/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent } from '@storybook/test';

export const Render = {
    ...GalleryStory,
    /**
     * Renders the gallery.
     * @param {Record<string, any>} args
     * @returns {string}
     */
    render: args => GalleryStory.renderStatic(args),
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement }} args
     * @returns {Promise<void>}
     */
    play: async ({ canvasElement }) => {
        await Render.playSetup(canvasElement, false);
    },
    args: {
        ...GalleryStory.args,
        controls: 'play',
        id: 'gallery-play-test'
    }
};

const Default = {
    ...Render,
    title: 'Gallery/Controls/Play'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-play-test'
    },

    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas } = await GalleryStory.playSetup(canvasElement, false);
        const playControl = await waitFor(() => canvas.getByRole('button', { name: 'Play' }));
        await step('Renders the play control', async () => {
            expect(playControl).toBeInTheDocument();
        });
        await step('Clicks the play control and verifies state', async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            expect(
                canvas.getByRole('heading', { level: 2, name: 'Guernica by Pablo Picasso (1937)' })
            ).toBeInTheDocument();
            await fireEvent.click(playControl);

            await waitFor(() => expect(playControl).toHaveTextContent('Pause'));
            expect(playControl.querySelector('arpa-icon')).toHaveTextContent('pause');
            /** @todo Fix this flaky test if you can. */
            // await waitFor(() => {
            //     expect(canvas.getByText('Blue II by Joan Miró (1961)')).toBeVisible();
            // });
        });

        await step('Pauses playback and verifies state', async () => {
            playControl.click();
            await waitFor(() => expect(playControl).toHaveTextContent('Play'));
            expect(playControl.querySelector('arpa-icon')).toHaveTextContent('play_arrow');
        });
    }
};

export default Default;
