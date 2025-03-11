/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('./gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */
import artists from '../../../node_modules/@arpadroid/lists/src/mockData/artists.json';
import { attrString, formatDate } from '@arpadroid/tools';
import { within, expect } from '@storybook/test';

const html = String.raw;
const GalleryStory = {
    title: 'Gallery/Gallery',
    tags: [],
    args: {
        id: 'gallery'
    },
    parameters: {
        layout: 'flexColumn'
    },
    getArgTypes: (category = 'Gallery Props') => {
        return {
            id: { control: { type: 'text' }, table: { category } },
            thumbnailsPosition: {
                control: { type: 'select' },
                options: ['bottom', 'left', 'top', 'right'],
                table: { category }
            }
        };
    }
};

export const Default = {
    name: 'Render',
    argTypes: GalleryStory.getArgTypes(),
    parameters: {
        layout: 'flexColumn'
    },
    args: {
        ...GalleryStory.args,
        id: 'gallery-list'
    },
    /**
     * Initializes the list.
     * @param {string} id
     * @param {Record<string, any>[]} payload
     * @returns {Promise<void>}
     */
    initializeList: async (id, payload = artists) => {
        const list = /** @type {Gallery | null} */ (document.getElementById(id));
        /** @type {ListResource | undefined} */
        const resource = list?.listResource;

        // @ts-ignore
        resource?.mapItem(item => {
            const dob = formatDate(item.dateOfBirth, 'YYYY') || item.dateOfBirth;
            const dod = formatDate(item.dateOfDeath, 'YYYY') || item.dateOfDeath;
            const lived = `${dob} - ${dod}` || dob;
            return {
                ...item,
                title: `${item.firstName}${item.lastName ? ' ' + item.lastName : ''} (${lived})`,
                image: item.portraitURL,
                thumbnail: item.portraitURL,
                caption: item.legacy
            };
        });
        resource?.setItems(payload);
    },
    /**
     * Sets up the gallery for testing.
     * @param {HTMLElement} canvasElement
     * @param {boolean} initializeList
     * @returns {Promise<{ canvas: any; galleryNode: any; galleryItem: any }>}
     */
    playSetup: async (canvasElement, initializeList = true) => {
        await customElements.whenDefined('arpa-gallery');
        await customElements.whenDefined('gallery-item');
        const canvas = within(canvasElement);
        /** @type {Gallery | null} */
        const galleryNode = canvasElement.querySelector('arpa-gallery');
        await galleryNode?.promise;

        galleryNode && initializeList && (await Default.initializeList(galleryNode?.id));
        await new Promise(resolve => setTimeout(resolve, 200));
        /** @type {GalleryItem | null} */
        const galleryItem = canvasElement.querySelector('gallery-item');
        await galleryItem?.promise;
        console.log('galleryItem', galleryItem);
        return { canvas, galleryNode, galleryItem };
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement }} args
     * @returns {Promise<void>}
     */
    play: async ({ canvasElement }) => {
        await Default.playSetup(canvasElement);
    },
    renderItemTemplate: () => {
        return html`<template template-id="list-item-template" truncate-content="50"> </template>`;
    },
    /**
     * Renders the gallery.
     * @param {import('./gallery.types').GalleryConfigType} args
     * @returns {string}
     */
    render: args => {
        return html` <arpa-gallery ${attrString(args)}> ${Default.renderItemTemplate()} </arpa-gallery> `;
    }
};

export const Test = {
    ...Default,
    args: {
        ...GalleryStory.args,
        id: 'gallery-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { galleryNode, canvas } = await Test.playSetup(canvasElement);
        /** @type {GalleryItem | null} */
        await step('Renders the gallery', async () => {
            expect(galleryNode).toBeInTheDocument();
        });

        const currentItem = galleryNode.getItems()[0];
        await step('Renders the gallery item', async () => {
            expect(canvas.getByText(currentItem.caption)).toBeInTheDocument();
            const heading = canvas.getByRole('heading', { level: 2, name: currentItem.title });
            expect(heading).toBeInTheDocument();
        });
    }
};

export default GalleryStory;
