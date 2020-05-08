import { basename, dirname, join, relative } from 'path';
import { BuildContext } from '../build/build-ctx';
import { getRollupOptions } from './bundle-output';
import { rollup } from 'rollup';
export const devNodeModuleResolveId = async (config, inMemoryFs, resolvedId, importee) => {
    if (!shouldCheckDevModule(resolvedId, importee)) {
        return resolvedId;
    }
    const resolvedPath = resolvedId.id;
    const pkgPath = getPackageJsonPath(resolvedPath, importee);
    if (!pkgPath) {
        return resolvedId;
    }
    const pkgJsonStr = await inMemoryFs.readFile(pkgPath);
    if (!pkgJsonStr) {
        return resolvedId;
    }
    let pkgJsonData;
    try {
        pkgJsonData = JSON.parse(pkgJsonStr);
    }
    catch (e) { }
    if (!pkgJsonData || !pkgJsonData.version) {
        return resolvedId;
    }
    resolvedId.id = serializeDevNodeModuleUrl(config, pkgJsonData.name, pkgJsonData.version, resolvedPath);
    resolvedId.external = true;
    return resolvedId;
};
const getPackageJsonPath = (resolvedPath, importee) => {
    let currentPath = resolvedPath;
    for (let i = 0; i < 10; i++) {
        currentPath = dirname(currentPath);
        const aBasename = basename(currentPath);
        const upDir = dirname(currentPath);
        const bBasename = basename(upDir);
        if (aBasename === importee && bBasename === 'node_modules') {
            return join(currentPath, 'package.json');
        }
    }
    return null;
};
export const compilerRequest = async (config, compilerCtx, data) => {
    const results = {
        nodeModuleId: null,
        nodeModuleVersion: null,
        nodeResolvedPath: null,
        cachePath: null,
        cacheHit: false,
        content: '',
        status: 404,
    };
    try {
        const parsedUrl = parseDevModuleUrl(config, data.path);
        Object.assign(results, parsedUrl);
        if (parsedUrl.nodeModuleId) {
            if (!parsedUrl.nodeModuleVersion) {
                results.content = `/* invalid module version */`;
                results.status = 400;
                return results;
            }
            if (!parsedUrl.nodeResolvedPath) {
                results.content = `/* invalid resolved path */`;
                results.status = 400;
                return results;
            }
            const useCache = await useDevModuleCache(config, parsedUrl.nodeResolvedPath);
            let cachePath = null;
            if (useCache) {
                cachePath = getDevModuleCachePath(config, parsedUrl);
                const cachedContent = await config.sys.readFile(cachePath);
                if (typeof cachedContent === 'string') {
                    results.content = cachedContent;
                    results.cachePath = cachePath;
                    results.cacheHit = true;
                    results.status = 200;
                    return results;
                }
            }
            await bundleDevModule(config, compilerCtx, parsedUrl, results);
            if (results.status === 200 && useCache) {
                results.cachePath = cachePath;
                writeCachedFile(config, results);
            }
        }
        else {
            results.content = `/* invalid dev module */`;
            results.status = 400;
            return results;
        }
    }
    catch (e) {
        if (e) {
            if (e.stack) {
                results.content = `/*\n${e.stack}\n*/`;
            }
            else {
                results.content = `/*\n${e}\n*/`;
            }
        }
        results.status = 500;
    }
    return results;
};
const bundleDevModule = async (config, compilerCtx, parsedUrl, results) => {
    const buildCtx = new BuildContext(config, compilerCtx);
    try {
        const inputOpts = getRollupOptions(config, compilerCtx, buildCtx, {
            id: parsedUrl.nodeModuleId,
            platform: 'client',
            inputs: {
                index: parsedUrl.nodeResolvedPath,
            },
        });
        const rollupBuild = await rollup(inputOpts);
        const outputOpts = {
            format: 'es',
        };
        if (parsedUrl.nodeModuleId) {
            const commentPath = relative(config.rootDir, parsedUrl.nodeResolvedPath);
            outputOpts.intro = `/**\n * Dev Node Module: ${parsedUrl.nodeModuleId}, v${parsedUrl.nodeModuleVersion}\n * Entry: ${commentPath}\n * DEVELOPMENT PURPOSES ONLY!!\n */`;
            inputOpts.input = parsedUrl.nodeResolvedPath;
        }
        const r = await rollupBuild.generate(outputOpts);
        if (buildCtx.hasError) {
            results.status = 500;
            results.content = `console.error(${JSON.stringify(buildCtx.diagnostics)})`;
        }
        else if (r && r.output && r.output.length > 0) {
            results.content = r.output[0].code;
            results.status = 200;
        }
    }
    catch (e) {
        results.status = 500;
        results.content = `console.error(${JSON.stringify((e.stack || e) + '')})`;
    }
};
const useDevModuleCache = async (config, p) => {
    if (config.enableCache) {
        for (let i = 0; i < 10; i++) {
            const n = basename(p);
            if (n === 'node_modules') {
                return true;
            }
            const isSymbolicLink = await config.sys.isSymbolicLink(p);
            if (isSymbolicLink) {
                return false;
            }
            p = dirname(p);
        }
    }
    return false;
};
const writeCachedFile = async (config, results) => {
    try {
        await config.sys.mkdir(config.cacheDir);
        config.sys.writeFile(results.cachePath, results.content);
    }
    catch (e) {
        console.error(e);
    }
};
const serializeDevNodeModuleUrl = (config, moduleId, moduleVersion, resolvedPath) => {
    resolvedPath = relative(config.rootDir, resolvedPath);
    let id = `/${DEV_MODULE_DIR}/`;
    id += encodeURIComponent(moduleId) + '@';
    id += encodeURIComponent(moduleVersion) + '.js';
    id += '?p=' + encodeURIComponent(resolvedPath);
    return id;
};
const parseDevModuleUrl = (config, u) => {
    const parsedUrl = {
        nodeModuleId: null,
        nodeModuleVersion: null,
        nodeResolvedPath: null,
    };
    if (u && u.includes(DEV_MODULE_DIR) && u.endsWith('.js')) {
        const url = new URL(u, 'https://stenciljs.com');
        let reqPath = basename(url.pathname);
        reqPath = reqPath.substring(0, reqPath.length - 3);
        let splt = reqPath.split('@');
        if (splt.length === 2) {
            parsedUrl.nodeModuleId = decodeURIComponent(splt[0]);
            parsedUrl.nodeModuleVersion = decodeURIComponent(splt[1]);
            parsedUrl.nodeResolvedPath = url.searchParams.get('p');
            if (parsedUrl.nodeResolvedPath) {
                parsedUrl.nodeResolvedPath = decodeURIComponent(parsedUrl.nodeResolvedPath);
                parsedUrl.nodeResolvedPath = join(config.rootDir, parsedUrl.nodeResolvedPath);
            }
        }
    }
    return parsedUrl;
};
const getDevModuleCachePath = (config, parsedUrl) => {
    return join(config.cacheDir, `dev_module_${parsedUrl.nodeModuleId}_${parsedUrl.nodeModuleVersion}_${DEV_MODULE_CACHE_BUSTER}.log`);
};
const DEV_MODULE_CACHE_BUSTER = 0;
const DEV_MODULE_DIR = `~dev-module`;
const shouldCheckDevModule = (resolvedId, importee) => resolvedId &&
    importee &&
    resolvedId.id &&
    resolvedId.id.includes('node_modules') &&
    (resolvedId.id.endsWith('.js') || resolvedId.id.endsWith('.mjs')) &&
    !resolvedId.external &&
    !importee.startsWith('.') &&
    !importee.startsWith('/');
