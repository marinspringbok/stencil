import * as d from '../../../declarations';
export declare const writeFetchSuccessSync: (sys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string, content: string, pkgVersions: Map<string, string>) => void;
export declare const writeFetchSuccessAsync: (sys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, url: string, filePath: string, content: string, pkgVersions: Map<string, string>) => Promise<void>;
