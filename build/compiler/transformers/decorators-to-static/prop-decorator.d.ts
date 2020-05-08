import * as d from '../../../declarations';
import ts from 'typescript';
export declare const propDecoratorsToStatic: (diagnostics: d.Diagnostic[], decoratedProps: ts.ClassElement[], typeChecker: ts.TypeChecker, watchable: Set<string>, newMembers: ts.ClassElement[]) => void;
export declare const propTypeFromTSType: (type: ts.Type) => "unknown" | "any" | "string" | "number" | "boolean";
