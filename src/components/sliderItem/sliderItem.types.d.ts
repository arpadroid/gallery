import { GalleryItemConfigType } from '../galleryItem/galleryItem.types';

export type SliderItemConfigType = GalleryItemConfigType & {
    someProperty?: string;
    contentOverlay?: boolean;
    defaultContentOverlay?: boolean;
    contentPosition?: 'top' | 'bottom' | 'left' | 'right';
    defaultContentPosition?: SliderItemConfigType['contentPosition'];
};
