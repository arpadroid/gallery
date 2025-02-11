import { ArpaElementConfigType } from '@arpadroid/ui';

export type GallerySettingsConfigType = ArpaElementConfigType & {
    icon?: string;
    btnLabel?: string;
    label?: string;
};

export type GallerySettingsType = {
    playInterval?: number;
    thumbnailsPosition?: 'top' | 'bottom' | 'left' | 'right';
};
