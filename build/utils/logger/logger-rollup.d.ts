import * as d from '../../declarations';
import { RollupError } from 'rollup';
export declare const loadRollupDiagnostics: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, rollupError: RollupError) => void;
export declare const createOnWarnFn: (diagnostics: d.Diagnostic[], bundleModulesFiles?: d.Module[]) => (warning: {
    code: string;
    importer: string;
    message: string;
}) => void;
