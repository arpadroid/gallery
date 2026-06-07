import { GalleryItemConfigType } from '../galleryItem/galleryItem.types';

export type SliderItemContentPositionType = 'top' | 'bottom' | 'left' | 'right';

export type SliderItemConfigType = GalleryItemConfigType & {
    someProperty?: string;
    contentOverlay?: boolean;
    defaultContentOverlay?: boolean;
    contentPosition?: SliderItemContentPositionType;
    defaultContentPosition?: SliderItemContentPositionType;
};
