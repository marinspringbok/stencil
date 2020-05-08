import { MockNode, serializeNodeToHtml } from '@stencil/core/mock-doc';
const print = (val) => {
    return serializeNodeToHtml(val, {
        serializeShadowRoot: true,
        prettyHtml: true,
        outerHtml: true,
    });
};
const test = (val) => {
    return val !== undefined && val !== null && (val instanceof HTMLElement || val instanceof MockNode);
};
export const HtmlSerializer = {
    print,
    test,
};
