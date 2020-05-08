import { join, relative } from 'path';
export async function generateHostConfig(config, compilerCtx, outputTarget, entryModules, hydrateResults) {
    const hostConfig = {
        hosting: {
            rules: [],
        },
    };
    hydrateResults = hydrateResults.sort((a, b) => {
        if (a.url.toLowerCase() < b.url.toLowerCase())
            return -1;
        if (a.url.toLowerCase() > b.url.toLowerCase())
            return 1;
        return 0;
    });
    for (const hydrateResult of hydrateResults) {
        const hostRule = generateHostRule(outputTarget, entryModules, hydrateResult);
        if (hostRule) {
            hostConfig.hosting.rules.push(hostRule);
        }
    }
    addDefaults(outputTarget, hostConfig);
    const hostConfigFilePath = join(outputTarget.appDir, HOST_CONFIG_FILENAME);
    await mergeUserHostConfigFile(config, compilerCtx, hostConfig);
    await compilerCtx.fs.writeFile(hostConfigFilePath, JSON.stringify(hostConfig, null, 2));
}
export function generateHostRule(outputTarget, entryModules, hydrateResults) {
    const hostRule = {
        include: hydrateResults.pathname,
        headers: generateHostRuleHeaders(outputTarget, entryModules, hydrateResults),
    };
    if (hostRule.headers.length === 0) {
        return null;
    }
    return hostRule;
}
export function generateHostRuleHeaders(outputTarget, entryModules, hydrateResults) {
    const hostRuleHeaders = [];
    addStyles(hostRuleHeaders, hydrateResults);
    addCoreJs(outputTarget, 'compilerCtx.appCoreWWWPath', hostRuleHeaders);
    addBundles(outputTarget, entryModules, hostRuleHeaders, hydrateResults.components);
    addScripts(hostRuleHeaders, hydrateResults);
    addImgs(hostRuleHeaders, hydrateResults);
    return hostRuleHeaders;
}
function addCoreJs(outputTarget, appCoreWWWPath, hostRuleHeaders) {
    const url = getUrlFromFilePath(outputTarget, appCoreWWWPath);
    hostRuleHeaders.push(formatLinkRelPreloadHeader(url));
}
export function addBundles(outputTarget, entryModules, hostRuleHeaders, components) {
    components = sortComponents(components);
    const bundleIds = getBundleIds(entryModules, components);
    for (const bundleId of bundleIds) {
        if (hostRuleHeaders.length < MAX_LINK_REL_PRELOAD_COUNT) {
            const bundleUrl = getBundleUrl(outputTarget, bundleId);
            hostRuleHeaders.push(formatLinkRelPreloadHeader(bundleUrl));
        }
    }
}
export function getBundleIds(_entryModules, _components) {
    const bundleIds = [];
    // components.forEach(cmp => {
    //   entryModules.forEach(mb => {
    //     const moduleFile = mb.moduleFiles.find(mf => mf.cmpCompilerMeta && mf.cmpCompilerMeta.tagName === cmp.tag);
    //     if (!moduleFile) {
    //       return;
    //     }
    //     let bundleId: string;
    //     if (typeof moduleFile.cmpCompilerMeta.bundleIds === 'string') {
    //       bundleId = moduleFile.cmpCompilerMeta.bundleIds;
    //     } else {
    //       bundleId = (moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds)[DEFAULT_MODE];
    //       if (!bundleId) {
    //         bundleId = (moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds)[DEFAULT_STYLE_MODE];
    //       }
    //     }
    //     if (bundleId && bundleIds.indexOf(bundleId) === -1) {
    //       bundleIds.push(bundleId);
    //     }
    //   });
    // });
    return bundleIds;
}
function getBundleUrl(outputTarget, _bundleId) {
    // const unscopedFileName = 'getBrowserFilename(bundleId, false)';
    const unscopedWwwBuildPath = 'sys.path.join(getAppBuildDir(config, outputTarget), unscopedFileName)';
    return getUrlFromFilePath(outputTarget, unscopedWwwBuildPath);
}
export function getUrlFromFilePath(outputTarget, filePath) {
    let url = join('/', relative(outputTarget.appDir, filePath));
    url = outputTarget.baseUrl + url.substring(1);
    return url;
}
export function sortComponents(components) {
    return components.sort((a, b) => {
        if (a.depth > b.depth)
            return -1;
        if (a.depth < b.depth)
            return 1;
        if (a.count > b.count)
            return -1;
        if (a.count < b.count)
            return 1;
        if (a.tag < b.tag)
            return -1;
        if (a.tag > b.tag)
            return 1;
        return 0;
    });
}
function addStyles(hostRuleHeaders, hydrateResults) {
    for (const style of hydrateResults.styles) {
        if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
            return;
        }
        const url = new URL(style.href);
        if (url.hostname === hydrateResults.hostname) {
            hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
        }
    }
}
function addScripts(hostRuleHeaders, hydrateResults) {
    for (const script of hydrateResults.scripts) {
        if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
            return;
        }
        const url = new URL(script.src);
        if (url.hostname === hydrateResults.hostname) {
            hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
        }
    }
}
function addImgs(hostRuleHeaders, hydrateResults) {
    for (const img of hydrateResults.imgs) {
        if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
            return;
        }
        const url = new URL(img.src);
        if (url.hostname === hydrateResults.hostname) {
            hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
        }
    }
}
export function formatLinkRelPreloadHeader(url) {
    const header = {
        name: 'Link',
        value: formatLinkRelPreloadValue(url),
    };
    return header;
}
function formatLinkRelPreloadValue(url) {
    const parts = [`<${url}>`, `rel=preload`];
    const ext = url
        .split('.')
        .pop()
        .toLowerCase();
    if (ext === SCRIPT_EXT) {
        parts.push(`as=script`);
    }
    else if (ext === STYLE_EXT) {
        parts.push(`as=style`);
    }
    else if (IMG_EXTS.indexOf(ext) > -1) {
        parts.push(`as=image`);
    }
    return parts.join(';');
}
function addDefaults(outputTarget, hostConfig) {
    addBuildDirCacheControl(outputTarget, hostConfig);
    addServiceWorkerNoCacheControl(outputTarget, hostConfig);
}
function addBuildDirCacheControl(outputTarget, hostConfig) {
    const url = getUrlFromFilePath(outputTarget, 'getAppBuildDir(config, outputTarget)');
    hostConfig.hosting.rules.push({
        include: join(url, '**'),
        headers: [
            {
                name: `Cache-Control`,
                value: `public, max-age=31536000`,
            },
        ],
    });
}
function addServiceWorkerNoCacheControl(outputTarget, hostConfig) {
    if (!outputTarget.serviceWorker) {
        return;
    }
    const url = getUrlFromFilePath(outputTarget, outputTarget.serviceWorker.swDest);
    hostConfig.hosting.rules.push({
        include: url,
        headers: [
            {
                name: `Cache-Control`,
                value: `no-cache, no-store, must-revalidate`,
            },
        ],
    });
}
async function mergeUserHostConfigFile(config, compilerCtx, hostConfig) {
    const hostConfigFilePath = join(config.srcDir, HOST_CONFIG_FILENAME);
    try {
        const userHostConfigStr = await compilerCtx.fs.readFile(hostConfigFilePath);
        const userHostConfig = JSON.parse(userHostConfigStr);
        mergeUserHostConfig(userHostConfig, hostConfig);
    }
    catch (e) { }
}
export function mergeUserHostConfig(userHostConfig, hostConfig) {
    if (!userHostConfig || !userHostConfig.hosting) {
        return;
    }
    if (!Array.isArray(userHostConfig.hosting.rules)) {
        return;
    }
    const rules = userHostConfig.hosting.rules.concat(hostConfig.hosting.rules);
    hostConfig.hosting.rules = rules;
}
export const DEFAULT_MODE = 'md';
const MAX_LINK_REL_PRELOAD_COUNT = 6;
export const HOST_CONFIG_FILENAME = 'host.config.json';
const IMG_EXTS = ['png', 'gif', 'svg', 'jpg', 'jpeg', 'webp'];
const STYLE_EXT = 'css';
const SCRIPT_EXT = 'js';
