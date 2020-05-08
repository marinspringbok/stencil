'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

function _interopNamespace(e) {
    if (e && e.__esModule) { return e; } else {
        var n = {};
        if (e) {
            Object.keys(e).forEach(function (k) {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            });
        }
        n['default'] = e;
        return n;
    }
}

const path = require('path');
const path__default = _interopDefault(path);
const fs = _interopDefault(require('fs'));
const util = require('util');
const fs$1 = _interopDefault(require('../sys/node/graceful-fs.js'));
const url = require('url');

/**
 * Default style mode id
 */
const DEFAULT_STYLE_MODE = '$';

const IS_NODE_ENV = typeof global !== 'undefined' &&
    typeof require === 'function' &&
    !!global.process &&
    Array.isArray(global.process.argv) &&
    typeof __filename === 'string' &&
    (!global.origin || typeof global.origin !== 'string');
const IS_NODE_WINDOWS_ENV = IS_NODE_ENV && global.process.platform === 'win32';
const requireFunc = (path) => (typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require)(path);

const flatOne = (array) => {
    if (array.flat) {
        return array.flat(1);
    }
    return array.reduce((result, item) => {
        result.push(...item);
        return result;
    }, []);
};
const unique = (array, predicate = i => i) => {
    const set = new Set();
    return array.filter(item => {
        const key = predicate(item);
        if (key == null) {
            return true;
        }
        if (set.has(key)) {
            return false;
        }
        set.add(key);
        return true;
    });
};
const isNumber = (v) => typeof v === 'number';
const isString = (v) => typeof v === 'string';

const catchError = (diagnostics, err, msg) => {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Build Error',
        messageText: 'build error',
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (isString(msg)) {
        diagnostic.messageText = msg;
    }
    else if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else {
            if (err.message != null) {
                diagnostic.messageText = err.message.toString();
            }
            else {
                diagnostic.messageText = err.toString();
            }
        }
    }
    if (diagnostics != null && !shouldIgnoreError(diagnostic.messageText)) {
        diagnostics.push(diagnostic);
    }
    return diagnostic;
};
const shouldIgnoreError = (msg) => {
    return msg === TASK_CANCELED_MSG;
};
const TASK_CANCELED_MSG = `task canceled`;

/**
 * Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
 * Forward-slash paths can be used in Windows as long as they're not
 * extended-length paths and don't contain any non-ascii characters.
 * This was created since the path methods in Node.js outputs \\ paths on Windows.
 */
