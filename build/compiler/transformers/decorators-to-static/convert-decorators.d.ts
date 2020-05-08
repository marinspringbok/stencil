import * as d from '../../../declarations';
import ts from 'typescript';
export declare const convertDecoratorsToStatic: (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker) => ts.TransformerFactory<ts.SourceFile>;
export declare const visitClassDeclaration: (config: d.Config, diagnostics: d.Diagnostic[], typeChecker: ts.TypeChecker, classNode: ts.ClassDeclaration) => ts.ClassDeclaration;
