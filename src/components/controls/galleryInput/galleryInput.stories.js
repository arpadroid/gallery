/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 * @typedef {import('@arpadroid/forms').FieldInput} FieldInput
 */
// import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent } from '@storybook/test';

// const html = String.raw;
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'input',
        id: 'gallery-input'
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
    title: 'Gallery/Controls/Input'
};

export const Test = {
    ...Render,
    args: {
        ...Render.args,
        id: 'gallery-input-test'
    },
    /**
     * Plays the gallery.
     * @param {{ canvasElement: HTMLElement, step: StepFunction }} args
     */
    play: async ({ canvasElement, step }) => {
        const { canvas, galleryNode } = await Render.playSetup(canvasElement, false);
        /** @type {import('@arpadroid/resources').ListResource} */
        const resource = galleryNode.listResource;
        const input = await waitFor(() => canvas.getByLabelText('Current slide'));
        /** @type {FormComponent} */
        const form = input.form;
        form.setDebounce(0);
        await step('Renders the input', async () => {
            await waitFor(() => {
                expect(input).toBeInTheDocument();
            });
        });

        await step('Sets a value higher than the total number of slides and handles edge case', async () => {
            input.value = '100000';
            input.focus();
            fireEvent.submit(form);
            await waitFor(() => {
                expect(input.value).toBe('2');
                expect(
                    canvas.getByRole('heading', { level: 2, name: 'Blue II by Joan Miró (1961)' })
                ).toBeInTheDocument();
            });
        });

        await step('Sets a negative value and handles edge case', async () => {
            input.value = '-1';
            await fireEvent.input(input);
            await fireEvent.submit(form);
            await waitFor(() => {
                expect(input.value).toBe('1');
                expect(
                    canvas.getByRole('heading', { level: 2, name: 'Guernica by Pablo Picasso (1937)' })
                ).toBeInTheDocument();
            });
        });

        await step('Changes slide and expects the input to update', async () => {
            await new Promise(resolve => setTimeout(resolve, 200));
            await resource.nextPage();
            await waitFor(() => {
                expect(input.value).toBe('2');
            });
        });
    }
};

export default Default;
