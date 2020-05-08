import * as d from '../declarations';
export declare const buildError: (diagnostics?: d.Diagnostic[]) => d.Diagnostic;
export declare const buildWarn: (diagnostics: d.Diagnostic[]) => d.Diagnostic;
export declare const buildJsonFileError: (compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], jsonFilePath: string, msg: string, pkgKey: string) => d.Diagnostic;
export declare const catchError: (diagnostics: d.Diagnostic[], err: Error, msg?: string) => d.Diagnostic;
export declare const hasError: (diagnostics: d.Diagnostic[]) => boolean;
export declare const hasWarning: (diagnostics: d.Diagnostic[]) => boolean;
export declare const shouldIgnoreError: (msg: any) => boolean;
export declare const TASK_CANCELED_MSG = "task canceled";
