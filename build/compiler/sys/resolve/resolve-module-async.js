import { COMMON_DIR_FILENAMES, getCommonDirName, getPackageDirPath, isCommonDirModuleFile, shouldFetchModule } from './resolve-utils';
import { basename, dirname } from 'path';
import { fetchModuleAsync } from '../fetch/fetch-module-async';
import { getCommonDirUrl, getNodeModuleFetchUrl, packageVersions } from '../fetch/fetch-utils';
import { isString, normalizeFsPath, normalizePath } from '@utils';
import resolve from 'resolve';
export const resolveModuleIdAsync = (sys, inMemoryFs, opts) => {
    const resolverOpts = createCustomResolverAsync(sys, inMemoryFs, opts.exts);
    resolverOpts.basedir = dirname(opts.containingFile);
    if (opts.packageFilter) {
        resolverOpts.packageFilter = opts.packageFilter;
    }
    else if (opts.packageFilter !== null) {
        resolverOpts.packageFilter = pkg => {
            if (!isString(pkg.main) || pkg.main === '') {
                pkg.main = 'package.json';
            }
            return pkg;
        };
    }
    return new Promise((resolvePromise, rejectPromise) => {
        resolve(opts.moduleId, resolverOpts, (err, resolveId, pkgData) => {
            if (err) {
                rejectPromise(err);
            }
            else {
                resolveId = normalizePath(resolveId);
                const results = {
                    moduleId: opts.moduleId,
                    resolveId,
                    pkgData,
                    pkgDirPath: getPackageDirPath(resolveId, opts.moduleId),
                };
                resolvePromise(results);
            }
        });
    });
};
export const createCustomResolverAsync = (sys, inMemoryFs, exts) => {
    return {
        async isFile(filePath, cb) {
            const fsFilePath = normalizeFsPath(filePath);
            const stat = await inMemoryFs.stat(fsFilePath);
            if (stat.isFile) {
                cb(null, true);
                return;
            }
            if (shouldFetchModule(fsFilePath)) {
                const endsWithExt = exts.some(ext => fsFilePath.endsWith(ext));
                if (endsWithExt) {
                    const url = getNodeModuleFetchUrl(sys, packageVersions, fsFilePath);
                    const content = await fetchModuleAsync(sys, inMemoryFs, packageVersions, url, fsFilePath);
                    const checkFileExists = typeof content === 'string';
                    cb(null, checkFileExists);
                    return;
                }
            }
            cb(null, false);
        },
        async isDirectory(dirPath, cb) {
            const fsDirPath = normalizeFsPath(dirPath);
            const stat = await inMemoryFs.stat(fsDirPath);
            if (stat.isDirectory) {
                cb(null, true);
                return;
            }
            if (shouldFetchModule(fsDirPath)) {
                if (basename(fsDirPath) === 'node_modules') {
                    // just the /node_modules directory
                    inMemoryFs.sys.mkdirSync(fsDirPath);
                    inMemoryFs.clearFileCache(fsDirPath);
                    cb(null, true);
                    return;
                }
                if (isCommonDirModuleFile(fsDirPath)) {
                    // don't bother seeing if it's a directory if it has a common file extension
                    cb(null, false);
                    return;
                }
                for (const fileName of COMMON_DIR_FILENAMES) {
                    const url = getCommonDirUrl(sys, packageVersions, fsDirPath, fileName);
                    const filePath = getCommonDirName(fsDirPath, fileName);
                    const content = await fetchModuleAsync(sys, inMemoryFs, packageVersions, url, filePath);
                    if (isString(content)) {
                        cb(null, true);
                        return;
                    }
                }
            }
            cb(null, false);
        },
        async readFile(p, cb) {
            const fsFilePath = normalizeFsPath(p);
            const data = await inMemoryFs.readFile(fsFilePath);
            if (isString(data)) {
                return cb(null, data);
            }
            return cb(`readFile not found: ${p}`, undefined);
        },
        extensions: exts,
    };
};
