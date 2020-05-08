import { cloneAttributes } from './attribute';
import { createCustomElement } from './custom-element-registry';
import { MockCSSStyleSheet, getStyleElementText, setStyleElementText } from './css-style-sheet';
import { MockDocumentFragment } from './document-fragment';
import { MockElement, MockHTMLElement } from './node';
export function createElement(ownerDocument, tagName) {
    if (typeof tagName !== 'string' || tagName === '' || !/^[a-z0-9-_:]+$/i.test(tagName)) {
        throw new Error(`The tag name provided (${tagName}) is not a valid name.`);
    }
    tagName = tagName.toLowerCase();
    switch (tagName) {
        case 'a':
            return new MockAnchorElement(ownerDocument);
        case 'base':
            return new MockBaseElement(ownerDocument);
        case 'button':
            return new MockButtonElement(ownerDocument);
        case 'canvas':
            return new MockCanvasElement(ownerDocument);
        case 'form':
            return new MockFormElement(ownerDocument);
        case 'img':
            return new MockImageElement(ownerDocument);
        case 'input':
            return new MockInputElement(ownerDocument);
        case 'link':
            return new MockLinkElement(ownerDocument);
        case 'meta':
            return new MockMetaElement(ownerDocument);
        case 'script':
            return new MockScriptElement(ownerDocument);
        case 'style':
            return new MockStyleElement(ownerDocument);
        case 'template':
            return new MockTemplateElement(ownerDocument);
        case 'title':
            return new MockTitleElement(ownerDocument);
    }
    if (ownerDocument != null && tagName.includes('-')) {
        const win = ownerDocument.defaultView;
        if (win != null && win.customElements != null) {
            return createCustomElement(win.customElements, ownerDocument, tagName);
        }
    }
    return new MockHTMLElement(ownerDocument, tagName);
}
export function createElementNS(ownerDocument, namespaceURI, tagName) {
    if (namespaceURI === 'http://www.w3.org/1999/xhtml') {
        return createElement(ownerDocument, tagName);
    }
    else if (namespaceURI === 'http://www.w3.org/2000/svg') {
        return new MockSVGElement(ownerDocument, tagName);
    }
    else {
        return new MockElement(ownerDocument, tagName);
    }
}
export class MockAnchorElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'a');
    }
    get href() {
        return fullUrl(this, 'href');
    }
    set href(value) {
        this.setAttribute('href', value);
    }
}
export class MockButtonElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'button');
    }
}
patchPropAttributes(MockButtonElement.prototype, {
    type: String,
}, {
    type: 'submit',
});
export class MockImageElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'img');
    }
    get src() {
        return fullUrl(this, 'src');
    }
    set src(value) {
        this.setAttribute('src', value);
    }
}
patchPropAttributes(MockImageElement.prototype, {
    height: Number,
    width: Number,
});
export class MockInputElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'input');
    }
    get list() {
        const listId = this.getAttribute('list');
        if (listId) {
            return this.ownerDocument.getElementById(listId);
        }
        return null;
    }
}
patchPropAttributes(MockInputElement.prototype, {
    accept: String,
    autocomplete: String,
    autofocus: Boolean,
    capture: String,
    checked: Boolean,
    disabled: Boolean,
    form: String,
    formaction: String,
    formenctype: String,
    formmethod: String,
    formnovalidate: String,
    formtarget: String,
    height: Number,
    inputmode: String,
    max: String,
    maxLength: Number,
    min: String,
    minLength: Number,
    multiple: Boolean,
    name: String,
    pattern: String,
    placeholder: String,
    required: Boolean,
    readOnly: Boolean,
    size: Number,
    spellCheck: Boolean,
    src: String,
    step: String,
    type: String,
    value: String,
    width: Number,
}, {
    type: 'text',
});
export class MockFormElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'form');
    }
}
patchPropAttributes(MockFormElement.prototype, {
    name: String,
});
export class MockLinkElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'link');
    }
    get href() {
        return fullUrl(this, 'href');
    }
    set href(value) {
        this.setAttribute('href', value);
    }
}
patchPropAttributes(MockLinkElement.prototype, {
    crossorigin: String,
    media: String,
    rel: String,
    type: String,
});
export class MockMetaElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'meta');
    }
}
patchPropAttributes(MockMetaElement.prototype, {
    charset: String,
    content: String,
    name: String,
});
export class MockScriptElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'script');
    }
    get src() {
        return fullUrl(this, 'src');
    }
    set src(value) {
        this.setAttribute('src', value);
    }
}
patchPropAttributes(MockScriptElement.prototype, {
    type: String,
});
export class MockStyleElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'style');
        this.sheet = new MockCSSStyleSheet(this);
    }
    get innerHTML() {
        return getStyleElementText(this);
    }
    set innerHTML(value) {
        setStyleElementText(this, value);
    }
    get innerText() {
        return getStyleElementText(this);
    }
    set innerText(value) {
        setStyleElementText(this, value);
    }
    get textContent() {
        return getStyleElementText(this);
    }
    set textContent(value) {
        setStyleElementText(this, value);
    }
}
export class MockSVGElement extends MockElement {
    // SVGElement properties and methods
    get ownerSVGElement() {
        return null;
    }
    get viewportElement() {
        return null;
    }
    focus() {
        /**/
    }
    onunload() {
        /**/
    }
    // SVGGeometryElement properties and methods
    get pathLength() {
        return 0;
    }
    isPointInFill(_pt) {
        return false;
    }
    isPointInStroke(_pt) {
        return false;
    }
    getTotalLength() {
        return 0;
    }
}
export class MockBaseElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'base');
    }
    get href() {
        return fullUrl(this, 'href');
    }
    set href(value) {
        this.setAttribute('href', value);
    }
}
export class MockTemplateElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'template');
        this.content = new MockDocumentFragment(ownerDocument);
    }
    get innerHTML() {
        return this.content.innerHTML;
    }
    set innerHTML(html) {
        this.content.innerHTML = html;
    }
    cloneNode(deep) {
        const cloned = new MockTemplateElement(null);
        cloned.attributes = cloneAttributes(this.attributes);
        const styleCssText = this.getAttribute('style');
        if (styleCssText != null && styleCssText.length > 0) {
            cloned.setAttribute('style', styleCssText);
        }
        cloned.content = this.content.cloneNode(deep);
        if (deep) {
            for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
                const clonedChildNode = this.childNodes[i].cloneNode(true);
                cloned.appendChild(clonedChildNode);
            }
        }
        return cloned;
    }
}
export class MockTitleElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'title');
    }
    get text() {
        return this.textContent;
    }
    set text(value) {
        this.textContent = value;
    }
}
export class MockCanvasElement extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, 'canvas');
    }
    getContext() {
        return {
            fillRect: function () {
                return;
            },
            clearRect: function () {
                return;
            },
            getImageData: function (_, __, w, h) {
                return {
                    data: new Array(w * h * 4),
                };
            },
            putImageData: function () {
                return;
            },
            createImageData: function () {
                return [];
            },
            setTransform: function () {
                return;
            },
            drawImage: function () {
                return;
            },
            save: function () {
                return;
            },
            fillText: function () {
                return;
            },
            restore: function () {
                return;
            },
            beginPath: function () {
                return;
            },
            moveTo: function () {
                return;
            },
            lineTo: function () {
                return;
            },
            closePath: function () {
                return;
            },
            stroke: function () {
                return;
            },
            translate: function () {
                return;
            },
            scale: function () {
                return;
            },
            rotate: function () {
                return;
            },
            arc: function () {
                return;
            },
            fill: function () {
                return;
            },
            measureText: function () {
                return { width: 0 };
            },
            transform: function () {
                return;
            },
            rect: function () {
                return;
            },
            clip: function () {
                return;
            },
        };
    }
}
function fullUrl(elm, attrName) {
    const val = elm.getAttribute(attrName) || '';
    if (elm.ownerDocument != null) {
        const win = elm.ownerDocument.defaultView;
        if (win != null) {
            const loc = win.location;
            if (loc != null) {
                const url = new URL(val, loc.href);
                return url.href;
            }
        }
    }
    return val.replace(/\'|\"/g, '').trim();
}
function patchPropAttributes(prototype, attrs, defaults = {}) {
    Object.keys(attrs).forEach(propName => {
        const attr = attrs[propName];
        const defaultValue = defaults[propName];
        if (attr === Boolean) {
            Object.defineProperty(prototype, propName, {
                get() {
                    return this.hasAttribute(propName);
                },
                set(value) {
                    if (value) {
                        this.setAttribute(propName, '');
                    }
                    else {
                        this.removeAttribute(propName);
                    }
                },
            });
        }
        else if (attr === Number) {
            Object.defineProperty(prototype, propName, {
                get() {
                    const value = this.getAttribute(propName);
                    return value ? parseInt(value, 10) : defaultValue === undefined ? 0 : defaultValue;
                },
                set(value) {
                    this.setAttribute(propName, value);
                },
            });
        }
        else {
            Object.defineProperty(prototype, propName, {
                get() {
                    return this.hasAttribute(propName) ? this.getAttribute(propName) : defaultValue || '';
                },
                set(value) {
                    this.setAttribute(propName, value);
                },
            });
        }
    });
}
MockElement.prototype.cloneNode = function (deep) {
    // because we're creating elements, which extending specific HTML base classes there
    // is a MockElement circular reference that bundling has trouble dealing with so
    // the fix is to add cloneNode() to MockElement's prototype after the HTML classes
    const cloned = createElement(this.ownerDocument, this.nodeName);
    cloned.attributes = cloneAttributes(this.attributes);
    const styleCssText = this.getAttribute('style');
    if (styleCssText != null && styleCssText.length > 0) {
        cloned.setAttribute('style', styleCssText);
    }
    if (deep) {
        for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
            const clonedChildNode = this.childNodes[i].cloneNode(true);
            cloned.appendChild(clonedChildNode);
        }
    }
    return cloned;
};
