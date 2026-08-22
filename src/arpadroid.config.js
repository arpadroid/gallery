/** @type {import("@arpadroid/module").BuildConfigType} */
const config = {
    deps: ['forms', 'lists', 'navigation', 'ui'],
    buildTypes: true,
    buildManifest: true,
    buildType: 'uiComponent',
    storybook_port: 6015
};

export default config;