const normalizePath = (path) => {
    if (typeof path !== 'string') {
        throw new Error(`invalid path to normalize`);
    }
    path = normalizeSlashes(path.trim());
    const components = pathComponents(path, getRootLength(path));
    const reducedComponents = reducePathComponents(components);
    const rootPart = reducedComponents[0];
    const secondPart = reducedComponents[1];
    const normalized = rootPart + reducedComponents.slice(1).join('/');
    if (normalized === '') {
        return '.';
    }
    if (rootPart === '' && secondPart && path.includes('/') && !secondPart.startsWith('.') && !secondPart.startsWith('@')) {
        return './' + normalized;
    }
    return normalized;
};
const normalizeSlashes = (path) => path.replace(backslashRegExp, '/');
const altDirectorySeparator = '\\';
const urlSchemeSeparator = '://';
const backslashRegExp = /\\/g;
const reducePathComponents = (components) => {
    if (!Array.isArray(components) || components.length === 0) {
        return [];
    }
    const reduced = [components[0]];
    for (let i = 1; i < components.length; i++) {
        const component = components[i];
        if (!component)
            continue;
        if (component === '.')
            continue;
        if (component === '..') {
            if (reduced.length > 1) {
                if (reduced[reduced.length - 1] !== '..') {
                    reduced.pop();
                    continue;
                }
            }
            else if (reduced[0])
                continue;
        }
        reduced.push(component);
    }
    return reduced;
};
const getRootLength = (path) => {
    const rootLength = getEncodedRootLength(path);
    return rootLength < 0 ? ~rootLength : rootLength;
};
const getEncodedRootLength = (path) => {
    if (!path)
        return 0;
    const ch0 = path.charCodeAt(0);
    // POSIX or UNC
    if (ch0 === 47 /* slash */ || ch0 === 92 /* backslash */) {
        if (path.charCodeAt(1) !== ch0)
            return 1; // POSIX: "/" (or non-normalized "\")
        const p1 = path.indexOf(ch0 === 47 /* slash */ ? '/' : altDirectorySeparator, 2);
        if (p1 < 0)
            return path.length; // UNC: "//server" or "\\server"
        return p1 + 1; // UNC: "//server/" or "\\server\"
    }
    // DOS
    if (isVolumeCharacter(ch0) && path.charCodeAt(1) === 58 /* colon */) {
        const ch2 = path.charCodeAt(2);
        if (ch2 === 47 /* slash */ || ch2 === 92 /* backslash */)
            return 3; // DOS: "c:/" or "c:\"
        if (path.length === 2)
            return 2; // DOS: "c:" (but not "c:d")
    }
    // URL
    const schemeEnd = path.indexOf(urlSchemeSeparator);
    if (schemeEnd !== -1) {
        const authorityStart = schemeEnd + urlSchemeSeparator.length;
        const authorityEnd = path.indexOf('/', authorityStart);
        if (authorityEnd !== -1) {
            // URL: "file:///", "file://server/", "file://server/path"
            // For local "file" URLs, include the leading DOS volume (if present).
            // Per https://www.ietf.org/rfc/rfc1738.txt, a host of "" or "localhost" is a
            // special case interpreted as "the machine from which the URL is being interpreted".
            const scheme = path.slice(0, schemeEnd);
            const authority = path.slice(authorityStart, authorityEnd);
            if (scheme === 'file' && (authority === '' || authority === 'localhost') && isVolumeCharacter(path.charCodeAt(authorityEnd + 1))) {
                const volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(path, authorityEnd + 2);
                if (volumeSeparatorEnd !== -1) {
                    if (path.charCodeAt(volumeSeparatorEnd) === 47 /* slash */) {
                        // URL: "file:///c:/", "file://localhost/c:/", "file:///c%3a/", "file://localhost/c%3a/"
                        return ~(volumeSeparatorEnd + 1);
                    }
                    if (volumeSeparatorEnd === path.length) {
                        // URL: "file:///c:", "file://localhost/c:", "file:///c$3a", "file://localhost/c%3a"
                        // but not "file:///c:d" or "file:///c%3ad"
                        return ~volumeSeparatorEnd;
                    }
                }
            }
            return ~(authorityEnd + 1); // URL: "file://server/", "http://server/"
        }
        return ~path.length; // URL: "file://server", "http://server"
    }
    // relative
    return 0;
};
const isVolumeCharacter = (charCode) => (charCode >= 97 /* a */ && charCode <= 122 /* z */) || (charCode >= 65 /* A */ && charCode <= 90 /* Z */);
const getFileUrlVolumeSeparatorEnd = (url, start) => {
    const ch0 = url.charCodeAt(start);
    if (ch0 === 58 /* colon */)
        return start + 1;
    if (ch0 === 37 /* percent */ && url.charCodeAt(start + 1) === 51 /* _3 */) {
        const ch2 = url.charCodeAt(start + 2);
        if (ch2 === 97 /* a */ || ch2 === 65 /* A */)
            return start + 3;
    }
    return -1;
};
const pathComponents = (path, rootLength) => {
    const root = path.substring(0, rootLength);
    const rest = path.substring(rootLength).split('/');
    const restLen = rest.length;
    if (restLen > 0 && !rest[restLen - 1]) {
        rest.pop();
    }
    return [root, ...rest];
};

const getScopeId = (tagName, mode) => {
    return 'sc-' + tagName + (mode && mode !== DEFAULT_STYLE_MODE ? '-' + mode : '');
};

