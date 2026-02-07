/**
 * Storybook preview configuration.
 * This file imports the preview configuration from the module and exports it.
 * Add your Storybook preview configuration overrides here if needed.
 */
import PreviewConfig from '@arpadroid/module/storybook/preview';
/** @type { import('@storybook/web-components-vite').Preview } */
import { bootstrapDecorator } from '@arpadroid/module/storybook/decorators';
import { setService } from '@arpadroid/context';
import { Router, APIService } from '@arpadroid/services';
import { mergeObjects } from '@arpadroid/tools';

const config = mergeObjects(
    PreviewConfig,
    {
        decorators: [
            bootstrapDecorator(() => {
                setService('router', new Router());
                setService('apiService', APIService);
            })
        ]
    },
    { mergeArrays: true }
);

export default { ...config };
