import * as d from '../../declarations';
import ts from 'typescript';
export declare const augmentDiagnosticWithNode: (d: d.Diagnostic, node: ts.Node) => d.Diagnostic;
/**
 * Ok, so formatting overkill, we know. But whatever, it makes for great
 * error reporting within a terminal. So, yeah, let's code it up, shall we?
 */
export declare const loadTypeScriptDiagnostics: (tsDiagnostics: readonly ts.Diagnostic[]) => d.Diagnostic[];
export declare const loadTypeScriptDiagnostic: (tsDiagnostic: ts.Diagnostic) => d.Diagnostic;
