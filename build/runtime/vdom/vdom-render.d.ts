/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
import * as d from '../../declarations';
export declare const isSameVnode: (vnode1: d.VNode, vnode2: d.VNode) => boolean;
export declare const patch: (oldVNode: d.VNode, newVNode: d.VNode) => void;
export declare const callNodeRefs: (vNode: d.VNode) => void;
export declare const renderVdom: (hostRef: d.HostRef, renderFnResults: d.VNode | d.VNode[]) => void;
