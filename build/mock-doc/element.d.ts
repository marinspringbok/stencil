import { MockCSSStyleSheet } from './css-style-sheet';
import { MockDocumentFragment } from './document-fragment';
import { MockElement, MockHTMLElement } from './node';
export declare function createElement(ownerDocument: any, tagName: string): any;
export declare function createElementNS(ownerDocument: any, namespaceURI: string, tagName: string): any;
export declare class MockAnchorElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get href(): string;
    set href(value: string);
}
export declare class MockButtonElement extends MockHTMLElement {
    constructor(ownerDocument: any);
}
export declare class MockImageElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get src(): string;
    set src(value: string);
}
export declare class MockInputElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get list(): HTMLElement;
}
export declare class MockFormElement extends MockHTMLElement {
    constructor(ownerDocument: any);
}
export declare class MockLinkElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get href(): string;
    set href(value: string);
}
export declare class MockMetaElement extends MockHTMLElement {
    constructor(ownerDocument: any);
}
export declare class MockScriptElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get src(): string;
    set src(value: string);
}
export declare class MockStyleElement extends MockHTMLElement {
    sheet: MockCSSStyleSheet;
    constructor(ownerDocument: any);
    get innerHTML(): string;
    set innerHTML(value: string);
    get innerText(): string;
    set innerText(value: string);
    get textContent(): string;
    set textContent(value: string);
}
export declare class MockSVGElement extends MockElement {
    get ownerSVGElement(): SVGSVGElement;
    get viewportElement(): SVGElement;
    focus(): void;
    onunload(): void;
    get pathLength(): number;
    isPointInFill(_pt: DOMPoint): boolean;
    isPointInStroke(_pt: DOMPoint): boolean;
    getTotalLength(): number;
}
export declare class MockBaseElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get href(): string;
    set href(value: string);
}
export declare class MockTemplateElement extends MockHTMLElement {
    content: MockDocumentFragment;
    constructor(ownerDocument: any);
    get innerHTML(): string;
    set innerHTML(html: string);
    cloneNode(deep?: boolean): MockTemplateElement;
}
export declare class MockTitleElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    get text(): string;
    set text(value: string);
}
export declare class MockCanvasElement extends MockHTMLElement {
    constructor(ownerDocument: any);
    getContext(): {
        fillRect: () => void;
        clearRect: () => void;
        getImageData: (_: number, __: number, w: number, h: number) => {
            data: any[];
        };
        putImageData: () => void;
        createImageData: () => any[];
        setTransform: () => void;
        drawImage: () => void;
        save: () => void;
        fillText: () => void;
        restore: () => void;
        beginPath: () => void;
        moveTo: () => void;
        lineTo: () => void;
        closePath: () => void;
        stroke: () => void;
        translate: () => void;
        scale: () => void;
        rotate: () => void;
        arc: () => void;
        fill: () => void;
        measureText: () => {
            width: number;
        };
        transform: () => void;
        rect: () => void;
        clip: () => void;
    };
}
