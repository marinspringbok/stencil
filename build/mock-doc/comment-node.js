import { MockNode } from './node';
export class MockComment extends MockNode {
    constructor(ownerDocument, data) {
        super(ownerDocument, 8 /* COMMENT_NODE */, "#comment" /* COMMENT_NODE */, data);
    }
    cloneNode(_deep) {
        return new MockComment(null, this.nodeValue);
    }
    get textContent() {
        return this.nodeValue;
    }
    set textContent(text) {
        this.nodeValue = text;
    }
}