const injectModulePreloads = (doc, paths) => {
    const existingLinks = Array.from(doc.querySelectorAll('link[rel=modulepreload]')).map(link => link.getAttribute('href'));
    const addLinks = paths.filter(path => !existingLinks.includes(path)).map(path => createModulePreload(doc, path));
    const firstScript = doc.head.querySelector('script');
    if (firstScript) {
        addLinks.forEach(link => {
            doc.head.insertBefore(link, firstScript);
        });
    }
    else {
        addLinks.forEach(link => {
            doc.head.appendChild(link);
        });
    }
};
const createModulePreload = (doc, href) => {
    const link = doc.createElement('link');
    link.setAttribute('rel', 'modulepreload');
    link.setAttribute('href', href);
    return link;
};

const readFile = util.promisify(fs.readFile);
async function minifyScriptElements(doc) {
    const { optimizeJs } = await new Promise(function (resolve) { resolve(_interopNamespace(require('../compiler/stencil.js'))); });
    const scriptElms = Array.from(doc.querySelectorAll('script')).filter(scriptElm => {
        if (scriptElm.hasAttribute('src')) {
            return false;
        }
        const scriptType = scriptElm.getAttribute('type');
        if (typeof scriptType === 'string' && scriptType !== 'module' && scriptType !== 'text/javascript') {
            return false;
        }
        return true;
    });
    return Promise.all(scriptElms.map(async (scriptElm) => {
        const opts = {
            input: scriptElm.innerHTML,
            sourceMap: false,
            target: 'latest',
        };
        if (scriptElm.getAttribute('type') !== 'module') {
            opts.target = 'es5';
        }
        const optimizeResults = await optimizeJs(opts);
        if (optimizeResults.diagnostics.length === 0) {
            scriptElm.innerHTML = optimizeResults.output;
        }
    }));
}
async function minifyStyleElements(doc) {
    const { optimizeCss } = await new Promise(function (resolve) { resolve(_interopNamespace(require('../compiler/stencil.js'))); });
    const styleElms = Array.from(doc.querySelectorAll('style'));
    await Promise.all(styleElms.map(async (styleElm) => {
        const optimizeResults = await optimizeCss({
            input: styleElm.innerHTML,
            minify: true,
        });
        if (optimizeResults.diagnostics.length === 0) {
            styleElm.innerHTML = optimizeResults.output;
        }
    }));
}
function addModulePreloads(doc, hydrateResults, componentGraph) {
    if (!componentGraph) {
        return false;
    }
    const modulePreloads = unique(flatOne(hydrateResults.components.map(cmp => getScopeId(cmp.tag, cmp.mode)).map(scopeId => componentGraph.get(scopeId) || [])));
    injectModulePreloads(doc, modulePreloads);
    return true;
}

