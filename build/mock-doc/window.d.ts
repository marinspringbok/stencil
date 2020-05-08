import { MockEvent } from './event';
import { MockHistory } from './history';
import { MockIntersectionObserver } from './intersection-observer';
import { MockLocation } from './location';
import { MockNavigator } from './navigator';
import { MockStorage } from './storage';
declare const nativeClearInterval: typeof clearInterval;
declare const nativeClearTimeout: typeof clearTimeout;
declare const nativeSetInterval: typeof setInterval;
declare const nativeSetTimeout: typeof setTimeout;
export declare class MockWindow {
    __timeouts: Set<any>;
    __history: MockHistory;
    __elementCstr: any;
    __htmlElementCstr: any;
    __charDataCstr: any;
    __docTypeCstr: any;
    __docCstr: any;
    __docFragCstr: any;
    __domTokenListCstr: any;
    __nodeCstr: any;
    __nodeListCstr: any;
    __localStorage: MockStorage;
    __sessionStorage: MockStorage;
    __location: MockLocation;
    __navigator: MockNavigator;
    __clearInterval: typeof nativeClearInterval;
    __clearTimeout: typeof nativeClearTimeout;
    __setInterval: typeof nativeSetInterval;
    __setTimeout: typeof nativeSetTimeout;
    __maxTimeout: number;
    __allowInterval: boolean;
    URL: typeof URL;
    console: Console;
    customElements: CustomElementRegistry;
    document: Document;
    performance: Performance;
    devicePixelRatio: number;
    innerHeight: number;
    innerWidth: number;
    pageXOffset: number;
    pageYOffset: number;
    screen: Screen;
    screenLeft: number;
    screenTop: number;
    screenX: number;
    screenY: number;
    scrollX: number;
    scrollY: number;
    constructor(html?: string | boolean);
    addEventListener(type: string, handler: (ev?: any) => void): void;
    alert(msg: string): void;
    blur(): any;
    cancelAnimationFrame(id: any): void;
    cancelIdleCallback(id: any): void;
    get CharacterData(): any;
    set CharacterData(charDataCstr: any);
    clearInterval(id: any): void;
    clearTimeout(id: any): void;
    close(): void;
    confirm(): boolean;
    get CSS(): {
        supports: () => boolean;
    };
    get Document(): any;
    set Document(docCstr: any);
    get DocumentFragment(): any;
    set DocumentFragment(docFragCstr: any);
    get DocumentType(): any;
    set DocumentType(docTypeCstr: any);
    get DOMTokenList(): any;
    set DOMTokenList(domTokenListCstr: any);
    dispatchEvent(ev: MockEvent): boolean;
    get Element(): any;
    focus(): any;
    getComputedStyle(_: any): any;
    get globalThis(): this;
    get history(): any;
    set history(hsty: any);
    get JSON(): JSON;
    get HTMLElement(): any;
    set HTMLElement(htmlElementCstr: any);
    get IntersectionObserver(): typeof MockIntersectionObserver;
    get localStorage(): MockStorage;
    set localStorage(locStorage: MockStorage);
    get location(): Location;
    set location(val: Location);
    matchMedia(): {
        matches: boolean;
    };
    get Node(): any;
    get NodeList(): any;
    get navigator(): any;
    set navigator(nav: any);
    get parent(): any;
    prompt(): string;
    open(): any;
    get origin(): string;
    removeEventListener(type: string, handler: any): void;
    requestAnimationFrame(callback: (timestamp: number) => void): number;
    requestIdleCallback(callback: (deadline: {
        didTimeout: boolean;
        timeRemaining: () => number;
    }) => void): number;
    scroll(_x?: number, _y?: number): void;
    scrollBy(_x?: number, _y?: number): void;
    scrollTo(_x?: number, _y?: number): void;
    get self(): this;
    get sessionStorage(): any;
    set sessionStorage(locStorage: any);
    setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
    setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;
    get top(): this;
    get window(): this;
    onanimationstart(): void;
    onanimationend(): void;
    onanimationiteration(): void;
    onabort(): void;
    onauxclick(): void;
    onbeforecopy(): void;
    onbeforecut(): void;
    onbeforepaste(): void;
    onblur(): void;
    oncancel(): void;
    oncanplay(): void;
    oncanplaythrough(): void;
    onchange(): void;
    onclick(): void;
    onclose(): void;
    oncontextmenu(): void;
    oncopy(): void;
    oncuechange(): void;
    oncut(): void;
    ondblclick(): void;
    ondrag(): void;
    ondragend(): void;
    ondragenter(): void;
    ondragleave(): void;
    ondragover(): void;
    ondragstart(): void;
    ondrop(): void;
    ondurationchange(): void;
    onemptied(): void;
    onended(): void;
    onerror(): void;
    onfocus(): void;
    onformdata(): void;
    onfullscreenchange(): void;
    onfullscreenerror(): void;
    ongotpointercapture(): void;
    oninput(): void;
    oninvalid(): void;
    onkeydown(): void;
    onkeypress(): void;
    onkeyup(): void;
    onload(): void;
    onloadeddata(): void;
    onloadedmetadata(): void;
    onloadstart(): void;
    onlostpointercapture(): void;
    onmousedown(): void;
    onmouseenter(): void;
    onmouseleave(): void;
    onmousemove(): void;
    onmouseout(): void;
    onmouseover(): void;
    onmouseup(): void;
    onmousewheel(): void;
    onpaste(): void;
    onpause(): void;
    onplay(): void;
    onplaying(): void;
    onpointercancel(): void;
    onpointerdown(): void;
    onpointerenter(): void;
    onpointerleave(): void;
    onpointermove(): void;
    onpointerout(): void;
    onpointerover(): void;
    onpointerup(): void;
    onprogress(): void;
    onratechange(): void;
    onreset(): void;
    onresize(): void;
    onscroll(): void;
    onsearch(): void;
    onseeked(): void;
    onseeking(): void;
    onselect(): void;
    onselectstart(): void;
    onstalled(): void;
    onsubmit(): void;
    onsuspend(): void;
    ontimeupdate(): void;
    ontoggle(): void;
    onvolumechange(): void;
    onwaiting(): void;
    onwebkitfullscreenchange(): void;
    onwebkitfullscreenerror(): void;
    onwheel(): void;
}
export declare function createWindow(html?: string | boolean): Window;
export declare function cloneWindow(srcWin: Window, opts?: {
    customElementProxy?: boolean;
}): MockWindow;
export declare function cloneDocument(srcDoc: Document): Document;
/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 */
export declare function constrainTimeouts(win: any): void;
export {};
