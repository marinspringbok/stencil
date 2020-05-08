import * as d from '../../declarations';
export declare const parseCssImports: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, srcFilePath: string, resolvedFilePath: string, styleText: string, styleDocs?: d.StyleDoc[]) => Promise<{
    imports: string[];
    styleText: string;
}>;
export declare const getCssImports: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, filePath: string, styleText: string) => Promise<d.CssImportData[]>;
export declare const isCssNodeModule: (url: string) => boolean;
export declare const resolveCssNodeModule: (config: d.Config, compilerCtx: d.CompilerCtx, diagnostics: d.Diagnostic[], filePath: string, cssImportData: d.CssImportData) => Promise<void>;
export declare const isLocalCssImport: (srcImport: string) => boolean;
export declare const replaceNodeModuleUrl: (baseCssFilePath: string, moduleId: string, nodeModulePath: string, url: string) => string;
export declare const getModuleId: (orgImport: string) => {
    moduleId: string;
    filePath: string;
};
export declare const replaceImportDeclarations: (styleText: string, cssImports: d.CssImportData[], isCssEntry: boolean) => string;
