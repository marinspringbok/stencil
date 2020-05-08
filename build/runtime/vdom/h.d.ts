/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
import * as d from '../../declarations';
export declare const h: (nodeName: any, vnodeData: any, ...children: d.ChildType[]) => d.VNode;
export declare const newVNode: (tag: string, text: string) => d.VNode;
export declare const Host: {};
export declare const isHost: (node: any) => node is d.VNode;
