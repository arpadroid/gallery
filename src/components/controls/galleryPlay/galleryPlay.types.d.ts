import { GalleryControlConfigType } from '../../galleryControl/galleryControl.types';

export type GalleryPlayConfigType = GalleryControlConfigType & {
    labelPause?: string;
    iconPause?: string;
    playInterval?: number;
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
};
