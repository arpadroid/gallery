import { ListItem } from '@arpadroid/lists';
import { mergeObjects } from '@arpadroid/tools';

class GalleryItem extends ListItem {
    getDefaultConfig() {
        return mergeObjects(super.getDefaultConfig(), {
            self: 'gallery-item'
        });
    }
}

customElements.define('gallery-item', GalleryItem);

export default GalleryItem;
