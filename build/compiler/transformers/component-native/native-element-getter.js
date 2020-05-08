import ts from 'typescript';
export const addNativeElementGetter = (classMembers, cmp) => {
    // @Element() element;
    // is transformed into:
    // get element() { return this; }
    if (cmp.elementRef) {
        classMembers.push(ts.createGetAccessor(undefined, undefined, cmp.elementRef, [], undefined, ts.createBlock([ts.createReturn(ts.createThis())])));
    }
};
