import * as d from '../../declarations';
import ts from 'typescript';
export declare const runTsProgram: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, tsBuilder: ts.BuilderProgram) => Promise<boolean>;
