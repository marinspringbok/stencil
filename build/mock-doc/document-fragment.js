import { MockHTMLElement } from './node';
import { getElementById } from './document';
export class MockDocumentFragment extends MockHTMLElement {
    constructor(ownerDocument) {
        super(ownerDocument, null);
        this.nodeName = "#document-fragment" /* DOCUMENT_FRAGMENT_NODE */;
        this.nodeType = 11 /* DOCUMENT_FRAGMENT_NODE */;
    }
    getElementById(id) {
        return getElementById(this, id);
    }
    cloneNode(deep) {
        const cloned = new MockDocumentFragment(null);
        if (deep) {
            for (let i = 0, ii = this.childNodes.length; i < ii; i++) {
                const childNode = this.childNodes[i];
                if (childNode.nodeType === 1 /* ELEMENT_NODE */ || childNode.nodeType === 3 /* TEXT_NODE */ || childNode.nodeType === 8 /* COMMENT_NODE */) {
                    const clonedChildNode = this.childNodes[i].cloneNode(true);
                    cloned.appendChild(clonedChildNode);
                }
            }
        }
        return cloned;
    }
}
