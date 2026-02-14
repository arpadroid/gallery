/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 * @typedef {import('@arpadroid/forms').FieldInput} FieldInput
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
// import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent } from 'storybook/test';

// const html = String.raw;
/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'input, next',
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

    play: async (/** @type {StoryContext} */ { canvasElement, step }) => {
        const { canvas, galleryNode } = await Render.playSetup(canvasElement, false);
        /** @type {ListResource} */
        const resource = galleryNode.listResource;
        const input = await waitFor(() => canvas.getByLabelText('Current slide'));
        /** @type {FormComponent} */
        const form = input.closest('arpa-form');
        form.setDebounce(0);
        await step('Renders the input', async () => {
            await waitFor(() => {
                expect(input).toBeInTheDocument();
            });
        });

        await step('Sets a value higher than the total number of slides and handles edge case', async () => {
            input.value = '100000';
            input.focus();
            form?.formNode && fireEvent.submit(form.formNode);
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
            form.formNode && (await fireEvent.submit(form.formNode));
            await waitFor(() => {
                expect(input.value).toBe('1');
                expect(
                    canvas.getByRole('heading', { level: 2, name: 'Guernica by Pablo Picasso (1937)' })
                ).toBeInTheDocument();
            });
        });

        await step('Changes slide and expects the input to update', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            const nextButton = canvas.getByRole('button', { name: 'Next' });
            await fireEvent.click(nextButton);
            await waitFor(() => {
                expect(input.value).toBe('2');
            });
        });
    }
};

export default Default;
