import * as d from '../../declarations';
import { Plugin } from 'rollup';
export declare const appDataPlugin: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.BuildConditionals, platform: "worker" | "client" | "hydrate") => Plugin;
export declare const getGlobalScriptData: (config: d.Config, compilerCtx: d.CompilerCtx) => GlobalScript[];
interface GlobalScript {
    defaultName: string;
    path: string;
}
export {};
