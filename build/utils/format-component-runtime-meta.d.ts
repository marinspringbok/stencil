import * as d from '../declarations';
export declare const formatLazyBundleRuntimeMeta: (bundleId: any, cmps: d.ComponentCompilerMeta[]) => d.LazyBundleRuntimeData;
export declare const formatComponentRuntimeMeta: (compilerMeta: d.ComponentCompilerMeta, includeMethods: boolean) => d.ComponentRuntimeMetaCompact;
export declare const stringifyRuntimeData: (data: any) => string;
