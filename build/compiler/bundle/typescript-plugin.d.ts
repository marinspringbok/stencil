import * as d from '../../declarations';
import { BundleOptions } from './bundle-interface';
import { Plugin } from 'rollup';
export declare const typescriptPlugin: (compilerCtx: d.CompilerCtx, bundleOpts: BundleOptions) => Plugin;
export declare const resolveIdWithTypeScript: (config: d.Config, compilerCtx: d.CompilerCtx) => Plugin;
