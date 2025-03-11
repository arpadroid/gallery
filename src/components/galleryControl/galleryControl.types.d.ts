import { ArpaElementConfigType } from '@arpadroid/ui';

export type GalleryControlConfigType = ArpaElementConfigType & {
    icon?: string;
    label?: string;
    labelText?: string;
    debounceTime?: number;
};
