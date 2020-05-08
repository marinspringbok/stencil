import * as d from '../../declarations';
export declare const updateStencilTypesImports: (typesDir: string, dtsFilePath: string, dtsContent: string) => string;
export declare const copyStencilCoreDts: (config: d.Config, compilerCtx: d.CompilerCtx) => Promise<d.FsWriteResults[]>;
