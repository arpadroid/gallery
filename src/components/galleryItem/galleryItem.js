import { ListItem } from '@arpadroid/lists';
import { classNames, mergeObjects, attrString } from '@arpadroid/tools';
const html = String.raw;
class GalleryItem extends ListItem {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            imageSize: 'adaptive'
        });
    }

    /**
     * Returns the template for the list item.
     * @param {boolean} isGrid - Indicates whether the list item is in grid view.
     * @param {string} link - The link for the list item.
     * @returns {string}
     */
    getTemplate(isGrid = this.isGrid, link = this.link) {
        const attrs = attrString({
            href: link,
            class: classNames('galleryItem__main', { listItem__link: link })
        });
        const wrapperComponent = this.link ? 'a' : this.getWrapperComponent();
        const innerContent = this.renderInnerContent(isGrid) || this.hasZone('content');
        const hasInnerContent = innerContent && innerContent?.trim()?.length;
        const innerHTML = hasInnerContent ? html`<div class="galleryItem__contentWrapper">${innerContent}</div>` : '';
        return html`<${wrapperComponent} ${attrs}>${innerHTML}</${wrapperComponent}>`;
    }

    renderInnerContent() {
        const image = this.renderImage();
        const titleContainer = this.renderTitleContainer();
        return html`${titleContainer}${image}${this.renderContent()}`;
    }
}

customElements.define('gallery-item', GalleryItem);

export default GalleryItem;
