import * as d from '../../../declarations';
import tsTypes from 'typescript';
export declare const validateTsConfig: (ts: typeof tsTypes, config: d.Config, sys: d.CompilerSystem, init: d.LoadConfigInit) => Promise<{
    path: string;
    compilerOptions: any;
    diagnostics: d.Diagnostic[];
}>;
