import { GalleryItemConfigType } from '../galleryItem/galleryItem.types';

export type SliderItemConfigType = GalleryItemConfigType & {
    someProperty?: string;
    contentOverlay?: boolean;
    contentPosition?: 'top' | 'bottom' | 'left' | 'right';
};
