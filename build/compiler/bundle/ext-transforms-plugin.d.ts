import * as d from '../../declarations';
import { BundleOptions } from './bundle-interface';
import { Plugin } from 'rollup';
export declare const extTransformsPlugin: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => Plugin;
