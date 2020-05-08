import * as d from '../declarations';
export declare const createJsVarName: (fileName: string) => string;
export declare const getFileExt: (fileName: string) => string;
/**
 * Test if a file is a typescript source file, such as .ts or .tsx.
 * However, d.ts files and spec.ts files return false.
 * @param filePath
 */
export declare const isTsFile: (filePath: string) => boolean;
export declare const isDtsFile: (filePath: string) => boolean;
export declare const isJsFile: (filePath: string) => boolean;
export declare const hasFileExtension: (filePath: string, extensions: string[]) => boolean;
export declare const isCssFile: (filePath: string) => boolean;
export declare const isHtmlFile: (filePath: string) => boolean;
export declare const generatePreamble: (config: d.Config, opts?: {
    prefix?: string;
    suffix?: string;
    defaultBanner?: boolean;
}) => string;
export declare const isDocsPublic: (jsDocs: d.CompilerJsDoc | d.JsDoc) => boolean;
export declare function getTextDocs(docs: d.CompilerJsDoc | undefined | null): string;
export declare const getDependencies: (buildCtx: d.BuildCtx) => string[];
export declare const hasDependency: (buildCtx: d.BuildCtx, depName: string) => boolean;
export declare const getDynamicImportFunction: (namespace: string) => string;
export declare const readPackageJson: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
export declare const parsePackageJson: (pkgJsonStr: string, pkgJsonFilePath: string) => {
    diagnostic: d.Diagnostic;
    data: d.PackageJsonData;
    filePath: string;
};
export declare const parseJson: (jsonStr: string, filePath?: string) => {
    diagnostic: d.Diagnostic;
    data: any;
    filePath: string;
};
