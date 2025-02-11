import { GalleryControlConfigType } from '../../galleryControl/galleryControl.types';

export type GalleryDarkModeConfigType = GalleryControlConfigType & {
    labelLight?: string;
    label?: string;
    iconLight?: string;
    icon?: string;
};
