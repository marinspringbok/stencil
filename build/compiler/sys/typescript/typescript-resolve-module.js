import { basename, dirname, isAbsolute, join, resolve } from 'path';
import { getStencilInternalDtsPath, isDtsFile, isJsFile, isJsxFile, isLocalModule, isStencilCoreImport, isTsxFile, isTsFile, isJsonFile } from '../resolve/resolve-utils';
import { isExternalUrl } from '../fetch/fetch-utils';
import { isString, IS_LOCATION_ENV, IS_NODE_ENV, IS_WEB_WORKER_ENV, normalizePath } from '@utils';
import { patchTsSystemFileSystem } from './typescript-sys';
import { resolveRemoteModuleIdSync } from '../resolve/resolve-module-sync';
import { version } from '../../../version';
import ts from 'typescript';
export const patchTypeScriptResolveModule = (loadedTs, config, inMemoryFs) => {
    let compilerExe;
    if (config.sys) {
        compilerExe = config.sys.getCompilerExecutingPath();
    }
    else if (IS_LOCATION_ENV) {
        compilerExe = location.href;
    }
    if (shouldPatchRemoteTypeScript(compilerExe)) {
        const resolveModuleName = (loadedTs.__resolveModuleName = loadedTs.resolveModuleName);
        loadedTs.resolveModuleName = (moduleName, containingFile, compilerOptions, host, cache, redirectedReference) => {
            const resolvedModule = patchedTsResolveModule(config, inMemoryFs, moduleName, containingFile);
            if (resolvedModule) {
                return resolvedModule;
            }
            return resolveModuleName(moduleName, containingFile, compilerOptions, host, cache, redirectedReference);
        };
    }
};
export const tsResolveModuleName = (config, compilerCtx, moduleName, containingFile) => {
    const resolveModuleName = ts.__resolveModuleName || ts.resolveModuleName;
    if (moduleName && resolveModuleName && config.tsCompilerOptions) {
        const host = patchTsSystemFileSystem(config, config.sys, compilerCtx.fs, {});
        const compilerOptions = Object.assign({}, config.tsCompilerOptions);
        compilerOptions.resolveJsonModule = true;
        return resolveModuleName(moduleName, containingFile, compilerOptions, host);
    }
    return null;
};
export const tsResolveModuleNamePackageJsonPath = (config, compilerCtx, moduleName, containingFile) => {
    try {
        const resolvedModule = tsResolveModuleName(config, compilerCtx, moduleName, containingFile);
        if (resolvedModule && resolvedModule.resolvedModule && resolvedModule.resolvedModule.resolvedFileName) {
            const rootDir = resolve('/');
            let resolvedFileName = resolvedModule.resolvedModule.resolvedFileName;
            for (let i = 0; i < 30; i++) {
                if (rootDir === resolvedFileName) {
                    return null;
                }
                resolvedFileName = dirname(resolvedFileName);
                const pkgJsonPath = join(resolvedFileName, 'package.json');
                const exists = config.sys.accessSync(pkgJsonPath);
                if (exists) {
                    return normalizePath(pkgJsonPath);
                }
            }
        }
    }
    catch (e) {
        config.logger.error(e);
    }
    return null;
};
export const patchedTsResolveModule = (config, inMemoryFs, moduleName, containingFile) => {
    if (isLocalModule(moduleName)) {
        const containingDir = dirname(containingFile);
        let resolvedFileName = join(containingDir, moduleName);
        resolvedFileName = normalizePath(ensureExtension(resolvedFileName, containingFile));
        if (!isAbsolute(resolvedFileName) && !resolvedFileName.startsWith('.') && !resolvedFileName.startsWith('/')) {
            resolvedFileName = './' + resolvedFileName;
        }
        return {
            resolvedModule: {
                extension: getTsResolveExtension(resolvedFileName),
                resolvedFileName,
                packageId: {
                    name: moduleName,
                    subModuleName: '',
                    version,
                },
            },
        };
    }
    // node module id
    return tsResolveNodeModule(config, inMemoryFs, moduleName, containingFile);
};
export const tsResolveNodeModule = (config, inMemoryFs, moduleId, containingFile) => {
    if (isStencilCoreImport(moduleId)) {
        return {
            resolvedModule: {
                extension: ts.Extension.Dts,
                resolvedFileName: getStencilInternalDtsPath(config.rootDir),
                packageId: {
                    name: moduleId,
                    subModuleName: '',
                    version,
                },
            },
        };
    }
    const resolved = resolveRemoteModuleIdSync(config, inMemoryFs, {
        moduleId,
        containingFile,
    });
    if (resolved) {
        return {
            resolvedModule: {
                extension: ts.Extension.Js,
                resolvedFileName: resolved.resolvedUrl,
                packageId: {
                    name: moduleId,
                    subModuleName: '',
                    version: resolved.packageJson.version,
                },
            },
        };
    }
    return null;
};
export const ensureExtension = (fileName, containingFile) => {
    if (!basename(fileName).includes('.') && isString(containingFile)) {
        containingFile = containingFile.toLowerCase();
        if (isJsFile(containingFile)) {
            fileName += '.js';
        }
        else if (isDtsFile(containingFile)) {
            fileName += '.d.ts';
        }
        else if (isTsxFile(containingFile)) {
            fileName += '.tsx';
        }
        else if (isTsFile(containingFile)) {
            fileName += '.ts';
        }
        else if (isJsxFile(containingFile)) {
            fileName += '.jsx';
        }
    }
    return fileName;
};
const getTsResolveExtension = (p) => {
    if (isDtsFile(p)) {
        return ts.Extension.Dts;
    }
    if (isTsxFile(p)) {
        return ts.Extension.Tsx;
    }
    if (isJsFile(p)) {
        return ts.Extension.Js;
    }
    if (isJsxFile(p)) {
        return ts.Extension.Jsx;
    }
    if (isJsonFile(p)) {
        return ts.Extension.Json;
    }
    return ts.Extension.Ts;
};
const shouldPatchRemoteTypeScript = (compilerExe) => !IS_NODE_ENV && IS_WEB_WORKER_ENV && isExternalUrl(compilerExe);
