import * as d from '../../declarations';
import { BundleOptions } from './bundle-interface';
import { RollupOptions } from 'rollup';
export declare const bundleOutput: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => Promise<import("rollup").RollupBuild>;
export declare const getRollupOptions: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => RollupOptions;
