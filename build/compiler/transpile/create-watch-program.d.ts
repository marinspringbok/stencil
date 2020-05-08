import * as d from '../../declarations';
import ts from 'typescript';
export declare const createTsWatchProgram: (config: d.Config, buildCallback: (tsBuilder: ts.BuilderProgram) => Promise<void>) => Promise<{
    program: ts.WatchOfConfigFile<ts.EmitAndSemanticDiagnosticsBuilderProgram>;
    rebuild: () => void;
}>;
