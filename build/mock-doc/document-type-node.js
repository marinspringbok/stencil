import { MockHTMLElement } from './node';
export class MockDocumentTypeNode extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, '!DOCTYPE');
        this.nodeType = 10 /* DOCUMENT_TYPE_NODE */;
        this.setAttribute('html', '');
    }
}
