/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('../../gallery/gallery.js').default} Gallery
 * @typedef {import('./gallerySettings.js').default} GallerySettings
 * @typedef {import('../../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@arpadroid/forms').FormComponent} FormComponent
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 * @typedef {import('@arpadroid/forms').SelectCombo} SelectCombo
 */
import { playSetup, renderStatic } from '../../gallery/gallery.stories.util';
import GalleryStory from '../../gallery/gallery.stories';
import { expect, waitFor, within, userEvent } from 'storybook/test';

/** @type {Meta} */
const GallerySettingsStory = {
    title: 'Gallery/Controls/Settings',
    render: args => renderStatic(args)
};

/** @type {StoryObj} */
export const Render = {
    ...GalleryStory,
    args: {
        ...GalleryStory.args,
        controls: 'play,thumbnailControl,spacer,settings',
        id: 'gallery-settings'
    }
};

/** @type {StoryObj} */
export const Test = {
    ...GalleryStory,
    args: {
        ...Render.args,
        id: 'gallery-settings-test'
    },
    play: async ({ canvasElement, step, canvas }) => {
        const { galleryNode } = await playSetup(canvasElement);
        const gallerySettingsNode = /** @type {GallerySettings | null} */ (
            galleryNode.querySelector('gallery-settings')
        );
        await gallerySettingsNode?.onRendered();

        const settingsForm = await waitFor(
            () => /** @type {FormComponent | null} */ (document.getElementById('gallery-settings-test-filters-form'))
        );

        await settingsForm?.onRendered();
        /** @todo Fix Settimeout. */
        await new Promise(resolve => setTimeout(resolve, 0));
        const positionField = /** @type {SelectCombo | undefined} */ (settingsForm?.getField('thumbnailsPosition'));
        await positionField?.promise;

        const button = canvas.getByRole('button', { name: 'Settings' });
        await step('Renders the settings button', async () => {
            expect(button).toBeInTheDocument();
        });

        await step('Focuses the settings button and displays the tooltip', async () => {
            await userEvent.click(button);
            await waitFor(() => {
                expect(within(button).getByText('Settings')).toBeVisible();
            });
        });

        await step('Renders the settings form', async () => {
            await waitFor(() => {
                expect(canvas.getByText('General')).toBeInTheDocument();
                expect(canvas.getByText('Play interval')).toBeInTheDocument();
                expect(canvas.getByText('Thumbnails position')).toBeInTheDocument();
            });
        });

        await step('Opens the thumbnail position dropdown', async () => {
            const dropdown = await waitFor(() => canvas.getByLabelText('Thumbnails position'));
            await userEvent.click(dropdown, { delay: 100 });
            await waitFor(() => {
                const combo = within(positionField?.optionsNode);
                expect(combo?.getByText('Top')).toBeInTheDocument();
                expect(combo?.getByText('Bottom')).toBeInTheDocument();
                expect(combo?.getByText('Left')).toBeInTheDocument();
                expect(combo?.getByText('Right')).toBeInTheDocument();
            });
        });

        await step('Sets the thumbnails position to "Right"', async () => {
            const combo = within(positionField?.optionsNode);
            const option = combo.getByText('Right');
            await userEvent.click(option, { delay: 10 });
            await waitFor(() => {
                expect(galleryNode.querySelector('gallery-thumbnails')).toHaveAttribute('position', 'right');
            });
        });

        await step('Sets the thumbnails position to "left"', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            const combo = within(positionField?.optionsNode);
            const option = combo.getByText('Left');
            await userEvent.click(option, { delay: 100 });
            await waitFor(() => {
                const node = galleryNode.querySelector('gallery-thumbnails');
                expect(node).toBeInTheDocument();
                // expect(node).toHaveAttribute('position', 'left');
            });
        });
    }
};

export default GallerySettingsStory;
