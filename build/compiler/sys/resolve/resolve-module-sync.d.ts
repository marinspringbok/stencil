import * as d from '../../../declarations';
import resolve from 'resolve';
export declare const resolveRemoteModuleIdSync: (config: d.Config, inMemoryFs: d.InMemoryFileSystem, opts: d.ResolveModuleIdOptions) => {
    resolvedUrl: string;
    packageJson: d.PackageJsonData;
};
export declare const resolveModuleIdSync: (sys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, opts: d.ResolveModuleIdOptions) => string;
export declare const createCustomResolverSync: (sys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, exts: string[]) => resolve.SyncOpts;
