import * as d from '../declarations';
export declare const getHostRef: (ref: d.RuntimeRef) => d.HostRef;
export declare const registerInstance: (lazyInstance: any, hostRef: d.HostRef) => WeakMap<d.RuntimeRef, d.HostRef>;
export declare const registerHost: (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => WeakMap<d.RuntimeRef, d.HostRef>;
export declare const isMemberInElement: (elm: any, memberName: string) => boolean;
