import { CompilerCtx, Config, Diagnostic, SourceTarget } from '../../declarations';
import { MinifyOptions } from 'terser';
interface OptimizeModuleOptions {
    input: string;
    sourceTarget?: SourceTarget;
    isCore?: boolean;
    minify?: boolean;
    inlineHelpers?: boolean;
    modeName?: string;
}
export declare const optimizeModule: (config: Config, compilerCtx: CompilerCtx, opts: OptimizeModuleOptions) => Promise<{
    output: string;
    sourceMap: any;
    diagnostics: Diagnostic[];
} | {
    output: string;
    diagnostics: Diagnostic[];
}>;
export declare const getTerserOptions: (config: Config, sourceTarget: SourceTarget, prettyOutput: boolean) => MinifyOptions;
export declare const prepareModule: (input: string, minifyOpts: MinifyOptions, transpile: boolean, inlineHelpers: boolean) => Promise<{
    output: string;
    sourceMap: any;
    diagnostics: Diagnostic[];
}>;
export {};
