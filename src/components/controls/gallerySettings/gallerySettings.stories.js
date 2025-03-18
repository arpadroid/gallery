/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
// import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent } from '@storybook/test';

// const html = String.raw;
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'play,thumbnailControl,spacer,settings',
        id: 'gallery-settings'
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
    title: 'Gallery/Controls/Settings'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-settings-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas, galleryNode } = await Render.playSetup(canvasElement, false);
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Settings' }));
        // const thumbnails = canvasElement.querySelector('gallery-thumbnails');
        // await customElements.whenDefined('gallery-thumbnails');
        
    }
};

export default Default;
