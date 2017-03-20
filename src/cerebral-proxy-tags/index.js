import {string as stringTemplateFn} from 'cerebral/tags';
import {addProxySupport, createProxyTag} from './create-proxy-tag';

export const string = addProxySupport(stringTemplateFn);
export const state = createProxyTag('state', {
	isStateDependency: true
});
export const input = createProxyTag('input');
export const signal = createProxyTag('signal');
export const props = createProxyTag('props');
