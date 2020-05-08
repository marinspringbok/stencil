import * as d from '../../../declarations';
import ts from 'typescript';
export declare const patchTypeScriptResolveModule: (loadedTs: typeof ts, config: d.Config, inMemoryFs: d.InMemoryFileSystem) => void;
export declare const tsResolveModuleName: (config: d.Config, compilerCtx: d.CompilerCtx, moduleName: string, containingFile: string) => ts.ResolvedModuleWithFailedLookupLocations;
export declare const tsResolveModuleNamePackageJsonPath: (config: d.Config, compilerCtx: d.CompilerCtx, moduleName: string, containingFile: string) => string;
export declare const patchedTsResolveModule: (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleName: string, containingFile: string) => ts.ResolvedModuleWithFailedLookupLocations;
export declare const tsResolveNodeModule: (config: d.Config, inMemoryFs: d.InMemoryFileSystem, moduleId: string, containingFile: string) => ts.ResolvedModuleWithFailedLookupLocations;
export declare const ensureExtension: (fileName: string, containingFile: string) => string;