function crawlAnchorsForNextUrls(prerenderConfig, diagnostics, baseUrl, currentUrl, parsedAnchors) {
    if (!Array.isArray(parsedAnchors) || parsedAnchors.length === 0) {
        return [];
    }
    const basePathParts = baseUrl.pathname.split('/');
    // filterAnchor(): filter which anchors to actually crawl
    // normalizeUrl(): normalize href strings into URL objects
    // filterUrl(): filter which urls to actually crawl
    // normalizeHref(): normalize URL objects into href strings
    return parsedAnchors
        .filter(anchor => {
        // filter which anchors to actually crawl
        if (typeof prerenderConfig.filterAnchor === 'function') {
            // user filterAnchor()
            try {
                const userFilterAnchor = prerenderConfig.filterAnchor(anchor, currentUrl);
                if (userFilterAnchor === false) {
                    return false;
                }
            }
            catch (e) {
                // user filterAnchor() error
                catchError(diagnostics, e);
                return false;
            }
        }
        // standard filterAnchor()
        return standardFilterAnchor(diagnostics, anchor);
    })
        .map(anchor => {
        // normalize href strings into URL objects
        if (typeof prerenderConfig.normalizeUrl === 'function') {
            try {
                // user normalizeUrl()
                const userNormalizedUrl = prerenderConfig.normalizeUrl(anchor.href, currentUrl);
                // standard normalizeUrl(), after user normalized
                return standardNormalizeUrl(diagnostics, userNormalizedUrl.href, currentUrl);
            }
            catch (e) {
                // user normalizeUrl() error
                catchError(diagnostics, e);
            }
        }
        // standard normalizeUrl(), no user normalized
        return standardNormalizeUrl(diagnostics, anchor.href, currentUrl);
    })
        .filter(url => {
        // filter which urls to actually crawl
        if (typeof prerenderConfig.filterUrl === 'function') {
            // user filterUrl()
            try {
                const userFilterUrl = prerenderConfig.filterUrl(url, currentUrl);
                if (userFilterUrl === false) {
                    return false;
                }
            }
            catch (e) {
                // user filterUrl() error
                catchError(diagnostics, e);
                return false;
            }
        }
        // standard filterUrl()
        return standardFilterUrl(diagnostics, url, currentUrl, basePathParts);
    })
        .map(url => {
        // standard normalize href
        // normalize URL objects into href strings
        return standardNormalizeHref(prerenderConfig, diagnostics, url);
    })
        .reduce((hrefs, href) => {
        // remove any duplicate hrefs from the array
        if (!hrefs.includes(href)) {
            hrefs.push(href);
        }
        return hrefs;
    }, [])
        .sort((a, b) => {
        // sort the hrefs so the urls with the least amount
        // of directories are first, then by alphabetical
        const partsA = a.split('/').length;
        const partsB = b.split('/').length;
        if (partsA < partsB)
            return -1;
        if (partsA > partsB)
            return 1;
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });
}
function standardFilterAnchor(diagnostics, attrs, _base) {
    try {
        let href = attrs.href;
        if (typeof attrs.download === 'string') {
            return false;
        }
        if (typeof href === 'string') {
            href = href.trim();
            if (href !== '' && !href.startsWith('#') && !href.startsWith('?')) {
                const target = attrs.target;
                if (typeof target === 'string' && attrs.target.trim().toLowerCase() !== '_self') {
                    return false;
                }
                return true;
            }
        }
    }
    catch (e) {
        catchError(diagnostics, e);
    }
    return false;
}
function standardNormalizeUrl(diagnostics, href, currentUrl) {
    if (typeof href === 'string') {
        try {
            const outputUrl = new URL(href, currentUrl.href);
            outputUrl.protocol = currentUrl.href;
            outputUrl.hash = '';
            outputUrl.search = '';
            const parts = outputUrl.pathname.split('/');
            const lastPart = parts[parts.length - 1];
            if (lastPart === 'index.html' || lastPart === 'index.htm') {
                parts.pop();
                outputUrl.pathname = parts.join('/');
            }
            return outputUrl;
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    return null;
}
function standardFilterUrl(diagnostics, url, currentUrl, basePathParts) {
    try {
        if (url.hostname != null && currentUrl.hostname != null && url.hostname !== currentUrl.hostname) {
            return false;
        }
        if (shouldSkipExtension(url.pathname)) {
            return false;
        }
        const inputPathParts = url.pathname.split('/');
        if (inputPathParts.length < basePathParts.length) {
            return false;
        }
        for (let i = 0; i < basePathParts.length; i++) {
            const basePathPart = basePathParts[i];
            const inputPathPart = inputPathParts[i];
            if (basePathParts.length - 1 === i && basePathPart === '') {
                break;
            }
            if (basePathPart !== inputPathPart) {
                return false;
            }
        }
        return true;
    }
    catch (e) {
        catchError(diagnostics, e);
    }
    return false;
}
function standardNormalizeHref(prerenderConfig, diagnostics, url) {
    try {
        if (url != null && typeof url.href === 'string') {
            let href = url.href.trim();
            if (prerenderConfig.trailingSlash) {
                // url should have a trailing slash
                if (!href.endsWith('/')) {
                    const parts = url.pathname.split('/');
                    const lastPart = parts[parts.length - 1];
                    if (!lastPart.includes('.')) {
                        // does not end with a slash and last part does not have a dot
                        href += '/';
                    }
                }
            }
            else {
                // url should NOT have a trailing slash
                if (href.endsWith('/') && url.pathname !== '/') {
                    // this has a trailing slash and it's not the root path
                    href = href.substr(0, href.length - 1);
                }
            }
            return href;
        }
    }
    catch (e) {
        catchError(diagnostics, e);
    }
    return null;
}
function shouldSkipExtension(filename) {
    return SKIP_EXT.has(extname(filename).toLowerCase());
}
function extname(str) {
    const parts = str.split('.');
    return parts[parts.length - 1].toLowerCase();
}
const SKIP_EXT = new Set(['zip', 'rar', 'tar', 'gz', 'bz2', 'png', 'jpeg', 'jpg', 'gif', 'pdf', 'tiff', 'psd']);

function getPrerenderConfig(diagnostics, prerenderConfigPath) {
    const prerenderConfig = {};
    if (typeof prerenderConfigPath === 'string') {
        try {
            const userConfig = requireFunc(prerenderConfigPath);
            if (userConfig != null) {
                Object.assign(prerenderConfig, userConfig);
            }
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    if (typeof prerenderConfig.crawlUrls !== 'boolean') {
        prerenderConfig.crawlUrls = true;
    }
    if (typeof prerenderConfig.trailingSlash !== 'boolean') {
        prerenderConfig.trailingSlash = false;
    }
    return prerenderConfig;
}
function getHydrateOptions(prerenderConfig, url, diagnostics) {
    const prerenderUrl = url.href;
    const opts = {
        url: prerenderUrl,
        addModulePreloads: true,
        approximateLineWidth: 100,
        inlineExternalStyleSheets: true,
        minifyScriptElements: true,
        minifyStyleElements: true,
        removeAttributeQuotes: true,
        removeBooleanAttributeQuotes: true,
        removeEmptyAttributes: true,
        removeHtmlComments: true,
    };
    if (prerenderConfig.canonicalUrl === null || prerenderConfig.canonicalUrl === false) {
        opts.canonicalUrl = null;
    }
    else if (typeof prerenderConfig.canonicalUrl === 'function') {
        try {
            opts.canonicalUrl = prerenderConfig.canonicalUrl(url);
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    else {
        opts.canonicalUrl = prerenderUrl;
    }
    if (typeof prerenderConfig.hydrateOptions === 'function') {
        try {
            const userOpts = prerenderConfig.hydrateOptions(url);
            if (userOpts != null) {
                if (userOpts.prettyHtml && typeof userOpts.removeAttributeQuotes !== 'boolean') {
                    opts.removeAttributeQuotes = false;
                }
                Object.assign(opts, userOpts);
            }
        }
        catch (e) {
            catchError(diagnostics, e);
        }
    }
    return opts;
}

const initNodeWorkerThread = (prcs, msgHandler) => {
    const sendHandle = (err) => {
        if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
            prcs.exit(0);
        }
    };
    const errorHandler = (stencilMsgId, err) => {
        const errMsgBackToMain = {
            stencilId: stencilMsgId,
            stencilRtnValue: null,
            stencilRtnError: 'Error',
        };
        if (isString(err)) {
            errMsgBackToMain.stencilRtnError += ': ' + err;
        }
        else if (err) {
            if (err.stack) {
                errMsgBackToMain.stencilRtnError += ': ' + err.stack;
            }
            else if (err.message) {
                errMsgBackToMain.stencilRtnError += ':' + err.message;
            }
        }
        prcs.send(errMsgBackToMain, sendHandle);
    };
    prcs.on('message', async (msgToWorker) => {
        // message from the main thread
        if (msgToWorker && isNumber(msgToWorker.stencilId)) {
            try {
                // run the handler to get the data
                const msgFromWorker = {
                    stencilId: msgToWorker.stencilId,
                    stencilRtnValue: await msgHandler(msgToWorker),
                    stencilRtnError: null,
                };
                // send response data from the worker to the main thread
                prcs.send(msgFromWorker, sendHandle);
            }
            catch (e) {
                // error occurred while running the task
                errorHandler(msgToWorker.stencilId, e);
            }
        }
    });
    prcs.on(`unhandledRejection`, (e) => {
        errorHandler(-1, e);
    });
};

function patchNodeGlobal(nodeGlobal, devServerHostUrl) {
    if (typeof nodeGlobal.fetch !== 'function') {
        const path = require('path');
        // webpack work-around/hack
        const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
        const nodeFetch = requireFunc(path.join(__dirname, '..', 'sys', 'node', 'node-fetch.js'));
        nodeGlobal.fetch = (input, init) => {
            if (typeof input === 'string') {
                // fetch(url) w/ url string
                const urlStr = normalizeUrl(input, devServerHostUrl);
                return nodeFetch.fetch(urlStr, init);
            }
            else {
                // fetch(Request) w/ request object
                input.url = normalizeUrl(input.url, devServerHostUrl);
                return nodeFetch.fetch(input, init);
            }
        };
        nodeGlobal.Headers = nodeFetch.Headers;
        nodeGlobal.Request = nodeFetch.Request;
        nodeGlobal.Response = nodeFetch.Response;
        nodeGlobal.FetchError = nodeFetch.FetchError;
    }
}
function normalizeUrl(inputUrl, devServerHostUrl) {
    const requestUrl = new URL(inputUrl, devServerHostUrl);
    return requestUrl.href;
}
function patchWindowGlobal(nodeGlobal, win) {
    win.fetch = nodeGlobal.fetch;
    win.Headers = nodeGlobal.Headers;
    win.Request = nodeGlobal.Request;
    win.Response = nodeGlobal.Response;
    win.FetchError = nodeGlobal.FetchError;
}

let componentGraph;
let templateHtml = null;
async function prerenderWorker(prerenderRequest) {
    // worker thread!
    const results = {
        diagnostics: [],
        anchorUrls: [],
        filePath: prerenderRequest.writeToFilePath,
    };
    try {
        const url$1 = new url.URL(prerenderRequest.url, prerenderRequest.devServerHostUrl);
        const componentGraph = getComponentGraph(prerenderRequest.componentGraphPath);
        // webpack work-around/hack
        const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
        const hydrateApp = requireFunc(prerenderRequest.hydrateAppFilePath);
        if (templateHtml == null) {
            // cache template html in this process
            templateHtml = fs$1.readFileSync(prerenderRequest.templateId, 'utf8');
        }
        // create a new window by cloning the cached parsed window
        const win = hydrateApp.createWindowFromHtml(templateHtml, prerenderRequest.templateId);
        const doc = win.document;
        // patch this new window
        patchNodeGlobal(global, prerenderRequest.devServerHostUrl);
        patchWindowGlobal(global, win);
        const prerenderConfig = getPrerenderConfig(results.diagnostics, prerenderRequest.prerenderConfigPath);
        const hydrateOpts = getHydrateOptions(prerenderConfig, url$1, results.diagnostics);
        if (typeof prerenderConfig.beforeHydrate === 'function') {
            try {
                const rtn = prerenderConfig.beforeHydrate(doc, url$1);
                if (rtn != null && typeof rtn.then === 'function') {
                    await rtn;
                }
            }
            catch (e) {
                catchError(results.diagnostics, e);
            }
        }
        // parse the html to dom nodes, hydrate the components, then
        // serialize the hydrated dom nodes back to into html
        const hydrateResults = (await hydrateApp.hydrateDocument(doc, hydrateOpts));
        results.diagnostics.push(...hydrateResults.diagnostics);
        if (hydrateOpts.addModulePreloads && !prerenderRequest.isDebug) {
            addModulePreloads(doc, hydrateResults, componentGraph);
        }
        if (hydrateOpts.minifyStyleElements && !prerenderRequest.isDebug) {
            await minifyStyleElements(doc);
        }
        if (hydrateOpts.minifyScriptElements && !prerenderRequest.isDebug) {
            await minifyScriptElements(doc);
        }
        if (typeof prerenderConfig.afterHydrate === 'function') {
            try {
                const rtn = prerenderConfig.afterHydrate(doc, url$1);
                if (rtn != null && typeof rtn.then === 'function') {
                    await rtn;
                }
            }
            catch (e) {
                catchError(results.diagnostics, e);
            }
        }
        if (typeof hydrateResults.httpStatus === 'number' && hydrateResults.httpStatus >= 400) {
            try {
                win.close();
            }
            catch (e) { }
            return results;
        }
        const html = hydrateApp.serializeDocumentToString(doc, hydrateOpts);
        if (prerenderConfig.crawlUrls !== false) {
            const baseUrl = new url.URL(prerenderRequest.baseUrl);
            results.anchorUrls = crawlAnchorsForNextUrls(prerenderConfig, results.diagnostics, baseUrl, url$1, hydrateResults.anchors);
        }
        if (typeof prerenderConfig.filePath === 'function') {
            try {
                const userWriteToFilePath = prerenderConfig.filePath(url$1, results.filePath);
                if (typeof userWriteToFilePath === 'string') {
                    results.filePath = userWriteToFilePath;
                }
            }
            catch (e) {
                catchError(results.diagnostics, e);
            }
        }
        await writePrerenderedHtml(results, html);
        try {
            win.close();
        }
        catch (e) { }
    }
    catch (e) {
        // ahh man! what happened!
        catchError(results.diagnostics, e);
    }
    return results;
}
function writePrerenderedHtml(results, html) {
    ensureDir(results.filePath);
    return new Promise(resolve => {
        fs$1.writeFile(results.filePath, html, err => {
            if (err != null) {
                results.filePath = null;
                catchError(results.diagnostics, err);
            }
            resolve();
        });
    });
}
const ensuredDirs = new Set();
function ensureDir(p) {
    const allDirs = [];
    while (true) {
        p = normalizePath(path__default.dirname(p));
        if (typeof p === 'string' && p.length > 0 && p !== '/' && !p.endsWith(':/')) {
            allDirs.push(p);
        }
        else {
            break;
        }
    }
    allDirs.reverse();
    for (let i = 0; i < allDirs.length; i++) {
        const dir = allDirs[i];
        if (!ensuredDirs.has(dir)) {
            ensuredDirs.add(dir);
            try {
                fs$1.mkdirSync(dir);
            }
            catch (e) { }
        }
    }
}
function getComponentGraph(componentGraphPath) {
    if (componentGraphPath == null) {
        return undefined;
    }
    if (componentGraph == null) {
        const componentGraphJson = JSON.parse(fs$1.readFileSync(componentGraphPath, 'utf8'));
        componentGraph = new Map(Object.entries(componentGraphJson));
    }
    return componentGraph;
}
function initPrerenderWorker(prcs) {
    if (prcs.argv.includes('stencil-cli-worker')) {
        // cmd line arg used to start the worker
        // and attached a message handler to the process
        initNodeWorkerThread(prcs, msgFromMain => {
            const fnName = msgFromMain.args[0];
            const fnArgs = msgFromMain.args.slice(1);
            switch (fnName) {
                case 'prerenderWorker':
                    return prerenderWorker.apply(null, fnArgs);
                default:
                    throw new Error(`invalid prerender worker msg: ${JSON.stringify(msgFromMain)}`);
            }
        });
    }
}
initPrerenderWorker(process);

exports.prerenderWorker = prerenderWorker;
