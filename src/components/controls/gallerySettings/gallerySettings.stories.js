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
        const button = await waitFor(() => canvas.getByRole('button', { name: 'Settings' }));
        const gallerySettingsNode = /** @type {GallerySettings | null} */ (
            galleryNode.querySelector('gallery-settings')
        );
        await gallerySettingsNode?.promise;

        const settingsForm = await waitFor(
            () => /** @type {FormComponent | null} */ (document.getElementById('gallery-settings-test-filters-form'))
        );

        await new Promise(resolve => setTimeout(resolve, 0));
        const positionField = /** @type {SelectCombo | undefined} */ (settingsForm?.getField('thumbnailsPosition'));
        await positionField?.promise;
        const optionsNode = positionField?.optionsNode;
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
            await waitFor(() => {
                expect(canvas.getByText('General')).toBeVisible();
                expect(canvas.getByText('Play interval')).toBeVisible();
                expect(canvas.getByText('Thumbnails position')).toBeVisible();
            });
        });

        await step('Opens the thumbnail position dropdown', async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            const dropdown = canvas.getByLabelText('Thumbnails position');
            await userEvent.click(dropdown);
            await waitFor(() => {
                const combo = optionsNode && within(optionsNode);
                expect(combo?.getByText('Top')).toBeVisible();
                expect(combo?.getByText('Bottom')).toBeVisible();
                expect(combo?.getByText('Left')).toBeVisible();
                expect(combo?.getByText('Right')).toBeVisible();
            });
        });

        await step('Sets the thumbnails position to "Right"', async () => {
            const dropdown = canvas.getByLabelText('Thumbnails position');
            await userEvent.click(dropdown);
            const combo = optionsNode && within(optionsNode);
            const option = combo?.getByText('Right');
            option && (await userEvent.click(option));
            await waitFor(() => {
                expect(galleryNode.querySelector('gallery-thumbnails')).toHaveAttribute('position', 'right');
            });
        });

        await step('Sets the thumbnails position to "left"', async () => {
            const dropdown = canvas.getByLabelText('Thumbnails position');
            await userEvent.click(dropdown);
            const combo = optionsNode && within(optionsNode);
            const option = combo?.getByText('Left');
            option && (await userEvent.click(option));
            await waitFor(() => {
                expect(galleryNode.querySelector('gallery-thumbnails')).toHaveAttribute('position', 'left');
            });
        });
    }
};

export default GallerySettingsStory;
