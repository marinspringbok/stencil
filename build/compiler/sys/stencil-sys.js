import { basename, dirname } from 'path';
import { buildEvents } from '../events';
import { createWebWorkerMainController } from './worker/web-worker-main';
import { HAS_WEB_WORKER, IS_NODE_ENV, IS_WEB_WORKER_ENV, normalizePath, isRootPath } from '@utils';
import { resolveModuleIdAsync } from './resolve/resolve-module-async';
export const createSystem = () => {
    const items = new Map();
    const destroys = new Set();
    const addDestory = (cb) => destroys.add(cb);
    const removeDestory = (cb) => destroys.delete(cb);
    const events = buildEvents();
    const destroy = async () => {
        const waits = [];
        destroys.forEach(cb => {
            try {
                const rtn = cb();
                if (rtn && rtn.then) {
                    waits.push(rtn);
                }
            }
            catch (e) {
                console.error(`stencil sys destroy: ${e}`);
            }
        });
        await Promise.all(waits);
        destroys.clear();
    };
    const normalize = (p) => {
        if (p === '/' || p === '') {
            return '/';
        }
        const dir = dirname(p);
        const base = basename(p);
        if (dir.endsWith('/')) {
            return normalizePath(`${dir}${base}`);
        }
        return normalizePath(`${dir}/${base}`);
    };
    const accessSync = (p) => {
        const item = items.get(normalize(p));
        return !!(item && (item.isDirectory || item.isFile));
    };
    const access = async (p) => accessSync(p);
    const copyFile = async (src, dest) => {
        writeFileSync(dest, readFileSync(src));
        return true;
    };
    const encodeToBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
    const getCurrentDirectory = () => {
        if (IS_NODE_ENV) {
            return global['process'].cwd();
        }
        return '/';
    };
    const getCompilerExecutingPath = () => {
        if (IS_NODE_ENV) {
            return __filename;
        }
        if (IS_WEB_WORKER_ENV) {
            return location.href;
        }
        throw new Error('unable to find executing path');
    };
    const isSymbolicLink = async (_p) => false;
    const mkdirSync = (p, opts) => {
        p = normalize(p);
        const results = {
            basename: basename(p),
            dirname: dirname(p),
            path: p,
            newDirs: [],
            error: null,
        };
        mkdirRecursiveSync(p, opts, results);
        return results;
    };
    const mkdirRecursiveSync = (p, opts, results) => {
        const parentDir = dirname(p);
        if (opts && opts.recursive && !isRootPath(parentDir)) {
            mkdirRecursiveSync(parentDir, opts, results);
        }
        const item = items.get(p);
        if (!item) {
            items.set(p, {
                basename: basename(p),
                dirname: parentDir,
                isDirectory: true,
                isFile: false,
                watcherCallbacks: null,
                data: undefined,
            });
            results.newDirs.push(p);
            emitDirectoryWatch(p, new Set());
        }
        else {
            item.isDirectory = true;
            item.isFile = false;
        }
    };
    const mkdir = async (p, opts) => mkdirSync(p, opts);
    const readdirSync = (p) => {
        p = normalize(p);
        const dirItems = [];
        const dir = items.get(p);
        if (dir && dir.isDirectory) {
            items.forEach((item, itemPath) => {
                if (itemPath !== '/') {
                    if (p.endsWith('/') && `${p}${item.basename}` === itemPath) {
                        dirItems.push(itemPath);
                    }
                    else if (`${p}/${item.basename}` === itemPath) {
                        dirItems.push(itemPath);
                    }
                }
            });
        }
        return dirItems.sort();
    };
    const readdir = async (p) => readdirSync(p);
    const readFileSync = (p) => {
        p = normalize(p);
        const item = items.get(p);
        if (item && item.isFile) {
            return item.data;
        }
        return undefined;
    };
    const readFile = async (p) => readFileSync(p);
    const realpathSync = (p) => normalize(p);
    const realpath = async (p) => realpathSync(p);
    const rename = async (oldPath, newPath) => {
        oldPath = normalizePath(oldPath);
        newPath = normalizePath(newPath);
        const results = {
            oldPath,
            newPath,
            renamed: [],
            oldDirs: [],
            oldFiles: [],
            newDirs: [],
            newFiles: [],
            isFile: false,
            isDirectory: false,
            error: null,
        };
        const stats = statSync(oldPath);
        if (stats) {
            if (stats.isFile()) {
                results.isFile = true;
            }
            else if (stats.isDirectory()) {
                results.isDirectory = true;
            }
            renameNewRecursiveSync(oldPath, newPath, results);
            if (!results.error) {
                if (results.isDirectory) {
                    const rmdirResults = rmdirSync(oldPath, { recursive: true });
                    if (rmdirResults.error) {
                        results.error = rmdirResults.error;
                    }
                    else {
                        results.oldDirs.push(...rmdirResults.removedDirs);
                        results.oldFiles.push(...rmdirResults.removedFiles);
                    }
                }
                else if (results.isFile) {
                    const unlinkResults = unlinkSync(oldPath);
                    if (unlinkResults.error) {
                        results.error = unlinkResults.error;
                    }
                    else {
                        results.oldFiles.push(oldPath);
                    }
                }
            }
        }
        else {
            results.error = `${oldPath} does not exist`;
        }
        return results;
    };
    const renameNewRecursiveSync = (oldPath, newPath, results) => {
        const itemStat = statSync(oldPath);
        if (itemStat && !results.error) {
            if (itemStat.isFile()) {
                const newFileParentDir = dirname(newPath);
                const mkdirResults = mkdirSync(newFileParentDir, { recursive: true });
                const fileContent = items.get(oldPath).data;
                const writeResults = writeFileSync(newPath, fileContent);
                results.newDirs.push(...mkdirResults.newDirs);
                results.renamed.push({
                    oldPath,
                    newPath,
                    isDirectory: false,
                    isFile: true,
                });
                if (writeResults.error) {
                    results.error = writeResults.error;
                }
                else {
                    results.newFiles.push(newPath);
                }
            }
            else if (itemStat.isDirectory()) {
                const oldDirItemChildPaths = readdirSync(oldPath);
                const mkdirResults = mkdirSync(newPath, { recursive: true });
                results.newDirs.push(...mkdirResults.newDirs);
                results.renamed.push({
                    oldPath,
                    newPath,
                    isDirectory: true,
                    isFile: false,
                });
                for (const oldDirItemChildPath of oldDirItemChildPaths) {
                    const newDirItemChildPath = oldDirItemChildPath.replace(oldPath, newPath);
                    renameNewRecursiveSync(oldDirItemChildPath, newDirItemChildPath, results);
                }
            }
        }
    };
    const resolvePath = (p) => normalize(p);
    const rmdirSync = (p, opts = {}) => {
        const results = {
            basename: basename(p),
            dirname: dirname(p),
            path: p,
            removedDirs: [],
            removedFiles: [],
            error: null,
        };
        rmdirSyncRecursive(p, opts, results);
        return results;
    };
    const rmdirSyncRecursive = (p, opts, results) => {
        if (!results.error) {
            p = normalize(p);
            const dirItemPaths = readdirSync(p);
            if (opts && opts.recursive) {
                for (const dirItemPath of dirItemPaths) {
                    const item = items.get(dirItemPath);
                    if (item) {
                        if (item.isDirectory) {
                            rmdirSyncRecursive(dirItemPath, opts, results);
                        }
                        else if (item.isFile) {
                            const unlinkResults = unlinkSync(dirItemPath);
                            if (unlinkResults.error) {
                                results.error = unlinkResults.error;
                            }
                            else {
                                results.removedFiles.push(dirItemPath);
                            }
                        }
                    }
                }
            }
            else {
                if (dirItemPaths.length > 0) {
                    results.error = `cannot delete directory that contains files/subdirectories`;
                    return;
                }
            }
            items.delete(p);
            emitDirectoryWatch(p, new Set());
            results.removedDirs.push(p);
        }
    };
    const rmdir = async (p, opts = {}) => rmdirSync(p, opts);
    const statSync = (p) => {
        p = normalize(p);
        const item = items.get(p);
        if (item && (item.isDirectory || item.isFile)) {
            const s = {
                isDirectory: () => item.isDirectory,
                isFile: () => item.isFile,
                isSymbolicLink: () => false,
                size: item.isFile ? item.data.length : 0,
            };
            return s;
        }
        return undefined;
    };
    const stat = async (p) => statSync(p);
    const unlinkSync = (p) => {
        p = normalize(p);
        const results = {
            basename: basename(p),
            dirname: dirname(p),
            path: p,
            error: null,
        };
        const item = items.get(p);
        if (item) {
            if (item.watcherCallbacks) {
                for (const watcherCallback of item.watcherCallbacks) {
                    watcherCallback(p, 'fileDelete');
                }
            }
            items.delete(p);
            emitDirectoryWatch(p, new Set());
        }
        return results;
    };
    const unlink = async (p) => unlinkSync(p);
    const watchDirectory = (p, dirWatcherCallback) => {
        p = normalize(p);
        const item = items.get(p);
        const close = () => {
            const closeItem = items.get(p);
            if (closeItem && closeItem.watcherCallbacks) {
                const index = closeItem.watcherCallbacks.indexOf(dirWatcherCallback);
                if (index > -1) {
                    closeItem.watcherCallbacks.splice(index, 1);
                }
            }
        };
        addDestory(close);
        if (item) {
            item.isDirectory = true;
            item.isFile = false;
            item.watcherCallbacks = item.watcherCallbacks || [];
            item.watcherCallbacks.push(dirWatcherCallback);
        }
        else {
            items.set(p, {
                basename: basename(p),
                dirname: dirname(p),
                isDirectory: true,
                isFile: false,
                watcherCallbacks: [dirWatcherCallback],
                data: undefined,
            });
        }
        return {
            close() {
                removeDestory(close);
                close();
            },
        };
    };
    const watchFile = (p, fileWatcherCallback) => {
        p = normalize(p);
        const item = items.get(p);
        const close = () => {
            const closeItem = items.get(p);
            if (closeItem && closeItem.watcherCallbacks) {
                const index = closeItem.watcherCallbacks.indexOf(fileWatcherCallback);
                if (index > -1) {
                    closeItem.watcherCallbacks.splice(index, 1);
                }
            }
        };
        addDestory(close);
        if (item) {
            item.isDirectory = false;
            item.isFile = true;
            item.watcherCallbacks = item.watcherCallbacks || [];
            item.watcherCallbacks.push(fileWatcherCallback);
        }
        else {
            items.set(p, {
                basename: basename(p),
                dirname: dirname(p),
                isDirectory: true,
                isFile: false,
                watcherCallbacks: [fileWatcherCallback],
                data: undefined,
            });
        }
        return {
            close() {
                removeDestory(close);
                close();
            },
        };
    };
    const emitDirectoryWatch = (p, emitted) => {
        const parentDir = normalize(dirname(p));
        const dirItem = items.get(parentDir);
        if (dirItem && dirItem.isDirectory && dirItem.watcherCallbacks) {
            for (const watcherCallback of dirItem.watcherCallbacks) {
                watcherCallback(p, null);
            }
        }
        if (!emitted.has(parentDir)) {
            emitted.add(parentDir);
            emitDirectoryWatch(parentDir, emitted);
        }
    };
    const writeFileSync = (p, data) => {
        p = normalize(p);
        const results = {
            path: p,
            error: null,
        };
        const item = items.get(p);
        if (item) {
            const hasChanged = item.data !== data;
            item.data = data;
            if (hasChanged && item.watcherCallbacks) {
                for (const watcherCallback of item.watcherCallbacks) {
                    watcherCallback(p, 'fileUpdate');
                }
            }
        }
        else {
            items.set(p, {
                basename: basename(p),
                dirname: dirname(p),
                isDirectory: false,
                isFile: true,
                watcherCallbacks: null,
                data,
            });
            emitDirectoryWatch(p, new Set());
        }
        return results;
    };
    const writeFile = async (p, data) => writeFileSync(p, data);
    const generateContentHash = async (content) => {
        const arrayBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(content));
        const hashArray = Array.from(new Uint8Array(arrayBuffer)); // convert buffer to byte array
        let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        if (typeof length === 'number') {
            hashHex = hashHex.substr(0, length);
        }
        return hashHex;
    };
    const copy = async (copyTasks, srcDir) => {
        const results = {
            diagnostics: [],
            dirPaths: [],
            filePaths: [],
        };
        console.log('todo, copy task', copyTasks.length, srcDir);
        return results;
    };
    const fileWatchTimeout = 32;
    mkdirSync('/');
    const sys = {
        events,
        access,
        accessSync,
        addDestory,
        copyFile,
        destroy,
        encodeToBase64,
        watchTimeout: fileWatchTimeout,
        getCurrentDirectory,
        getCompilerExecutingPath,
        isSymbolicLink,
        mkdir,
        mkdirSync,
        normalizePath: normalize,
        readdir,
        readdirSync,
        readFile,
        readFileSync,
        realpath,
        realpathSync,
        removeDestory,
        rename,
        resolvePath,
        rmdir,
        rmdirSync,
        stat,
        statSync,
        unlink,
        unlinkSync,
        watchDirectory,
        watchFile,
        writeFile,
        writeFileSync,
        generateContentHash,
        createWorkerController: HAS_WEB_WORKER ? createWebWorkerMainController : null,
        details: getDetails(),
        copy,
    };
    sys.resolveModuleId = opts => resolveModuleIdAsync(sys, null, opts);
    return sys;
};
const getDetails = () => {
    const details = {
        cpuModel: '',
        cpus: -1,
        freemem() {
            return 0;
        },
        platform: '',
        release: '',
        runtime: 'node',
        runtimeVersion: '',
        tmpDir: '/.tmp',
        totalmem: -1,
    };
    return details;
};
