import { ArpaElementConfigType } from '@arpadroid/ui';

export type ImagePreviewConfigType = ArpaElementConfigType & {
    id?: string;
    image?: string;
    title?: string;
    caption?: string;
    handler?: string | HTMLElement;
    controls?: string[] | string;
};
