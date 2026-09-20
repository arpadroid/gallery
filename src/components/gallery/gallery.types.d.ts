import { ListManagerConfigType } from '@arpadroid/list-manager';
import { ThumbnailsPositionType } from '../controls/galleryThumbnailControl/galleryThumbnailControl.types';
import { GalleryItem } from '../..';

export type GalleryConfigType = Omit<ListManagerConfigType, 'itemComponent'> & {
    activeClass?: string;
    trackActivity?: boolean;
    activityTimeout?: number;
    autoplay?: boolean;
    controlsHiddenClass?: string;
    imageSize?: number | 'full_screen' | 'adaptive' | 'string';
    loadingMode?: 'loadNext' | 'eager';
    playInterval?: number;
    thumbnailsPosition?: ThumbnailsPositionType;
    swipeThreshold?: number;
    itemComponent?: typeof GalleryItem;
};
