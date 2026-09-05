/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('./gallery.js').default} Gallery
 * @typedef {import('./gallery.types').GalleryConfigType} GalleryConfigType
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta<GalleryConfigType>} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj<GalleryConfigType>} Story
 */
import { attrString } from '@arpadroid/tools';
import { playSetup } from './gallery.stories.util';
import { expect, waitFor } from 'storybook/test';

const html = String.raw;

/** @type {Meta} */
const GalleryStory = {
    title: 'Gallery/Gallery',
    component: 'arpa-gallery',
    tags: [],
    args: {
        id: 'gallery'
    },
    parameters: {
        layout: 'flexColumn'
    },
    render: args => {
        return html` <arpa-gallery ${attrString(args)}></arpa-gallery> `;
    },
    play: async ({ canvasElement }) => {
        await playSetup(canvasElement);
    }
};

/** @type {Story} */
export const Default = {
    name: 'Render',
    args: {
        id: 'gallery-list'
    }
};

/** @type {Story} */
export const Test = {
    args: {
        id: 'gallery-test'
    },
    play: async ({ canvasElement, step, canvas }) => {
        const { galleryNode } = await playSetup(canvasElement);
        /** @type {GalleryItem | null} */
        await step('Renders the gallery', async () => {
            expect(galleryNode).toBeInTheDocument();
        });

        await step('Renders the gallery item', async () => {
            await waitFor(() => {
                canvas.getByText('Phidias');
            });
        });
    }
};

export default GalleryStory;
