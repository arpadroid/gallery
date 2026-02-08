/**
 * @typedef {import('@arpadroid/lists').List} List
 * @typedef {import('./gallery.js').default} Gallery
 * @typedef {import('../galleryItem/galleryItem.js').default} GalleryItem
 * @typedef {import('@arpadroid/module').StepFunction} StepFunction
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 * @typedef {import('@storybook/web-components-vite').Meta} Meta
 * @typedef {import('@storybook/web-components-vite').StoryObj} StoryObj
 * @typedef {import('@storybook/web-components-vite').StoryContext} StoryContext
 * @typedef {import('@storybook/web-components-vite').Args} Args
 */
import Story, { DefaultStory, TestDefault } from './stories.util';

/** @type {Meta} */
const GalleryStory = { ...Story };

/** @type {StoryObj} */
export const Default = { ...DefaultStory };

/** @type {StoryObj} */
export const Test = { ...TestDefault };

export default GalleryStory;
