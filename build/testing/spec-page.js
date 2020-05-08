import { bootstrapLazy, flushAll, flushLoadModule, flushQueue, getHostRef, insertVdomAnnotations, registerComponents, registerContext, registerModule, renderVdom, resetPlatform, startAutoApplyChanges, styles, win, writeTask, setSupportsShadowDom, } from '@stencil/core/internal/testing';
import { BUILD } from '@app-data';
import { formatLazyBundleRuntimeMeta } from '@utils';
import { getBuildFeatures } from '../compiler/app-core/app-data';
import { resetBuildConditionals } from './reset-build-conditionals';
export async function newSpecPage(opts) {
    if (opts == null) {
        throw new Error(`NewSpecPageOptions required`);
    }
    // reset the platform for this new test
    resetPlatform();
    resetBuildConditionals(BUILD);
    registerContext(opts.context);
    if (Array.isArray(opts.components)) {
        registerComponents(opts.components);
    }
    if (opts.hydrateClientSide) {
        opts.includeAnnotations = true;
    }
    if (opts.hydrateServerSide) {
        opts.includeAnnotations = true;
        setSupportsShadowDom(false);
    }
    else {
        opts.includeAnnotations = !!opts.includeAnnotations;
        if (opts.supportsShadowDom === false) {
            setSupportsShadowDom(false);
        }
        else {
            setSupportsShadowDom(true);
        }
    }
    BUILD.cssAnnotations = opts.includeAnnotations;
    const cmpTags = new Set();
    win['__stencil_spec_options'] = opts;
    const doc = win.document;
    const page = {
        win: win,
        doc: doc,
        body: doc.body,
        build: BUILD,
        styles: styles,
        setContent: html => {
            doc.body.innerHTML = html;
            return flushAll();
        },
        waitForChanges: flushAll,
        flushLoadModule: flushLoadModule,
        flushQueue: flushQueue,
    };
    const lazyBundles = opts.components.map((Cstr) => {
        if (Cstr.COMPILER_META == null) {
            throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
        }
        cmpTags.add(Cstr.COMPILER_META.tagName);
        Cstr.isProxied = false;
        proxyComponentLifeCycles(Cstr);
        const textBundleId = `${Cstr.COMPILER_META.tagName}.${(Math.round(Math.random() * 899999) + 100000)}`;
        const stylesMeta = Cstr.COMPILER_META.styles;
        let bundleId = textBundleId;
        if (Array.isArray(stylesMeta)) {
            stylesMeta.forEach(style => {
                styles.set(style.styleId, style.styleStr);
            });
            if (stylesMeta.length > 1) {
                bundleId = {};
                stylesMeta.forEach(style => {
                    bundleId[style.styleId] = textBundleId;
                });
            }
        }
        registerModule(bundleId, Cstr);
        const lazyBundleRuntimeMeta = formatLazyBundleRuntimeMeta(bundleId, [Cstr.COMPILER_META]);
        return lazyBundleRuntimeMeta;
    });
    const cmpCompilerMeta = opts.components.map(Cstr => Cstr.COMPILER_META);
    const cmpBuild = getBuildFeatures(cmpCompilerMeta);
    if (opts.strictBuild) {
        Object.assign(BUILD, cmpBuild);
    }
    else {
        Object.keys(cmpBuild).forEach(key => {
            if (cmpBuild[key] === true) {
                BUILD[key] = true;
            }
        });
    }
    BUILD.asyncLoading = true;
    if (opts.hydrateClientSide) {
        BUILD.hydrateClientSide = true;
        BUILD.hydrateServerSide = false;
    }
    else if (opts.hydrateServerSide) {
        BUILD.hydrateServerSide = true;
        BUILD.hydrateClientSide = false;
    }
    BUILD.cloneNodeFix = false;
    BUILD.shadowDomShim = false;
    BUILD.safari10 = false;
    page.flush = () => {
        console.warn(`DEPRECATED: page.flush(), please use page.waitForChanges() instead`);
        return page.waitForChanges();
    };
    if (typeof opts.url === 'string') {
        page.win.location.href = opts.url;
    }
    if (typeof opts.direction === 'string') {
        page.doc.documentElement.setAttribute('dir', opts.direction);
    }
    if (typeof opts.language === 'string') {
        page.doc.documentElement.setAttribute('lang', opts.language);
    }
    if (typeof opts.cookie === 'string') {
        try {
            page.doc.cookie = opts.cookie;
        }
        catch (e) { }
    }
    if (typeof opts.referrer === 'string') {
        try {
            page.doc.referrer = opts.referrer;
        }
        catch (e) { }
    }
    if (typeof opts.userAgent === 'string') {
        try {
            page.win.navigator.userAgent = opts.userAgent;
        }
        catch (e) { }
    }
    bootstrapLazy(lazyBundles);
    if (typeof opts.template === 'function') {
        const cmpMeta = {
            $flags$: 0,
            $tagName$: 'body',
        };
        const ref = {
            $ancestorComponent$: undefined,
            $flags$: 0,
            $modeName$: undefined,
            $cmpMeta$: cmpMeta,
            $hostElement$: page.body,
        };
        renderVdom(ref, opts.template());
    }
    else if (typeof opts.html === 'string') {
        page.body.innerHTML = opts.html;
    }
    if (opts.flushQueue !== false) {
        await page.waitForChanges();
    }
    let rootComponent = null;
    Object.defineProperty(page, 'root', {
        get() {
            if (rootComponent == null) {
                rootComponent = findRootComponent(cmpTags, page.body);
            }
            if (rootComponent != null) {
                return rootComponent;
            }
            const firstElementChild = page.body.firstElementChild;
            if (firstElementChild != null) {
                return firstElementChild;
            }
            return null;
        },
    });
    Object.defineProperty(page, 'rootInstance', {
        get() {
            const hostRef = getHostRef(page.root);
            if (hostRef != null) {
                return hostRef.$lazyInstance$;
            }
            return null;
        },
    });
    if (opts.hydrateServerSide) {
        insertVdomAnnotations(doc);
    }
    if (opts.autoApplyChanges) {
        startAutoApplyChanges();
        page.waitForChanges = () => {
            console.error('waitForChanges() cannot be used manually if the "startAutoApplyChanges" option is enabled');
            return Promise.resolve();
        };
    }
    return page;
}
function proxyComponentLifeCycles(Cstr) {
    if (typeof Cstr.prototype.__componentWillLoad === 'function') {
        Cstr.prototype.componentWillLoad = Cstr.prototype.__componentWillLoad;
        Cstr.prototype.__componentWillLoad = null;
    }
    if (typeof Cstr.prototype.__componentWillUpdate === 'function') {
        Cstr.prototype.componentWillUpdate = Cstr.prototype.__componentWillUpdate;
        Cstr.prototype.__componentWillUpdate = null;
    }
    if (typeof Cstr.prototype.__componentWillRender === 'function') {
        Cstr.prototype.componentWillRender = Cstr.prototype.__componentWillRender;
        Cstr.prototype.__componentWillRender = null;
    }
    if (typeof Cstr.prototype.componentWillLoad === 'function') {
        Cstr.prototype.__componentWillLoad = Cstr.prototype.componentWillLoad;
        Cstr.prototype.componentWillLoad = function () {
            const result = this.__componentWillLoad();
            if (result != null && typeof result.then === 'function') {
                writeTask(() => result);
            }
            else {
                writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
    if (typeof Cstr.prototype.componentWillUpdate === 'function') {
        Cstr.prototype.__componentWillUpdate = Cstr.prototype.componentWillUpdate;
        Cstr.prototype.componentWillUpdate = function () {
            const result = this.__componentWillUpdate();
            if (result != null && typeof result.then === 'function') {
                writeTask(() => result);
            }
            else {
                writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
    if (typeof Cstr.prototype.componentWillRender === 'function') {
        Cstr.prototype.__componentWillRender = Cstr.prototype.componentWillRender;
        Cstr.prototype.componentWillRender = function () {
            const result = this.__componentWillRender();
            if (result != null && typeof result.then === 'function') {
                writeTask(() => result);
            }
            else {
                writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
}
function findRootComponent(cmpTags, node) {
    if (node != null) {
        const children = node.children;
        const childrenLength = children.length;
        for (let i = 0; i < childrenLength; i++) {
            const elm = children[i];
            if (cmpTags.has(elm.nodeName.toLowerCase())) {
                return elm;
            }
        }
        for (let i = 0; i < childrenLength; i++) {
            const r = findRootComponent(cmpTags, children[i]);
            if (r != null) {
                return r;
            }
        }
    }
    return null;
}
