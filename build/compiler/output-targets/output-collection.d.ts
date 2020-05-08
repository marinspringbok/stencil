import * as d from '../../declarations';
export declare const outputCollections: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
export declare const writeCollectionManifests: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTargets: d.OutputTargetDistCollection[]) => Promise<void[]>;
export declare const serializeCollectionManifest: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => d.CollectionManifest;
