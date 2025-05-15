import { ListItemConfigType } from '@arpadroid/lists';

export type GalleryItemConfigType = ListItemConfigType & {
    itemId?: string;
    caption?: string;
    truncateCaption?: number | string;
};
