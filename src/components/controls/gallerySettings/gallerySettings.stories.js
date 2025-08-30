/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 */
// import { attrString } from '@arpadroid/tools';
import { Default as GalleryStory } from '../../gallery/gallery.stories';
import { expect, waitFor, fireEvent, within } from '@storybook/test';

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

        const settingsForm = /** @type {FormComponent | null} */ (
            document.getElementById('gallery-settings-test-filters-form')
        );
        await settingsForm?.promise;
        const playIntervalField = settingsForm?.getField('playInterval');
        await playIntervalField?.promise;

        await step('Renders the settings button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Focuses the settings button and displays the tooltip', async () => {
            button.focus();
            await waitFor(() => {
                expect(within(button).getByText('Settings')).toBeVisible();
            });
        });

        await step('Renders the settings form', async () => {
            await fireEvent.click(button);
            await waitFor(() => {
                expect(canvas.getByText('General')).toBeVisible();
                expect(canvas.getByText('Play interval')).toBeVisible();
                expect(canvas.getByText('Thumbnails position')).toBeVisible();
            });
        });

        await step('Opens the thumbnail position dropdown', async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
            const dropdown = canvas.getByLabelText('Thumbnails position');
            await fireEvent.click(dropdown);
            await waitFor(() => {
                const combo = within(galleryNode?.settings?.form?.getField('thumbnailsPosition')?.optionsNode);
                expect(combo.getByText('Top')).toBeVisible();
                expect(combo.getByText('Bottom')).toBeVisible();
                expect(combo.getByText('Left')).toBeVisible();
                expect(combo.getByText('Right')).toBeVisible();
            });
        });

        await step('Sets the thumbnails position to "Right"', async () => {
            const dropdown = canvas.getByLabelText('Thumbnails position');
            await fireEvent.click(dropdown);
            const combo = within(galleryNode?.settings?.form?.getField('thumbnailsPosition')?.optionsNode);
            const option = combo.getByText('Right');
            await fireEvent.click(option);
            await waitFor(() => {
                expect(galleryNode.querySelector('gallery-thumbnails')).toHaveAttribute('position', 'right');
            });
        });

        await step('Sets the thumbnails position to "left"', async () => {
            const dropdown = canvas.getByLabelText('Thumbnails position');
            await fireEvent.click(dropdown);
            const combo = within(galleryNode?.settings?.form?.getField('thumbnailsPosition')?.optionsNode);
            const option = combo.getByText('Left');
            await fireEvent.click(option);
            await waitFor(() => {
                expect(galleryNode.querySelector('gallery-thumbnails')).toHaveAttribute('position', 'left');
            });
        });
    }
};

export default Default;
