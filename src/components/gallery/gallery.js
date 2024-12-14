import { List } from '@arpadroid/lists';
import { mergeObjects } from '@arpadroid/tools';
const html = String.raw;
class Gallery extends List {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            defaultView: 'full',
            views: ['full'],
            itemsPerPage: 1,
            itemTag: 'gallery-item',
            hasResource: true,
            imageSize: 'full_screen',
            hasControls: true,
            controls: ['play', 'previous', 'input', 'next', 'thumbnailControl', 'fullScreen', 'views']
        });
    }

    renderControls() {
        return super.renderControls('gallery-controls');
    }

    renderFull() {
        return html`
            <div class="arpaList__header">{title}</div>
             {info}
            <div class="arpaList__body">
                <div class="arpaList__bodyMain">{heading}{items}{preloader}</div>
                {aside}
            </div>
            {controls}
        `;
    }
}

customElements.define('arpa-gallery', Gallery);
export default Gallery;
