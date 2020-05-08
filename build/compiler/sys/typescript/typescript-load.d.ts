import * as d from '../../../declarations';
import ts from 'typescript';
export declare const loadTypescript: (sys: d.CompilerSystem, diagnostics: d.Diagnostic[], typescriptPath: string) => Promise<TypeScriptModule>;
export declare const loadTypescriptSync: (sys: d.CompilerSystem, diagnostics: d.Diagnostic[], typescriptPath: string) => TypeScriptModule;
declare type TS = typeof ts;
export interface TypeScriptModule extends TS {
    __loaded: boolean;
    __source: string;
    __path: string;
}
export {};
