export declare const enum VNODE_FLAGS {
    isSlotReference = 1,
    isSlotFallback = 2,
    isHost = 4
}
export declare const enum PROXY_FLAGS {
    isElementConstructor = 1,
    proxyState = 2
}
export declare const enum PLATFORM_FLAGS {
    isTmpDisconnected = 1,
    appLoaded = 2,
    queueSync = 4,
    queueMask = 6
}
export declare const enum NODE_TYPE {
    ElementNode = 1,
    TextNode = 3,
    CommentNode = 8,
    DocumentNode = 9,
    DocumentTypeNode = 10,
    DocumentFragment = 11
}
export declare const CONTENT_REF_ID = "r";
export declare const ORG_LOCATION_ID = "o";
export declare const SLOT_NODE_ID = "s";
export declare const TEXT_NODE_ID = "t";
export declare const HYDRATE_ID = "s-id";
export declare const HYDRATED_STYLE_ID = "sty-id";
export declare const HYDRATE_CHILD_ID = "c-id";
export declare const HYDRATED_CSS = "{visibility:hidden}.hydrated{visibility:inherit}";
export declare const XLINK_NS = "http://www.w3.org/1999/xlink";
