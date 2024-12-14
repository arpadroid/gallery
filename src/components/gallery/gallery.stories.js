/**
 * @typedef {import('../list.js').default} List
 * @typedef {import('@arpadroid/resources/src/resources/listResource/listResource.js').default} ListResource
 */
import artists from '../../../node_modules/@arpadroid/lists/src/mockData/artists.json';
import { attrString, formatDate } from '@arpadroid/tools';
import { within } from '@storybook/test';
console.log('artists', artists);
const html = String.raw;
const GalleryStory = {
    title: 'Gallery',
    tags: [],
    args: {
        id: 'gallery',
        title: 'Gallery',
        hasItemsTransition: true,
        hasControls: true,
    },
    getArgTypes: (category = 'gallery Props') => {
        return {
            // id: { control: { type: 'text' }, table: { category } },
            // title: { control: { type: 'text' }, table: { category } },
            // hasMultiSelect: { control: { type: 'boolean' }, table: { category, subcategory: 'Controls' } },
            // hasItemsTransition: { control: { type: 'boolean' }, table: { category, subcategory: 'Controls' } },
            // url: { control: { type: 'text' }, table: { category, subcategory: 'Resource' } },
            // itemsPerPage: { control: { type: 'number' }, table: { category, subcategory: 'Resource' } },
            // paramNamespace: { control: { type: 'text' }, table: { category, subcategory: 'Resource' } }
        };
    }
};

export const Default = {
    name: 'Render',
    argTypes: GalleryStory.getArgTypes(),
    args: {
        ...GalleryStory.args,
        id: 'gallery-list',
        title: 'Gallery',
        hasResource: true
    },
    initializeList: async (id, payload = artists) => {
        const list = document.getElementById(id);
        /** @type {ListResource} */
        const resource = list.listResource;
        console.log('resource', resource);
        resource?.mapItem(item => {
            // const dob = formatDate(item.dateOfBirth, 'YYYY');
            // const dod = formatDate(item.dateOfDeath, 'YYYY');
            // const lived = `${dob} - ${dod}` || dob;
            return {
                ...item,
                title: `${item.firstName} ${item.lastName}`,
                // date: lived
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
        return html`<template template-id="list-item-template" image="{portraitURL}" truncate-content="50">
            I'm a gallery item
        </template>`;
    },
    render: args => {
        return html`<arpa-gallery ${attrString(args)}> ${Default.renderItemTemplate()} </arpa-gallery> `;
    }
};

export default GalleryStory;
