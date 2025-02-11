import { ListConfigType } from '@arpadroid/lists';

export type GalleryThumbnailsConfigType = ListConfigType & {
    hasArrows?: boolean;
    selectedClass?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
};
