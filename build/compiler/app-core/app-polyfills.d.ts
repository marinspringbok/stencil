import * as d from '../../declarations';
export declare const getClientPolyfill: (config: d.Config, compilerCtx: d.CompilerCtx, polyfillFile: string) => Promise<string>;
export declare const getAppBrowserCorePolyfills: (config: d.Config, compilerCtx: d.CompilerCtx) => Promise<string>;
