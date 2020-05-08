import * as d from '../../../declarations';
export declare const httpFetch: (sys: d.CompilerSystem, input: RequestInfo, init?: RequestInit) => Promise<any>;
export declare const packageVersions: Map<string, string>;
export declare const known404Urls: Set<string>;
export declare const isExternalUrl: (p: string) => boolean;
export declare const getRemoteModuleUrl: (sys: d.CompilerSystem, module: {
    moduleId: string;
    path: string;
    version?: string;
}) => string;
export declare const getRemotePackageJsonUrl: (sys: d.CompilerSystem, moduleId: string) => string;
export declare const getStencilRootUrl: (compilerExe: string) => string;
export declare const getStencilModuleUrl: (compilerExe: string, p: string) => string;
export declare const getStencilInternalDtsUrl: (compilerExe: string) => string;
export declare const getCommonDirUrl: (sys: d.CompilerSystem, pkgVersions: Map<string, string>, dirPath: string, fileName: string) => string;
export declare const getNodeModuleFetchUrl: (sys: d.CompilerSystem, pkgVersions: Map<string, string>, filePath: string) => string;
export declare const skipFilePathFetch: (filePath: string) => boolean;
export declare const skipUrlFetch: (url: string) => boolean;
