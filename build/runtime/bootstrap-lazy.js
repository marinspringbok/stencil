import { appDidLoad, forceUpdate } from './update-component';
import { BUILD } from '@app-data';
import { connectedCallback } from './connected-callback';
import { convertScopedToShadow, registerStyle } from './styles';
import { createTime, installDevTools } from './profile';
import { disconnectedCallback } from './disconnected-callback';
import { doc, getHostRef, plt, registerHost, win, supportsShadow, consoleDevWarn } from '@platform';
import { hmrStart } from './hmr-component';
import { HYDRATED_CSS, HYDRATED_STYLE_ID } from './runtime-constants';
import { patchCloneNode, patchSlotAppendChild, patchChildSlotNodes } from './dom-extras';
import { proxyComponent } from './proxy-component';
export const bootstrapLazy = (lazyBundles, options = {}) => {
    if (BUILD.profile && performance.mark) {
        performance.mark('st:app:start');
    }
    installDevTools();
    const endBootstrap = createTime('bootstrapLazy');
    const cmpTags = [];
    const exclude = options.exclude || [];
    const customElements = win.customElements;
    const head = doc.head;
    const metaCharset = /*@__PURE__*/ head.querySelector('meta[charset]');
    const visibilityStyle = /*@__PURE__*/ doc.createElement('style');
    const deferredConnectedCallbacks = [];
    const styles = /*@__PURE__*/ doc.querySelectorAll(`[${HYDRATED_STYLE_ID}]`);
    let appLoadFallback;
    let isBootstrapping = true;
    let i = 0;
    Object.assign(plt, options);
    plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
    if (BUILD.asyncQueue) {
        if (options.syncQueue) {
            plt.$flags$ |= 4 /* queueSync */;
        }
    }
    if (BUILD.hydrateClientSide) {
        // If the app is already hydrated there is not point to disable the
        // async queue. This will improve the first input delay
        plt.$flags$ |= 2 /* appLoaded */;
    }
    if (BUILD.hydrateClientSide && BUILD.shadowDom) {
        for (; i < styles.length; i++) {
            registerStyle(styles[i].getAttribute(HYDRATED_STYLE_ID), convertScopedToShadow(styles[i].innerHTML), true);
        }
    }
    lazyBundles.map(lazyBundle => lazyBundle[1].map(compactMeta => {
        const cmpMeta = {
            $flags$: compactMeta[0],
            $tagName$: compactMeta[1],
            $members$: compactMeta[2],
            $listeners$: compactMeta[3],
        };
        if (BUILD.member) {
            cmpMeta.$members$ = compactMeta[2];
        }
        if (BUILD.hostListener) {
            cmpMeta.$listeners$ = compactMeta[3];
        }
        if (BUILD.reflect) {
            cmpMeta.$attrsToReflect$ = [];
        }
        if (BUILD.watchCallback) {
            cmpMeta.$watchers$ = {};
        }
        if (BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */) {
            cmpMeta.$flags$ |= 8 /* needsShadowDomShim */;
        }
        const tagName = BUILD.transformTagName && options.transformTagName ? options.transformTagName(cmpMeta.$tagName$) : cmpMeta.$tagName$;
        const HostElement = class extends HTMLElement {
            // StencilLazyHost
            constructor(self) {
                // @ts-ignore
                super(self);
                self = this;
                registerHost(self, cmpMeta);
                if (BUILD.shadowDom && cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */) {
                    // this component is using shadow dom
                    // and this browser supports shadow dom
                    // add the read-only property "shadowRoot" to the host element
                    // adding the shadow root build conditionals to minimize runtime
                    if (supportsShadow) {
                        if (BUILD.shadowDelegatesFocus) {
                            self.attachShadow({
                                mode: 'open',
                                delegatesFocus: !!(cmpMeta.$flags$ & 16 /* shadowDelegatesFocus */),
                            });
                        }
                        else {
                            self.attachShadow({ mode: 'open' });
                        }
                    }
                    else if (!BUILD.hydrateServerSide && !('shadowRoot' in self)) {
                        self.shadowRoot = self;
                    }
                }
                if (BUILD.slotChildNodesFix) {
                    patchChildSlotNodes(self, cmpMeta);
                }
            }
            connectedCallback() {
                if (appLoadFallback) {
                    clearTimeout(appLoadFallback);
                    appLoadFallback = null;
                }
                if (isBootstrapping) {
                    // connectedCallback will be processed once all components have been registered
                    deferredConnectedCallbacks.push(this);
                }
                else {
                    plt.jmp(() => connectedCallback(this));
                }
            }
            disconnectedCallback() {
                plt.jmp(() => disconnectedCallback(this));
            }
            forceUpdate() {
                if (BUILD.isDev) {
                    consoleDevWarn(`element.forceUpdate() is deprecated, use the "forceUpdate" function from "@stencil/core" instead:

  import { forceUpdate } from ‘@stencil/core’;

  forceUpdate(this);
  forceUpdate(element);`);
                }
                forceUpdate(this);
            }
            componentOnReady() {
                return getHostRef(this).$onReadyPromise$;
            }
        };
        if (BUILD.cloneNodeFix) {
            patchCloneNode(HostElement.prototype);
        }
        if (BUILD.appendChildSlotFix) {
            patchSlotAppendChild(HostElement.prototype);
        }
        if (BUILD.hotModuleReplacement) {
            HostElement.prototype['s-hmr'] = function (hmrVersionId) {
                hmrStart(this, cmpMeta, hmrVersionId);
            };
        }
        cmpMeta.$lazyBundleIds$ = lazyBundle[0];
        if (!exclude.includes(tagName) && !customElements.get(tagName)) {
            cmpTags.push(tagName);
            customElements.define(tagName, proxyComponent(HostElement, cmpMeta, 1 /* isElementConstructor */));
        }
    }));
    if (BUILD.hydratedClass || BUILD.hydratedAttribute) {
        visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
        visibilityStyle.setAttribute('data-styles', '');
        head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
    }
    // Process deferred connectedCallbacks now all components have been registered
    isBootstrapping = false;
    if (deferredConnectedCallbacks.length) {
        deferredConnectedCallbacks.map(host => host.connectedCallback());
    }
    else {
        if (BUILD.profile) {
            plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30, 'timeout')));
        }
        else {
            plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30)));
        }
    }
    // Fallback appLoad event
    endBootstrap();
};
