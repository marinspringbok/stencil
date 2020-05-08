import * as d from '../../../declarations';
import ts from 'typescript';
export declare const parseStaticComponentMeta: (compilerCtx: d.CompilerCtx, typeChecker: ts.TypeChecker, cmpNode: ts.ClassDeclaration, moduleFile: d.Module, nodeMap: d.NodeMap, transformOpts?: d.TransformOptions) => ts.ClassDeclaration;
