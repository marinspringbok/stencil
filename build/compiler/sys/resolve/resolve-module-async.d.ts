import * as d from '../../../declarations';
export declare const resolveModuleIdAsync: (sys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, opts: d.ResolveModuleIdOptions) => Promise<d.ResolveModuleIdResults>;
export declare const createCustomResolverAsync: (sys: d.CompilerSystem, inMemoryFs: d.InMemoryFileSystem, exts: string[]) => any;
