import { ListConfigType } from '@arpadroid/lists';

export type GalleryConfigType = ListConfigType & {
    activeClass?: string;
    activityTimeout?: number;
    autoplay?: boolean;
    controlsHiddenClass?: string;
    imageSize?: number | 'full_screen' | 'adaptive' | 'string';
    loadingMode?: 'loadNext' | 'eager';
    playInterval?: number;
    thumbnailsPosition?: 'top' | 'bottom' | 'left' | 'right';
};
