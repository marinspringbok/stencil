import * as d from '../../../declarations';
import ts from 'typescript';
export declare const parseStaticStyles: (compilerCtx: d.CompilerCtx, tagName: string, componentFilePath: string, isCollectionDependency: boolean, staticMembers: ts.ClassElement[]) => d.StyleCompiler[];
