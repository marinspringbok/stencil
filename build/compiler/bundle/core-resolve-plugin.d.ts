import * as d from '../../declarations';
import { Plugin } from 'rollup';
export declare const coreResolvePlugin: (config: d.Config, compilerCtx: d.CompilerCtx, platform: "worker" | "client" | "hydrate") => Plugin;
export declare const getStencilInternalModule: (rootDir: string, compilerExe: string, internalModule: string) => string;
export declare const getHydratedFlagHead: (h: d.HydratedFlag) => string;
