import * as d from '../../declarations';
import ts from 'typescript';
export declare const getModule: (compilerCtx: d.CompilerCtx, filePath: string) => d.Module;
export declare const createModule: (staticSourceFile: ts.SourceFile, staticSourceFileText: string, emitFilepath: string) => d.Module;
