/**
 * @typedef {import('../list.js').default} List
 * @typedef {import('@arpadroid/resources/src/resources/listResource/listResource.js').default} ListResource
 */
import artists from '../../../node_modules/@arpadroid/lists/src/mockData/artists.json';
import { attrString, formatDate } from '@arpadroid/tools';
import { within } from '@storybook/test';
const html = String.raw;
const GalleryStory = {
    title: 'Gallery',
    tags: [],
    args: {
        id: 'gallery'
    },
    parameters: {
        layout: 'fullscreen'
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
        layout: 'fullscreen'
    },
    args: {
        ...GalleryStory.args,
        id: 'gallery-list'
    },
    initializeList: async (id, payload = artists) => {
        const list = document.getElementById(id);
        /** @type {ListResource} */
        const resource = list.listResource;

        resource?.mapItem(item => {
            const dob = formatDate(item.dateOfBirth, 'YYYY');
            const dod = formatDate(item.dateOfDeath, 'YYYY');
            const lived = `${dob} - ${dod}` || dob;
            return {
                ...item,
                title: `${item.firstName} ${item.lastName} (${lived})`,
                image: item.portraitURL,
                thumbnail: item.portraitURL
            };
        });
        resource?.setItems(payload);
    },
    playSetup: async (canvasElement, initializeList = true) => {
        await customElements.whenDefined('arpa-gallery');
        await customElements.whenDefined('gallery-item');
        const canvas = within(canvasElement);
        const galleryNode = canvasElement.querySelector('arpa-gallery');
        const galleryItem = canvasElement.querySelector('gallery-item');
        await galleryNode.promise;
        initializeList && (await Default.initializeList(galleryNode.id));
        return { canvas, galleryNode, galleryItem };
    },
    play: async ({ canvasElement }) => {
        await Default.playSetup(canvasElement);
    },
    renderItemTemplate: () => {
        return html`<template template-id="list-item-template" truncate-content="50"> </template>`;
    },
    render: args => {
        return html`
            <style>
                #storybook-root {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
            </style>
            <arpa-gallery ${attrString(args)}> ${Default.renderItemTemplate()} </arpa-gallery>
        `;
    }
};

export default GalleryStory;
