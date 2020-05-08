import * as d from '../../declarations';
export declare const runPluginResolveId: (pluginCtx: d.PluginCtx, importee: string) => Promise<string>;
export declare const runPluginLoad: (pluginCtx: d.PluginCtx, id: string) => Promise<string>;
export declare const runPluginTransforms: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, id: string, cmp?: d.ComponentCompilerMeta) => Promise<d.PluginTransformResults>;
export declare const runPluginTransformsEsmImports: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, code: string, id: string) => Promise<d.PluginTransformResults>;
