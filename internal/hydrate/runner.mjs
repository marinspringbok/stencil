/*
 Stencil Hydrate Runner v0.0.0-dev.20200508114528 | MIT Licensed | https://stenciljs.com
 */
import { MockWindow, cloneWindow, constrainTimeouts, patchWindow, serializeNodeToHtml } from '@stencil/core/mock-doc';
import { hydrateFactory } from '@stencil/core/hydrate-factory';

const templateWindows = new Map();
function createWindowFromHtml(templateHtml, uniqueId) {
    let templateWindow = templateWindows.get(uniqueId);
    if (templateWindow == null) {
        templateWindow = new MockWindow(templateHtml);
        templateWindows.set(uniqueId, templateWindow);
    }
    const win = cloneWindow(templateWindow);
    return win;
}

const URL_ = /*@__PURE__*/ (() => {
  if (typeof URL === 'function') {
    return URL;
  }
  const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;
  if (typeof requireFunc === 'function') {
    try {
      return requireFunc('url').URL;
    } catch (e) {}
  }
  return function() {};
})();

function normalizeHydrateOptions(inputOpts) {
    const outputOpts = Object.assign({
        serializeToHtml: false,
        destroyWindow: false,
        destroyDocument: false,
    }, inputOpts || {});
    if (typeof outputOpts.clientHydrateAnnotations !== 'boolean') {
        outputOpts.clientHydrateAnnotations = true;
    }
    if (typeof outputOpts.constrainTimeouts !== 'boolean') {
        outputOpts.constrainTimeouts = true;
    }
    if (typeof outputOpts.maxHydrateCount !== 'number') {
        outputOpts.maxHydrateCount = 300;
    }
    if (typeof outputOpts.runtimeLogging !== 'boolean') {
        outputOpts.runtimeLogging = false;
    }
    if (typeof outputOpts.timeout !== 'number') {
        outputOpts.timeout = 15000;
    }
    if (Array.isArray(outputOpts.excludeComponents)) {
        outputOpts.excludeComponents = outputOpts.excludeComponents.filter(c => typeof c === 'string' && c.includes('-')).map(c => c.toLowerCase());
    }
    else {
        outputOpts.excludeComponents = [];
    }
    return outputOpts;
}
function generateHydrateResults(opts) {
    if (typeof opts.url !== 'string') {
        opts.url = `https://hydrate.stenciljs.com/`;
    }
    const results = {
        diagnostics: [],
        url: opts.url,
        host: null,
        hostname: null,
        href: null,
        pathname: null,
        port: null,
        search: null,
        hash: null,
        html: null,
        httpStatus: null,
        hydratedCount: 0,
        anchors: [],
        components: [],
        imgs: [],
        scripts: [],
        styles: [],
        title: null,
    };
    try {
        const url = new URL_(opts.url, `https://hydrate.stenciljs.com/`);
        results.url = url.href;
        results.host = url.host;
        results.hostname = url.hostname;
        results.href = url.href;
        results.port = url.port;
        results.pathname = url.pathname;
        results.search = url.search;
        results.hash = url.hash;
    }
    catch (e) {
        renderCatchError(results, e);
    }
    return results;
}
function renderBuildDiagnostic(results, level, header, msg) {
    const diagnostic = {
        level: level,
        type: 'build',
        header: header,
        messageText: msg,
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (results.pathname) {
        if (results.pathname !== '/') {
            diagnostic.header += ': ' + results.pathname;
        }
    }
    else if (results.url) {
        diagnostic.header += ': ' + results.url;
    }
    results.diagnostics.push(diagnostic);
    return diagnostic;
}
function renderBuildError(results, msg) {
    return renderBuildDiagnostic(results, 'error', 'Hydrate Error', msg);
}
function renderCatchError(results, err) {
    const diagnostic = renderBuildError(results, null);
    if (err != null) {
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
    return diagnostic;
}

const IS_NODE_ENV = typeof global !== 'undefined' &&
    typeof require === 'function' &&
    !!global.process &&
    Array.isArray(global.process.argv) &&
    typeof __filename === 'string' &&
    (!global.origin || typeof global.origin !== 'string');
const IS_NODE_WINDOWS_ENV = IS_NODE_ENV && global.process.platform === 'win32';

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
const hasError = (diagnostics) => {
    if (diagnostics == null || diagnostics.length === 0) {
        return false;
    }
    return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
};
const shouldIgnoreError = (msg) => {
    return msg === TASK_CANCELED_MSG;
};
const TASK_CANCELED_MSG = `task canceled`;

function runtimeLogging(win, opts, results) {
    try {
        const pathname = win.location.pathname;
        win.console.error = (...msgs) => {
            renderCatchError(results, [...msgs].join(', '));
            if (opts.runtimeLogging) {
                runtimeLog(pathname, 'error', msgs);
            }
        };
        win.console.debug = (...msgs) => {
            renderBuildDiagnostic(results, 'debug', 'Hydrate Debug', [...msgs].join(', '));
            if (opts.runtimeLogging) {
                runtimeLog(pathname, 'debug', msgs);
            }
        };
        if (opts.runtimeLogging) {
            ['log', 'warn', 'assert', 'info', 'trace'].forEach(type => {
                win.console[type] = (...msgs) => {
                    runtimeLog(pathname, type, msgs);
                };
            });
        }
    }
    catch (e) {
        renderCatchError(results, e);
    }
}
function runtimeLog(pathname, type, msgs) {
    global.console[type].apply(global.console, [`[ ${pathname}  ${type} ] `, ...msgs]);
}

function initializeWindow(win, opts, results) {
    try {
        win.location.href = opts.url;
    }
    catch (e) {
        renderCatchError(results, e);
    }
    if (typeof opts.userAgent === 'string') {
        try {
            win.navigator.userAgent = opts.userAgent;
        }
        catch (e) { }
    }
    if (typeof opts.cookie === 'string') {
        try {
            win.document.cookie = opts.cookie;
        }
        catch (e) { }
    }
    if (typeof opts.referrer === 'string') {
        try {
            win.document.referrer = opts.referrer;
        }
        catch (e) { }
    }
    if (typeof opts.direction === 'string') {
        try {
            win.document.documentElement.setAttribute('dir', opts.direction);
        }
        catch (e) { }
    }
    if (typeof opts.language === 'string') {
        try {
            win.document.documentElement.setAttribute('lang', opts.language);
        }
        catch (e) { }
    }
    try {
        win.customElements = null;
    }
    catch (e) { }
    if (opts.constrainTimeouts) {
        constrainTimeouts(win);
    }
    runtimeLogging(win, opts, results);
    return win;
}

function inspectElement(results, elm, depth) {
    const children = elm.children;
    for (let i = 0, ii = children.length; i < ii; i++) {
        const childElm = children[i];
        const tagName = childElm.nodeName.toLowerCase();
        if (tagName.includes('-')) {
            // we've already collected components that were hydrated
            // now that the document is completed we can count how
            // many they are and their depth
            const cmp = results.components.find(c => c.tag === tagName);
            if (cmp != null) {
                cmp.count++;
                if (depth > cmp.depth) {
                    cmp.depth = depth;
                }
            }
        }
        else {
            switch (tagName) {
                case 'a':
                    const anchor = collectAttributes(childElm);
                    anchor.href = childElm.href;
                    if (typeof anchor.href === 'string') {
                        if (!results.anchors.some(a => a.href === anchor.href)) {
                            results.anchors.push(anchor);
                        }
                    }
                    break;
                case 'img':
                    const img = collectAttributes(childElm);
                    img.src = childElm.src;
                    if (typeof img.src === 'string') {
                        if (!results.imgs.some(a => a.src === img.src)) {
                            results.imgs.push(img);
                        }
                    }
                    break;
                case 'link':
                    const link = collectAttributes(childElm);
                    link.href = childElm.href;
                    if (typeof link.rel === 'string' && link.rel.toLowerCase() === 'stylesheet') {
                        if (typeof link.href === 'string') {
                            if (!results.styles.some(s => s.link === link.href)) {
                                delete link.rel;
                                delete link.type;
                                results.styles.push(link);
                            }
                        }
                    }
                    break;
                case 'script':
                    const script = collectAttributes(childElm);
                    script.src = childElm.src;
                    if (typeof script.src === 'string') {
                        if (!results.scripts.some(s => s.src === script.src)) {
                            results.scripts.push(script);
                        }
                    }
                    break;
            }
        }
        depth++;
        inspectElement(results, childElm, depth);
    }
}
function collectAttributes(node) {
    const parsedElm = {};
    const attrs = node.attributes;
    for (let i = 0, ii = attrs.length; i < ii; i++) {
        const attr = attrs.item(i);
        const attrName = attr.nodeName.toLowerCase();
        if (SKIP_ATTRS.has(attrName)) {
            continue;
        }
        const attrValue = attr.nodeValue;
        if (attrName === 'class' && attrValue === '') {
            continue;
        }
        parsedElm[attrName] = attrValue;
    }
    return parsedElm;
}
const SKIP_ATTRS = new Set(['s-id', 'c-id']);

function patchDomImplementation(doc, opts) {
    let win;
    if (doc.defaultView != null) {
        opts.destroyWindow = true;
        patchWindow(doc.defaultView);
        win = doc.defaultView;
    }
    else {
        opts.destroyWindow = true;
        opts.destroyDocument = false;
        win = new MockWindow(false);
    }
    if (win.document !== doc) {
        win.document = doc;
    }
    if (doc.defaultView !== win) {
        doc.defaultView = win;
    }
    const HTMLElement = doc.documentElement.constructor.prototype;
    if (typeof HTMLElement.getRootNode !== 'function') {
        const elm = doc.createElement('unknown-element');
        const HTMLUnknownElement = elm.constructor.prototype;
        HTMLUnknownElement.getRootNode = getRootNode;
    }
    if (typeof doc.createEvent === 'function') {
        const CustomEvent = doc.createEvent('CustomEvent').constructor;
        if (win.CustomEvent !== CustomEvent) {
            win.CustomEvent = CustomEvent;
        }
    }
    try {
        doc.baseURI;
    }
    catch (e) {
        Object.defineProperty(doc, 'baseURI', {
            get() {
                const baseElm = doc.querySelector('base[href]');
                if (baseElm) {
                    return new URL(baseElm.getAttribute('href'), win.location.href).href;
                }
                return win.location.href;
            },
        });
    }
    return win;
}
function getRootNode(opts) {
    const isComposed = opts != null && opts.composed === true;
    let node = this;
    while (node.parentNode != null) {
        node = node.parentNode;
        if (isComposed === true && node.parentNode == null && node.host != null) {
            node = node.host;
        }
    }
    return node;
}

const relocateMetaCharset = (doc) => {
    const head = doc.head;
    let charsetElm = head.querySelector('meta[charset]');
    if (charsetElm == null) {
        // doesn't have <meta charset>, so create it
        charsetElm = doc.createElement('meta');
        charsetElm.setAttribute('charset', 'utf-8');
    }
    else {
        // take the current one out of its existing location
        charsetElm.remove();
    }
    // ensure the <meta charset> is the first node in <head>
    head.insertBefore(charsetElm, head.firstChild);
};

const getUsedSelectors = (elm) => {
    const usedSelectors = {
        attrs: new Set(),
        classNames: new Set(),
        ids: new Set(),
        tags: new Set(),
    };
    collectUsedSelectors(usedSelectors, elm);
    return usedSelectors;
};
const collectUsedSelectors = (usedSelectors, elm) => {
    if (elm != null && elm.nodeType === 1) {
        // tags
        const children = elm.children;
        const tagName = elm.nodeName.toLowerCase();
        usedSelectors.tags.add(tagName);
        // attributes
        const attributes = elm.attributes;
        for (let i = 0, l = attributes.length; i < l; i++) {
            const attr = attributes.item(i);
            const attrName = attr.name.toLowerCase();
            usedSelectors.attrs.add(attrName);
            if (attrName === 'class') {
                // classes
                const classList = elm.classList;
                for (let i = 0, l = classList.length; i < l; i++) {
                    usedSelectors.classNames.add(classList.item(i));
                }
            }
            else if (attrName === 'id') {
                // ids
                usedSelectors.ids.add(attr.value);
            }
        }
        // drill down
        if (children) {
            for (let i = 0, l = children.length; i < l; i++) {
                collectUsedSelectors(usedSelectors, children[i]);
            }
        }
    }
};

const parseCss = (css, filePath) => {
    let lineno = 1;
    let column = 1;
    const diagnostics = [];
    const updatePosition = (str) => {
        const lines = str.match(/\n/g);
        if (lines)
            lineno += lines.length;
        const i = str.lastIndexOf('\n');
        column = ~i ? str.length - i : column + str.length;
    };
    const position = () => {
        const start = { line: lineno, column: column };
        return (node) => {
            node.position = new ParsePosition(start);
            whitespace();
            return node;
        };
    };
    const error = (msg) => {
        const srcLines = css.split('\n');
        const d = {
            level: 'error',
            type: 'css',
            language: 'css',
            header: 'CSS Parse',
            messageText: msg,
            absFilePath: filePath,
            lines: [
                {
                    lineIndex: lineno - 1,
                    lineNumber: lineno,
                    errorCharStart: column,
                    text: css[lineno - 1],
                },
            ],
        };
        if (lineno > 1) {
            const previousLine = {
                lineIndex: lineno - 1,
                lineNumber: lineno - 1,
                text: css[lineno - 2],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.unshift(previousLine);
        }
        if (lineno + 2 < srcLines.length) {
            const nextLine = {
                lineIndex: lineno,
                lineNumber: lineno + 1,
                text: srcLines[lineno],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.push(nextLine);
        }
        diagnostics.push(d);
        return null;
    };
    const stylesheet = () => {
        const rulesList = rules();
        return {
            type: 'stylesheet',
            stylesheet: {
                source: filePath,
                rules: rulesList,
            },
        };
    };
    const open = () => match(/^{\s*/);
    const close = () => match(/^}/);
    const match = (re) => {
        const m = re.exec(css);
        if (!m)
            return;
        const str = m[0];
        updatePosition(str);
        css = css.slice(str.length);
        return m;
    };
    const rules = () => {
        let node;
        const rules = [];
        whitespace();
        comments(rules);
        while (css.length && css.charAt(0) !== '}' && (node = atrule() || rule())) {
            if (node !== false) {
                rules.push(node);
                comments(rules);
            }
        }
        return rules;
    };
    /**
     * Parse whitespace.
     */
    const whitespace = () => match(/^\s*/);
    const comments = (rules) => {
        let c;
        rules = rules || [];
        while ((c = comment())) {
            if (c !== false) {
                rules.push(c);
            }
        }
        return rules;
    };
    const comment = () => {
        const pos = position();
        if ('/' !== css.charAt(0) || '*' !== css.charAt(1))
            return null;
        let i = 2;
        while ('' !== css.charAt(i) && ('*' !== css.charAt(i) || '/' !== css.charAt(i + 1)))
            ++i;
        i += 2;
        if ('' === css.charAt(i - 1)) {
            return error('End of comment missing');
        }
        const comment = css.slice(2, i - 2);
        column += 2;
        updatePosition(comment);
        css = css.slice(i);
        column += 2;
        return pos({
            type: 'comment',
            comment,
        });
    };
    const selector = () => {
        const m = match(/^([^{]+)/);
        if (!m)
            return null;
        return trim(m[0])
            .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
            .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
            return m.replace(/,/g, '\u200C');
        })
            .split(/\s*(?![^(]*\)),\s*/)
            .map(function (s) {
            return s.replace(/\u200C/g, ',');
        });
    };
    const declaration = () => {
        const pos = position();
        // prop
        let prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!prop)
            return null;
        prop = trim(prop[0]);
        // :
        if (!match(/^:\s*/))
            return error(`property missing ':'`);
        // val
        const val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
        const ret = pos({
            type: 'declaration',
            property: prop.replace(commentre, ''),
            value: val ? trim(val[0]).replace(commentre, '') : '',
        });
        match(/^[;\s]*/);
        return ret;
    };
    const declarations = () => {
        const decls = [];
        if (!open())
            return error(`missing '{'`);
        comments(decls);
        // declarations
        let decl;
        while ((decl = declaration())) {
            if (decl !== false) {
                decls.push(decl);
                comments(decls);
            }
        }
        if (!close())
            return error(`missing '}'`);
        return decls;
    };
    const keyframe = () => {
        let m;
        const values = [];
        const pos = position();
        while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
            values.push(m[1]);
            match(/^,\s*/);
        }
        if (!values.length)
            return null;
        return pos({
            type: 'keyframe',
            values,
            declarations: declarations(),
        });
    };
    const atkeyframes = () => {
        const pos = position();
        let m = match(/^@([-\w]+)?keyframes\s*/);
        if (!m)
            return null;
        const vendor = m[1];
        // identifier
        m = match(/^([-\w]+)\s*/);
        if (!m)
            return error(`@keyframes missing name`);
        const name = m[1];
        if (!open())
            return error(`@keyframes missing '{'`);
        let frame;
        let frames = comments();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close())
            return error(`@keyframes missing '}'`);
        return pos({
            type: 'keyframes',
            name: name,
            vendor: vendor,
            keyframes: frames,
        });
    };
    const atsupports = () => {
        const pos = position();
        const m = match(/^@supports *([^{]+)/);
        if (!m)
            return null;
        const supports = trim(m[1]);
        if (!open())
            return error(`@supports missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@supports missing '}'`);
        return pos({
            type: 'supports',
            supports: supports,
            rules: style,
        });
    };
    const athost = () => {
        const pos = position();
        const m = match(/^@host\s*/);
        if (!m)
            return null;
        if (!open())
            return error(`@host missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@host missing '}'`);
        return pos({
            type: 'host',
            rules: style,
        });
    };
    const atmedia = () => {
        const pos = position();
        const m = match(/^@media *([^{]+)/);
        if (!m)
            return null;
        const media = trim(m[1]);
        if (!open())
            return error(`@media missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@media missing '}'`);
        return pos({
            type: 'media',
            media: media,
            rules: style,
        });
    };
    const atcustommedia = () => {
        const pos = position();
        const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (!m)
            return null;
        return pos({
            type: 'custom-media',
            name: trim(m[1]),
            media: trim(m[2]),
        });
    };
    const atpage = () => {
        const pos = position();
        const m = match(/^@page */);
        if (!m)
            return null;
        const sel = selector() || [];
        if (!open())
            return error(`@page missing '{'`);
        let decls = comments();
        let decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close())
            return error(`@page missing '}'`);
        return pos({
            type: 'page',
            selectors: sel,
            declarations: decls,
        });
    };
    const atdocument = () => {
        const pos = position();
        const m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m)
            return null;
        const vendor = trim(m[1]);
        const doc = trim(m[2]);
        if (!open())
            return error(`@document missing '{'`);
        const style = comments().concat(rules());
        if (!close())
            return error(`@document missing '}'`);
        return pos({
            type: 'document',
            document: doc,
            vendor: vendor,
            rules: style,
        });
    };
    const atfontface = () => {
        const pos = position();
        const m = match(/^@font-face\s*/);
        if (!m)
            return null;
        if (!open())
            return error(`@font-face missing '{'`);
        let decls = comments();
        let decl;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments());
        }
        if (!close())
            return error(`@font-face missing '}'`);
        return pos({
            type: 'font-face',
            declarations: decls,
        });
    };
    const _compileAtrule = (name) => {
        const re = new RegExp('^@' + name + '\\s*([^;]+);');
        return () => {
            const pos = position();
            const m = match(re);
            if (!m)
                return null;
            const ret = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
        };
    };
    const atimport = _compileAtrule('import');
    const atcharset = _compileAtrule('charset');
    const atnamespace = _compileAtrule('namespace');
    const atrule = () => {
        if (css[0] !== '@')
            return null;
        return atkeyframes() || atmedia() || atcustommedia() || atsupports() || atimport() || atcharset() || atnamespace() || atdocument() || atpage() || athost() || atfontface();
    };
    const rule = () => {
        const pos = position();
        const sel = selector();
        if (!sel)
            return error('selector missing');
        comments();
        return pos({
            type: 'rule',
            selectors: sel,
            declarations: declarations(),
        });
    };
    class ParsePosition {
        constructor(start) {
            this.start = start;
            this.end = { line: lineno, column: column };
            this.source = filePath;
        }
    }
    ParsePosition.prototype.content = css;
    return Object.assign({ diagnostics }, addParent(stylesheet()));
};
const trim = (str) => (str ? str.trim() : '');
/**
 * Adds non-enumerable parent node reference to each node.
 */
