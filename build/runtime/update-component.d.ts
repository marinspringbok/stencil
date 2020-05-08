import * as d from '../declarations';
export declare const attachToAncestor: (hostRef: d.HostRef, ancestorComponent: d.HostElement) => void;
export declare const scheduleUpdate: (hostRef: d.HostRef, isInitialLoad: boolean) => any;
export declare const getRenderingRef: () => any;
export declare const postUpdateComponent: (hostRef: d.HostRef) => void;
export declare const forceUpdate: (ref: any) => boolean;
export declare const appDidLoad: (who: string) => void;
export declare const safeCall: (instance: any, method: string, arg?: any) => any;
