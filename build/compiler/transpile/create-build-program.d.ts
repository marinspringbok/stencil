import * as d from '../../declarations';
import ts from 'typescript';
export declare const createTsBuildProgram: (config: d.Config, buildCallback: (tsBuilder: ts.BuilderProgram) => Promise<void>) => Promise<ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>>;
