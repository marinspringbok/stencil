export declare const createAttributeProxy: (caseInsensitive: boolean) => any;
export declare class MockAttributeMap {
    caseInsensitive: boolean;
    __items: MockAttr[];
    constructor(caseInsensitive?: boolean);
    get length(): number;
    item(index: number): MockAttr;
    setNamedItem(attr: MockAttr): void;
    setNamedItemNS(attr: MockAttr): void;
    getNamedItem(attrName: string): MockAttr;
    getNamedItemNS(namespaceURI: string, attrName: string): MockAttr;
    removeNamedItem(attr: MockAttr): void;
    removeNamedItemNS(attr: MockAttr): void;
}
export declare function cloneAttributes(srcAttrs: MockAttributeMap, sortByName?: boolean): MockAttributeMap;
export declare class MockAttr {
    private _name;
    private _value;
    private _namespaceURI;
    constructor(attrName: string, attrValue: string, namespaceURI?: string);
    get name(): string;
    set name(value: string);
    get value(): string;
    set value(value: string);
    get nodeName(): string;
    set nodeName(value: string);
    get nodeValue(): string;
    set nodeValue(value: string);
    get namespaceURI(): string;
    set namespaceURI(namespaceURI: string);
}
