import { build } from './build';
import { BuildContext } from './build-ctx';
import { compilerRequest } from '../bundle/dev-module';
import { createTsWatchProgram } from '../transpile/create-watch-program';
import { filesChanged, hasHtmlChanges, hasScriptChanges, hasStyleChanges, scriptsAdded, scriptsDeleted } from '../fs-watch/fs-watch-rebuild';
import { hasServiceWorkerChanges } from '../service-worker/generate-sw';
import { dirname, resolve } from 'path';
export const createWatchBuild = async (config, compilerCtx) => {
    let isRebuild = false;
    let tsWatchProgram;
    let fileWatcher;
    let closeResolver;
    const watchWaiter = new Promise(resolve => (closeResolver = resolve));
    const dirsAdded = new Set();
    const dirsDeleted = new Set();
    const filesAdded = new Set();
    const filesUpdated = new Set();
    const filesDeleted = new Set();
    const onFileChange = (file, kind) => {
        updateCompilerCtxCache(config, compilerCtx, file, kind);
        switch (kind) {
            case 'dirAdd':
                dirsAdded.add(file);
                break;
            case 'dirDelete':
                dirsDeleted.add(file);
                break;
            case 'fileAdd':
                filesAdded.add(file);
                break;
            case 'fileUpdate':
                filesUpdated.add(file);
                break;
            case 'fileDelete':
                filesDeleted.add(file);
                break;
        }
        config.logger.debug(`${kind}: ${file}`);
        tsWatchProgram.rebuild();
    };
    const onBuild = async (tsBuilder) => {
        const buildCtx = new BuildContext(config, compilerCtx);
        buildCtx.isRebuild = isRebuild;
        buildCtx.requiresFullBuild = !isRebuild;
        buildCtx.dirsAdded = Array.from(dirsAdded.keys()).sort();
        buildCtx.dirsDeleted = Array.from(dirsDeleted.keys()).sort();
        buildCtx.filesAdded = Array.from(filesAdded.keys()).sort();
        buildCtx.filesUpdated = Array.from(filesUpdated.keys()).sort();
        buildCtx.filesDeleted = Array.from(filesDeleted.keys()).sort();
        buildCtx.filesChanged = filesChanged(buildCtx);
        buildCtx.scriptsAdded = scriptsAdded(buildCtx);
        buildCtx.scriptsDeleted = scriptsDeleted(buildCtx);
        buildCtx.hasScriptChanges = hasScriptChanges(buildCtx);
        buildCtx.hasStyleChanges = hasStyleChanges(buildCtx);
        buildCtx.hasHtmlChanges = hasHtmlChanges(config, buildCtx);
        buildCtx.hasServiceWorkerChanges = hasServiceWorkerChanges(config, buildCtx);
        dirsAdded.clear();
        dirsDeleted.clear();
        filesAdded.clear();
        filesUpdated.clear();
        filesDeleted.clear();
        emitFsChange(compilerCtx, buildCtx);
        buildCtx.start();
        const result = await build(config, compilerCtx, buildCtx, tsBuilder);
        if (result && !result.hasError) {
            isRebuild = true;
        }
    };
    const start = async () => {
        fileWatcher = await watchSrcDirectory(config, compilerCtx, onFileChange);
        tsWatchProgram = await createTsWatchProgram(config, onBuild);
        return watchWaiter;
    };
    const close = async () => {
        if (tsWatchProgram) {
            fileWatcher.close();
            tsWatchProgram.program.close();
            tsWatchProgram = null;
        }
        const watcherCloseResults = {
            exitCode: 0,
        };
        closeResolver(watcherCloseResults);
        return watcherCloseResults;
    };
    const request = async (data) => compilerRequest(config, compilerCtx, data);
    config.sys.addDestory(close);
    return {
        start,
        close,
        on: compilerCtx.events.on,
        request,
    };
};
export const watchSrcDirectory = async (config, compilerCtx, callback) => {
    const watching = new Map();
    const watchFile = (path) => {
        if (!watching.has(path)) {
            watching.set(path, config.sys.watchFile(path, callback));
        }
    };
    const files = await compilerCtx.fs.readdir(config.srcDir, {
        recursive: true,
        excludeDirNames: ['.cache', '.github', '.stencil', '.vscode', 'node_modules'],
        excludeExtensions: ['.md', '.markdown', '.txt', '.spec.ts', '.spec.tsx', '.e2e.ts', '.e2e.tsx', '.gitignore', '.editorconfig'],
    });
    files.filter(({ isFile }) => isFile).forEach(({ absPath }) => watchFile(absPath));
    watching.set(config.srcDir, config.sys.watchDirectory(config.srcDir, (filename, kind) => {
        watchFile(filename);
        callback(filename, kind);
    }));
    return {
        close() {
            watching.forEach(w => w.close());
        },
    };
};
const emitFsChange = (compilerCtx, buildCtx) => {
    if (buildCtx.dirsAdded.length > 0 || buildCtx.dirsDeleted.length > 0 || buildCtx.filesUpdated.length > 0 || buildCtx.filesAdded.length > 0 || buildCtx.filesDeleted.length > 0) {
        compilerCtx.events.emit('fsChange', {
            dirsAdded: buildCtx.dirsAdded.slice(),
            dirsDeleted: buildCtx.dirsDeleted.slice(),
            filesUpdated: buildCtx.filesUpdated.slice(),
            filesAdded: buildCtx.filesAdded.slice(),
            filesDeleted: buildCtx.filesDeleted.slice(),
        });
    }
};
const updateCompilerCtxCache = (config, compilerCtx, path, kind) => {
    compilerCtx.fs.clearFileCache(path);
    compilerCtx.changedFiles.add(path);
    if (kind === 'fileDelete') {
        compilerCtx.moduleMap.delete(path);
    }
    else if (kind === 'dirDelete') {
        const fsRootDir = resolve('/');
        compilerCtx.moduleMap.forEach((_, moduleFilePath) => {
            let moduleAncestorDir = dirname(moduleFilePath);
            for (let i = 0; i < 50; i++) {
                if (moduleAncestorDir === config.rootDir || moduleAncestorDir === fsRootDir) {
                    break;
                }
                if (moduleAncestorDir === path) {
                    compilerCtx.fs.clearFileCache(moduleFilePath);
                    compilerCtx.moduleMap.delete(moduleFilePath);
                    compilerCtx.changedFiles.add(moduleFilePath);
                    break;
                }
                moduleAncestorDir = dirname(moduleAncestorDir);
            }
        });
    }
};
