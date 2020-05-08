import * as d from '@stencil/core/internal';
export declare const getHostRef: (elm: d.RuntimeRef) => d.HostRef;
export declare const registerInstance: (lazyInstance: any, hostRef: d.HostRef) => Map<d.RuntimeRef, d.HostRef>;
export declare const registerHost: (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta) => void;
