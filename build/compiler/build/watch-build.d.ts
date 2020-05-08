import * as d from '../../declarations';
export declare const createWatchBuild: (config: d.Config, compilerCtx: d.CompilerCtx) => Promise<d.CompilerWatcher>;
export declare const watchSrcDirectory: (config: d.Config, compilerCtx: d.CompilerCtx, callback: d.CompilerFileWatcherCallback) => Promise<{
    close(): void;
}>;
