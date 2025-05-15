import { ListConfigType } from '@arpadroid/lists';
import { ThumbnailsPositionType } from '../controls/galleryThumbnailControl/galleryThumbnailControl.types';

export type GalleryConfigType = ListConfigType & {
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
};
