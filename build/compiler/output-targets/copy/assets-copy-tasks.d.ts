import * as d from '../../../declarations';
export declare const getComponentAssetsCopyTasks: (config: d.Config, buildCtx: d.BuildCtx, dest: string, collectionsPath: boolean) => Required<d.CopyTask>[];
export declare const canSkipAssetsCopy: (compilerCtx: d.CompilerCtx, entryModules: d.EntryModule[], filesChanged: string[]) => boolean;
