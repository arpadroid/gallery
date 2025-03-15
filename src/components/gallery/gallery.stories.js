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
            const authorName = `${item.firstName}${item.lastName ? ' ' + item.lastName : ''}`;
            return {
                ...item,
                title: authorName,
                lifeSpan: lived,
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
        galleryNode?.listResource?.pageFilter?.setValue(1);

        galleryNode && initializeList && (await Default.initializeList(galleryNode?.id));
        // await new Promise(resolve => setTimeout(resolve, 200));
        /** @type {GalleryItem | null} */
        const galleryItem = canvasElement.querySelector('gallery-item');
        await galleryItem?.promise;

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
        return html``;
    },
    /**
     * Renders the gallery.
     * @param {import('./gallery.types').GalleryConfigType} args
     * @returns {string}
     */
    render: args => {
        return html` <arpa-gallery ${attrString(args)}> ${Default.renderItemTemplate()} </arpa-gallery> `;
    },
    /**
     * Renders the gallery.
     * @param {import('./gallery.types').GalleryConfigType} args
     * @returns {string}
     */
    renderStatic: args => {
        return html`
            <arpa-gallery ${attrString(args)}>
                <gallery-item
                    id="gallery-item-1"
                    title="Guernica by Pablo Picasso (1937)"
                    caption="Besides being Picasso most famous painting, Guernica is also one of the world’s most famous and moving antiwar statements. It was inspired by the brutal 1937 bombing of the Basque city of Guernica during the Spanish Civil War. That same year, with war still raging, the embattled Leftist government of Spain commissioned the piece as a mural for the 1937 World’s Fair in Paris. It later toured Europe and the United States, winding up on loan to the Museum of Modern Art in New York with the proviso that it be repatriated to Spain once Generalissimo Francisco Franco—leader of that coup that eventually toppled the Republican government—left power. That finally happened in 1981, six years after Franco’s death in 1975 and eight years after Picasso himself passed away in 1973. In 1974, while still at MoMA, Tony Shafrazi, an artist who later became a gallery dealer of note, defaced the piece with spray paint. MoMA declined to press charges, and was able to restore Guernica because Shafrazi had been prudent enough to use paint that could easily clean off."
                    image="/assets/artworks/guernica.jpg"
                    thumbnail="/assets/artworks/guernica.jpg"
                ></gallery-item>
                <gallery-item
                    id="gallery-item-2"
                    title="Blue II by Joan Miró (1961)"
                    caption="Blue II is a painting by Joan Miró, a Spanish painter and sculptor who was born in Barcelona. He was a key figure in the Surrealist movement. His work is known for its dream-like quality and use of symbols. Miró’s work is often characterized by bright colors and bold shapes. Blue II is a great example of Miró’s style. The painting features a large blue shape in the center of the canvas. The shape is surrounded by smaller shapes in red, yellow, and green. The painting is abstract, but it suggests a landscape or a figure. The colors and shapes in the painting create a sense of movement and energy. Blue II is a powerful and dynamic work of art that captures the spirit of Miró’s work."
                    image="/assets/artworks/blue-ii.jpg"
                    thumbnail="/assets/artworks/blue-ii.jpg"
                ></gallery-item>
            </arpa-gallery>
        `;
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
        console.log('canvas', canvas);
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
