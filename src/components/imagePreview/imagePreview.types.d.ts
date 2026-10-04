import { ArpaElementConfigType } from '@arpadroid/ui';

export type ImagePreviewConfigType = ArpaElementConfigType & {
    id?: string;
    image?: string;
    title?: string;
    dialogContainer?: string | Document | HTMLElement;
    caption?: string;
    handler?: string | HTMLElement;
    controls?: string[] | string;
};
