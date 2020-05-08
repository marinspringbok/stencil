import { IS_FETCH_ENV, IS_NODE_ENV, normalizePath } from '@utils';
import { join } from 'path';
const COMMON_DIR_MODULE_EXTS = ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json', '.md'];
export const COMMON_DIR_FILENAMES = ['package.json', 'index.js', 'index.mjs'];
export const isDtsFile = (p) => p.endsWith('.d.ts');
export const isTsFile = (p) => !isDtsFile(p) && p.endsWith('.ts');
export const isTsxFile = (p) => p.endsWith('.tsx');
export const isJsxFile = (p) => p.endsWith('.jsx');
export const isJsFile = (p) => p.endsWith('.js');
export const isMjsFile = (p) => p.endsWith('.mjs');
export const isJsonFile = (p) => p.endsWith('.json');
export const getCommonDirName = (dirPath, fileName) => dirPath + '/' + fileName;
export const isCommonDirModuleFile = (p) => COMMON_DIR_MODULE_EXTS.some(ext => p.endsWith(ext));
export const setPackageVersion = (pkgVersions, pkgName, pkgVersion) => {
    pkgVersions.set(pkgName, pkgVersion);
};
export const setPackageVersionByContent = (pkgVersions, pkgContent) => {
    try {
        const pkg = JSON.parse(pkgContent);
        if (pkg.name && pkg.version) {
            setPackageVersion(pkgVersions, pkg.name, pkg.version);
        }
    }
    catch (e) { }
};
export const getNodeModulePath = (rootDir, ...pathParts) => normalizePath(join.apply(null, [rootDir, 'node_modules', ...pathParts]));
export const getStencilModulePath = (rootDir, ...pathParts) => getNodeModulePath(rootDir, '@stencil', 'core', ...pathParts);
export const getStencilInternalDtsPath = (rootDir) => getStencilModulePath(rootDir, 'internal', 'index.d.ts');
export const isLocalModule = (p) => p.startsWith('.') || p.startsWith('/');
export const isStencilCoreImport = (p) => p.startsWith('@stencil/core');
export const shouldFetchModule = (p) => IS_FETCH_ENV && !IS_NODE_ENV && isNodeModulePath(p);
export const isNodeModulePath = (p) => normalizePath(p)
    .split('/')
    .includes('node_modules');
export const getPackageDirPath = (p, moduleId) => {
    const parts = normalizePath(p).split('/');
    for (let i = parts.length - 1; i >= 1; i--) {
        if (parts[i - 1] === 'node_modules' && parts[i] === moduleId) {
            return parts.slice(0, i + 1).join('/');
        }
    }
    return null;
};
