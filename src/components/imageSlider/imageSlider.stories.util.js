/**
 * @typedef {import('./imageSlider.js').default} ImageSlider
 * @typedef {import('@arpadroid/resources').ListResource} ListResource
 */

import artworks from '../../../node_modules/@arpadroid/lists/src/mockData/artists.json';
/**
 * Initializes the Slider.
 * @param {string} id
 * @param {Record<string, any>[]} payload
 * @returns {Promise<{ resource: ListResource | undefined, slider: ImageSlider | null }>}
 */
export async function initializeSlider(id, payload = artworks) {
    const slider = /** @type {ImageSlider | null} */ (document.getElementById(id));
    /** @type {ListResource | undefined} */
    const resource = slider?.listResource;
    await resource?.setItems(
        payload.map(item => {
            return {
                title: item.firstName + ' ' + item.lastName,
                image: item.portraitURL,
                caption: item.description,
                id: item.id
            };
        })
    );
    return { resource, slider };
}
