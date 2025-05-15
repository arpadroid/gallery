import { GalleryConfigType } from '../gallery/gallery.types';

export type ImageSliderConfigType = GalleryConfigType & {
    contentOverlay?: boolean;
    contentPosition?: 'left' | 'right' | 'top' | 'bottom';
};
