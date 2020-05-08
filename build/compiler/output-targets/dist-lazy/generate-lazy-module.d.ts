import * as d from '../../../declarations';
export declare const generateLazyModules: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargetType: string, destinations: string[], results: d.RollupResult[], sourceTarget: d.SourceTarget, isBrowserBuild: boolean, sufix: string) => Promise<d.BundleModule[]>;
export declare const sortBundleModules: (a: d.BundleModule, b: d.BundleModule) => 1 | 0 | -1;
export declare const sortBundleComponents: (a: d.ComponentCompilerMeta, b: d.ComponentCompilerMeta) => 1 | 0 | -1;
