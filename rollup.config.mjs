import { getBuild } from '@arpadroid/arpadroid/src/rollup/builds/rollup-builds.mjs';
const { build } = getBuild('gallery', 'uiComponent');
export default build;
