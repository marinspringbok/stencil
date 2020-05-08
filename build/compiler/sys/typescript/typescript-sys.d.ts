import * as d from '../../../declarations';
import { TypeScriptModule } from './typescript-load';
import ts from 'typescript';
export declare const patchTypeScriptSys: (loadedTs: TypeScriptModule, config: d.Config, inMemoryFs: d.InMemoryFileSystem) => void;
export declare const patchTsSystemFileSystem: (config: d.Config, stencilSys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, tsSys: ts.System) => ts.System;
export declare const getTypescriptPathFromUrl: (rootDir: string, tsExecutingUrl: string, url: string) => string;
export declare const patchTsSystemUtils: (tsSys: ts.System) => void;
export declare const patchTypeScriptGetParsedCommandLineOfConfigFile: (loadedTs: TypeScriptModule, _config: d.Config) => void;
