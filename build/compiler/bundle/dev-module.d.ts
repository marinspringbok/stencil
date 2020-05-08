import * as d from '../../declarations';
import { PartialResolvedId } from 'rollup';
export declare const devNodeModuleResolveId: (config: d.Config, inMemoryFs: d.InMemoryFileSystem, resolvedId: PartialResolvedId, importee: string) => Promise<PartialResolvedId>;
export declare const compilerRequest: (config: d.Config, compilerCtx: d.CompilerCtx, data: d.CompilerRequest) => Promise<d.CompilerRequestResponse>;
