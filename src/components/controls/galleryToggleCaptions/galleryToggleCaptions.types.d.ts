import { GalleryControlConfigType } from '../../galleryControl/galleryControl.types';

export type GalleryToggleCaptionsConfigType = GalleryControlConfigType & {
    iconOff?: string;
    labelOff?: string;
    toggleClass?: string;
    enabled?: boolean;
};
