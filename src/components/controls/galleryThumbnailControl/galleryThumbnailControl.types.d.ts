import { GalleryControlConfigType } from "../../galleryControl/galleryControl.types";

export type GalleryThumbnailControlConfigType = GalleryControlConfigType & {
    labelHide?: string;
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
    thumbnailsPosition?: 'top' | 'bottom' | 'left' | 'right';
}