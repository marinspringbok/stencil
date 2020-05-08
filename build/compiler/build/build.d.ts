import * as d from '../../declarations';
import ts from 'typescript';
export declare const build: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => Promise<d.CompilerBuildResults>;