const addParent = (obj, parent) => {
    const isNode = obj && typeof obj.type === 'string';
    const childParent = isNode ? obj : parent;
    for (const k in obj) {
        const value = obj[k];
        if (Array.isArray(value)) {
            value.forEach(function (v) {
                addParent(v, childParent);
            });
        }
        else if (value && typeof value === 'object') {
            addParent(value, childParent);
        }
    }
    if (isNode) {
        Object.defineProperty(obj, 'parent', {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null,
        });
    }
    return obj;
};
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

const getCssSelectors = (sel) => {
    // reusing global SELECTORS since this is a synchronous operation
    SELECTORS.all.length = SELECTORS.tags.length = SELECTORS.classNames.length = SELECTORS.ids.length = SELECTORS.attrs.length = 0;
    sel = sel
        .replace(/\./g, ' .')
        .replace(/\#/g, ' #')
        .replace(/\[/g, ' [')
        .replace(/\>/g, ' > ')
        .replace(/\+/g, ' + ')
        .replace(/\~/g, ' ~ ')
        .replace(/\*/g, ' * ')
        .replace(/\:not\((.*?)\)/g, ' ');
    const items = sel.split(' ');
    for (let i = 0, l = items.length; i < l; i++) {
        items[i] = items[i].split(':')[0];
        if (items[i].length === 0)
            continue;
        if (items[i].charAt(0) === '.') {
            SELECTORS.classNames.push(items[i].substr(1));
        }
        else if (items[i].charAt(0) === '#') {
            SELECTORS.ids.push(items[i].substr(1));
        }
        else if (items[i].charAt(0) === '[') {
            items[i] = items[i]
                .substr(1)
                .split('=')[0]
                .split(']')[0]
                .trim();
            SELECTORS.attrs.push(items[i].toLowerCase());
        }
        else if (/[a-z]/g.test(items[i].charAt(0))) {
            SELECTORS.tags.push(items[i].toLowerCase());
        }
    }
    SELECTORS.classNames = SELECTORS.classNames.sort((a, b) => {
        if (a.length < b.length)
            return -1;
        if (a.length > b.length)
            return 1;
        return 0;
    });
    return SELECTORS;
};
const SELECTORS = {
    all: [],
    tags: [],
    classNames: [],
    ids: [],
    attrs: [],
};

const serializeCss = (stylesheet, serializeOpts) => {
    const usedSelectors = serializeOpts.usedSelectors || null;
    const opts = {
        usedSelectors: usedSelectors || null,
        hasUsedAttrs: !!usedSelectors && usedSelectors.attrs.size > 0,
        hasUsedClassNames: !!usedSelectors && usedSelectors.classNames.size > 0,
        hasUsedIds: !!usedSelectors && usedSelectors.ids.size > 0,
        hasUsedTags: !!usedSelectors && usedSelectors.tags.size > 0,
    };
    const rules = stylesheet.rules;
    if (!rules) {
        return '';
    }
    const rulesLen = rules.length;
    const out = [];
    for (let i = 0; i < rulesLen; i++) {
        out.push(serializeCssVisitNode(opts, rules[i], i, rulesLen));
    }
    return out.join('');
};
const serializeCssVisitNode = (opts, node, index, len) => {
    const nodeType = node.type;
    if (nodeType === 'declaration') {
        return serializeCssDeclaration(node, index, len);
    }
    if (nodeType === 'rule') {
        return serializeCssRule(opts, node);
    }
    if (nodeType === 'comment') {
        if (node.comment[0] === '!') {
            return `/*${node.comment}*/`;
        }
        else {
            return '';
        }
    }
    if (nodeType === 'media') {
        return serializeCssMedia(opts, node);
    }
    if (nodeType === 'keyframes') {
        return serializeCssKeyframes(opts, node);
    }
    if (nodeType === 'keyframe') {
        return serializeCssKeyframe(opts, node);
    }
    if (nodeType === 'font-face') {
        return serializeCssFontFace(opts, node);
    }
    if (nodeType === 'supports') {
        return serializeCssSupports(opts, node);
    }
    if (nodeType === 'import') {
        return '@import ' + node.import + ';';
    }
    if (nodeType === 'charset') {
        return '@charset ' + node.charset + ';';
    }
    if (nodeType === 'page') {
        return serializeCssPage(opts, node);
    }
    if (nodeType === 'host') {
        return '@host{' + serializeCssMapVisit(opts, node.rules) + '}';
    }
    if (nodeType === 'custom-media') {
        return '@custom-media ' + node.name + ' ' + node.media + ';';
    }
    if (nodeType === 'document') {
        return serializeCssDocument(opts, node);
    }
    if (nodeType === 'namespace') {
        return '@namespace ' + node.namespace + ';';
    }
    return '';
};
const serializeCssRule = (opts, node) => {
    const decls = node.declarations;
    const usedSelectors = opts.usedSelectors;
    const selectors = node.selectors.slice();
    if (decls == null || decls.length === 0) {
        return '';
    }
    if (usedSelectors) {
        let i;
        let j;
        let include = true;
        for (i = selectors.length - 1; i >= 0; i--) {
            const sel = getCssSelectors(selectors[i]);
            include = true;
            // classes
            let jlen = sel.classNames.length;
            if (jlen > 0 && opts.hasUsedClassNames) {
                for (j = 0; j < jlen; j++) {
                    if (!usedSelectors.classNames.has(sel.classNames[j])) {
                        include = false;
                        break;
                    }
                }
            }
            // tags
            if (include && opts.hasUsedTags) {
                jlen = sel.tags.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.tags.has(sel.tags[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            // attrs
            if (include && opts.hasUsedAttrs) {
                jlen = sel.attrs.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.attrs.has(sel.attrs[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            // ids
            if (include && opts.hasUsedIds) {
                jlen = sel.ids.length;
                if (jlen > 0) {
                    for (j = 0; j < jlen; j++) {
                        if (!usedSelectors.ids.has(sel.ids[j])) {
                            include = false;
                            break;
                        }
                    }
                }
            }
            if (!include) {
                selectors.splice(i, 1);
            }
        }
    }
    if (selectors.length === 0) {
        return '';
    }
    const cleanedSelectors = [];
    let cleanedSelector = '';
    for (const selector of node.selectors) {
        cleanedSelector = removeSelectorWhitespace(selector);
        if (!cleanedSelectors.includes(cleanedSelector)) {
            cleanedSelectors.push(cleanedSelector);
        }
    }
    return `${cleanedSelectors}{${serializeCssMapVisit(opts, decls)}}`;
};
const serializeCssDeclaration = (node, index, len) => {
    if (node.value === '') {
        return '';
    }
    if (len - 1 === index) {
        return node.property + ':' + node.value;
    }
    return node.property + ':' + node.value + ';';
};
const serializeCssMedia = (opts, node) => {
    const mediaCss = serializeCssMapVisit(opts, node.rules);
    if (mediaCss === '') {
        return '';
    }
    return '@media ' + removeMediaWhitespace(node.media) + '{' + mediaCss + '}';
};
const serializeCssKeyframes = (opts, node) => {
    const keyframesCss = serializeCssMapVisit(opts, node.keyframes);
    if (keyframesCss === '') {
        return '';
    }
    return '@' + (node.vendor || '') + 'keyframes ' + node.name + '{' + keyframesCss + '}';
};
const serializeCssKeyframe = (opts, node) => {
    return node.values.join(',') + '{' + serializeCssMapVisit(opts, node.declarations) + '}';
};
const serializeCssFontFace = (opts, node) => {
    const fontCss = serializeCssMapVisit(opts, node.declarations);
    if (fontCss === '') {
        return '';
    }
    return '@font-face{' + fontCss + '}';
};
const serializeCssSupports = (opts, node) => {
    const supportsCss = serializeCssMapVisit(opts, node.rules);
    if (supportsCss === '') {
        return '';
    }
    return '@supports ' + node.supports + '{' + supportsCss + '}';
};
const serializeCssPage = (opts, node) => {
    const sel = node.selectors.join(', ');
    return '@page ' + sel + '{' + serializeCssMapVisit(opts, node.declarations) + '}';
};
const serializeCssDocument = (opts, node) => {
    const documentCss = serializeCssMapVisit(opts, node.rules);
    const doc = '@' + (node.vendor || '') + 'document ' + node.document;
    if (documentCss === '') {
        return '';
    }
    return doc + '{' + documentCss + '}';
};
const serializeCssMapVisit = (opts, nodes) => {
    let rtn = '';
    if (nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            rtn += serializeCssVisitNode(opts, nodes[i], i, len);
        }
    }
    return rtn;
};
const removeSelectorWhitespace = (selector) => {
    let rtn = '';
    let char = '';
    let inAttr = false;
    selector = selector.trim();
    for (let i = 0, l = selector.length; i < l; i++) {
        char = selector[i];
        if (char === '[' && rtn[rtn.length - 1] !== '\\') {
            inAttr = true;
        }
        else if (char === ']' && rtn[rtn.length - 1] !== '\\') {
            inAttr = false;
        }
        if (!inAttr && CSS_WS_REG.test(char)) {
            if (CSS_NEXT_CHAR_REG.test(selector[i + 1])) {
                continue;
            }
            if (CSS_PREV_CHAR_REG.test(rtn[rtn.length - 1])) {
                continue;
            }
            rtn += ' ';
        }
        else {
            rtn += char;
        }
    }
    return rtn;
};
const removeMediaWhitespace = (media) => {
    let rtn = '';
    let char = '';
    media = media.trim();
    for (let i = 0, l = media.length; i < l; i++) {
        char = media[i];
        if (CSS_WS_REG.test(char)) {
            if (CSS_WS_REG.test(rtn[rtn.length - 1])) {
                continue;
            }
            rtn += ' ';
        }
        else {
            rtn += char;
        }
    }
    return rtn;
};
const CSS_WS_REG = /\s/;
const CSS_NEXT_CHAR_REG = /[>\(\)\~\,\+\s]/;
const CSS_PREV_CHAR_REG = /[>\(\~\,\+]/;

const removeUnusedStyles = (doc, diagnostics) => {
    try {
        const styleElms = doc.head.querySelectorAll(`style[data-styles]`);
        const styleLen = styleElms.length;
        if (styleLen > 0) {
            // pick out all of the selectors that are actually
            // being used in the html document
            const usedSelectors = getUsedSelectors(doc.documentElement);
            for (let i = 0; i < styleLen; i++) {
                removeUnusedStyleText(usedSelectors, diagnostics, styleElms[i]);
            }
        }
    }
    catch (e) {
        catchError(diagnostics, e);
    }
};
const removeUnusedStyleText = (usedSelectors, diagnostics, styleElm) => {
    try {
        // parse the css from being applied to the document
        const parseResults = parseCss(styleElm.innerHTML);
        diagnostics.push(...parseResults.diagnostics);
        if (hasError(diagnostics)) {
            return;
        }
        try {
            // convert the parsed css back into a string
            // but only keeping what was found in our active selectors
            styleElm.innerHTML = serializeCss(parseResults.stylesheet, {
                usedSelectors,
            });
        }
        catch (e) {
            diagnostics.push({
                level: 'warn',
                type: 'css',
                header: 'CSS Stringify',
                messageText: e,
            });
        }
    }
    catch (e) {
        diagnostics.push({
            level: 'warn',
            type: 'css',
            header: 'CSS Parse',
            messageText: e,
        });
    }
};

const updateCanonicalLink = (doc, href) => {
    // https://webmasters.googleblog.com/2009/02/specify-your-canonical.html
    // <link rel="canonical" href="http://www.example.com/product.php?item=swedish-fish" />
    let canonicalLinkElm = doc.head.querySelector('link[rel="canonical"]');
    if (typeof href === 'string') {
        // have a valid href to add
        if (canonicalLinkElm == null) {
            // don't have a <link> element yet, create one
            canonicalLinkElm = doc.createElement('link');
            canonicalLinkElm.setAttribute('rel', 'canonical');
            doc.head.appendChild(canonicalLinkElm);
        }
        // set the href attribute
        canonicalLinkElm.setAttribute('href', href);
    }
    else {
        // don't have a href
        if (canonicalLinkElm != null) {
            // but there is a canonical link in the head so let's remove it
            const existingHref = canonicalLinkElm.getAttribute('href');
            if (!existingHref) {
                canonicalLinkElm.parentNode.removeChild(canonicalLinkElm);
            }
        }
    }
};

function renderToString(html, options) {
    const opts = normalizeHydrateOptions(options);
    opts.serializeToHtml = true;
    return new Promise(resolve => {
        const results = generateHydrateResults(opts);
        if (hasError(results.diagnostics)) {
            resolve(results);
        }
        else if (typeof html === 'string') {
            try {
                opts.destroyWindow = true;
                opts.destroyDocument = true;
                const win = new MockWindow(html);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else if (isValidDocument(html)) {
            try {
                opts.destroyDocument = false;
                const win = patchDomImplementation(html, opts);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else {
            renderBuildError(results, `Invalid html or document. Must be either a valid "html" string, or DOM "document".`);
            resolve(results);
        }
    });
}
function hydrateDocument(doc, options) {
    const opts = normalizeHydrateOptions(options);
    opts.serializeToHtml = false;
    return new Promise(resolve => {
        const results = generateHydrateResults(opts);
        if (hasError(results.diagnostics)) {
            resolve(results);
        }
        else if (typeof doc === 'string') {
            try {
                opts.destroyWindow = true;
                opts.destroyDocument = true;
                const win = new MockWindow(doc);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else if (isValidDocument(doc)) {
            try {
                opts.destroyDocument = false;
                const win = patchDomImplementation(doc, opts);
                render(win, opts, results, resolve);
            }
            catch (e) {
                renderCatchError(results, e);
                resolve(results);
            }
        }
        else {
            renderBuildError(results, `Invalid html or document. Must be either a valid "html" string, or DOM "document".`);
            resolve(results);
        }
    });
}
function render(win, opts, results, resolve) {
    if (!process.__stencilErrors) {
        process.__stencilErrors = true;
        process.on('unhandledRejection', e => {
            console.log('unhandledRejection', e);
        });
    }
    initializeWindow(win, opts, results);
    if (typeof opts.beforeHydrate === 'function') {
        try {
            const rtn = opts.beforeHydrate(win.document);
            if (rtn != null && typeof rtn.then === 'function') {
                rtn.then(() => {
                    hydrateFactory(win, opts, results, afterHydrate, resolve);
                });
            }
            else {
                hydrateFactory(win, opts, results, afterHydrate, resolve);
            }
        }
        catch (e) {
            renderCatchError(results, e);
            finalizeHydrate(win, win.document, opts, results, resolve);
        }
    }
    else {
        hydrateFactory(win, opts, results, afterHydrate, resolve);
    }
}
function afterHydrate(win, opts, results, resolve) {
    if (typeof opts.afterHydrate === 'function') {
        try {
            const rtn = opts.afterHydrate(win.document);
            if (rtn != null && typeof rtn.then === 'function') {
                rtn.then(() => {
                    finalizeHydrate(win, win.document, opts, results, resolve);
                });
            }
            else {
                finalizeHydrate(win, win.document, opts, results, resolve);
            }
        }
        catch (e) {
            renderCatchError(results, e);
            finalizeHydrate(win, win.document, opts, results, resolve);
        }
    }
    else {
        finalizeHydrate(win, win.document, opts, results, resolve);
    }
}
function finalizeHydrate(win, doc, opts, results, resolve) {
    try {
        inspectElement(results, doc.documentElement, 0);
        if (opts.removeUnusedStyles !== false) {
            try {
                removeUnusedStyles(doc, results.diagnostics);
            }
            catch (e) {
                renderCatchError(results, e);
            }
        }
        if (typeof opts.title === 'string') {
            try {
                doc.title = opts.title;
            }
            catch (e) {
                renderCatchError(results, e);
            }
        }
        results.title = doc.title;
        if (opts.removeScripts) {
            removeScripts(doc.documentElement);
        }
        try {
            updateCanonicalLink(doc, opts.canonicalUrl);
        }
        catch (e) {
            renderCatchError(results, e);
        }
        try {
            relocateMetaCharset(doc);
        }
        catch (e) { }
        if (!hasError(results.diagnostics)) {
            results.httpStatus = 200;
        }
        try {
            const metaStatus = doc.head.querySelector('meta[http-equiv="status"]');
            if (metaStatus != null) {
                const metaStatusContent = metaStatus.getAttribute('content');
                if (metaStatusContent && metaStatusContent.length > 0) {
                    results.httpStatus = parseInt(metaStatusContent, 10);
                }
            }
        }
        catch (e) { }
        if (opts.clientHydrateAnnotations) {
            doc.documentElement.classList.add('hydrated');
        }
        if (opts.serializeToHtml) {
            results.html = serializeDocumentToString(doc, opts);
        }
    }
    catch (e) {
        renderCatchError(results, e);
    }
    if (opts.destroyWindow) {
        try {
            if (!opts.destroyDocument) {
                win.document = null;
                doc.defaultView = null;
            }
            win.close();
        }
        catch (e) {
            renderCatchError(results, e);
        }
    }
    resolve(results);
}
function serializeDocumentToString(doc, opts) {
    return serializeNodeToHtml(doc, {
        approximateLineWidth: opts.approximateLineWidth,
        outerHtml: false,
        prettyHtml: opts.prettyHtml,
        removeAttributeQuotes: opts.removeAttributeQuotes,
        removeBooleanAttributeQuotes: opts.removeBooleanAttributeQuotes,
        removeEmptyAttributes: opts.removeEmptyAttributes,
        removeHtmlComments: opts.removeHtmlComments,
        serializeShadowRoot: false,
    });
}
function isValidDocument(doc) {
    return doc != null && doc.nodeType === 9 && doc.documentElement != null && doc.documentElement.nodeType === 1 && doc.body != null && doc.body.nodeType === 1;
}
function removeScripts(elm) {
    const children = elm.children;
    for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        removeScripts(child);
        if (child.nodeName === 'SCRIPT' || (child.nodeName === 'LINK' && child.getAttribute('rel') === 'modulepreload')) {
            child.remove();
        }
    }
}

export { createWindowFromHtml, hydrateDocument, renderToString, serializeDocumentToString };
