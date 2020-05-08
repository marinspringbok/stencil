import * as d from '@stencil/core/internal';
export declare function resetTaskQueue(): void;
export declare const nextTick: (cb: Function) => void;
export declare function flushTicks(): Promise<unknown>;
export declare function writeTask(cb: d.RafCallback): void;
export declare function readTask(cb: d.RafCallback): void;
export declare function flushQueue(): Promise<void>;
export declare function flushAll(): Promise<void>;
export declare function loadModule(cmpMeta: d.ComponentRuntimeMeta, _hostRef: d.HostRef, _hmrVersionId?: string): Promise<any>;
export declare function flushLoadModule(bundleId?: string): Promise<void>;
export interface QueuedLoadModule {
    bundleId: any;
    resolve: Function;
}
