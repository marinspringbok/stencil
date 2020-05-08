import * as d from '../../declarations';
export declare const optimizeEsmImport: (config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, outputTarget: d.OutputTargetWww) => Promise<boolean>;
export declare const updateImportPaths: (code: string, newDir: string) => {
    code: string;
    orgImportPaths: string[];
};
