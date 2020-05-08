import * as d from '../../declarations';
export declare const normalizeDiagnostics: (compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[]) => d.Diagnostic[];
export declare const splitLineBreaks: (sourceText: string) => string[];
export declare const escapeHtml: (unsafe: any) => any;
export declare const MAX_ERRORS = 25;
