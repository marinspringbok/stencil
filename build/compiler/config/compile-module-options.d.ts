import { CompileOptions, CompileResults, Config, TransformOptions, TransformCssToEsmInput, ImportData } from '../../declarations';
export declare const getCompileResults: (code: string, input: CompileOptions) => {
    importData: ImportData;
    results: CompileResults;
};
export declare const getCompileModuleConfig: (input: CompileOptions) => {
    compileOpts: CompileOptions;
    config: Config;
    transformOpts: TransformOptions;
};
export declare const getCompileCssConfig: (compileOpts: CompileOptions, importData: ImportData, results: CompileResults) => TransformCssToEsmInput;
