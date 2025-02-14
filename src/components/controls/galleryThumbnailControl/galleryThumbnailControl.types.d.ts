import { GalleryControlConfigType } from "../../galleryControl/galleryControl.types";

export type GalleryThumbnailControlConfigType = GalleryControlConfigType & {
    labelHide?: string;
    labelPosition?: ThumbnailsPositionType;
    thumbnailsPosition?: ThumbnailsPositionType;
}

export type ThumbnailsPositionType = 'top' | 'bottom' | 'left' | 'right';