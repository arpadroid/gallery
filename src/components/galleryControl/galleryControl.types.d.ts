import { ArpaElementConfigType } from '@arpadroid/ui';

export type GalleryControlConfigType = ArpaElementConfigType & {
    icon?: string;
    label?: string;
    ariaLabel?: string;
    debounceTime?: number;
};
