/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect } from '@storybook/test';

export const PlayControl = {
    ...GalleryStory,
    // title: 'Gallery/Gallery/Controls',
    // name: 'Gallery/Gallery/Controls/Play',
    args: {
        ...GalleryStory.args,
        id: 'gallery-play-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const {canvas } = await GalleryStory.playSetup(canvasElement);

        await step('Renders the play control', async () => {
            const playControl = canvas.getByRole('button', { name: 'Play' });
            expect(playControl).toBeInTheDocument();
        });
    }
};

const Default = {
    ...PlayControl,
    title: 'Gallery/Gallery/Controls',
};

export default Default;
