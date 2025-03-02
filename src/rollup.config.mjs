import { getBuild } from '@arpadroid/module';
const { build = {} } = getBuild('gallery', 'uiComponent') || {};
export default build;
