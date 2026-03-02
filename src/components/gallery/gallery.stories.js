/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('./gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import { attrString } from '@arpadroid/tools';
import { getArgTypes, playSetup } from './gallery.stories.util';
import { expect } from 'storybook/test';

const html = String.raw;

/** @type {Meta} */
const GalleryStory = {
    title: 'Gallery/Gallery',
    tags: [],
    argTypes: getArgTypes(),

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

/** @type {StoryObj} */
export const Default = {
    ...GalleryStory,
    name: 'Render',
    args: {
        ...GalleryStory.args,
        id: 'gallery-list'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...Default,
    args: {
        ...GalleryStory.args,
        id: 'gallery-test'
    },
    play: async ({ canvasElement, step }) => {
        const { galleryNode, canvas } = await playSetup(canvasElement);
        /** @type {GalleryItem | null} */
        await step('Renders the gallery', async () => {
            expect(galleryNode).toBeInTheDocument();
        });
        // const currentItem = galleryNode.itemsNode.children[0];
        // console.log('currentItem', currentItem);

        // await step('Renders the gallery item', async () => {
        //     expect(canvas.getByText(currentItem.caption)).toBeInTheDocument();
        //     const heading = canvas.getByRole('heading', { level: 2, name: currentItem.title });
        //     expect(heading).toBeInTheDocument();
        // });
    }
};

export default GalleryStory;
