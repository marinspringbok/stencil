import * as d from '../../../declarations';
import ts from 'typescript';
export declare const updateLazyComponentClass: (transformOpts: d.TransformOptions, styleStatements: ts.Statement[], classNode: ts.ClassDeclaration, moduleFile: d.Module, cmp: d.ComponentCompilerMeta) => ts.VariableStatement | ts.ClassDeclaration;
