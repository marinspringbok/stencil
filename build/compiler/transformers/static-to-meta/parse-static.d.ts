import * as d from '../../../declarations';
import ts from 'typescript';
export declare const updateModule: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsSourceFile: ts.SourceFile, sourceFileText: string, emitFilePath: string, typeChecker: ts.TypeChecker, collection: d.CollectionCompilerMeta) => d.Module;
