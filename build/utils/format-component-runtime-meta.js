export const formatLazyBundleRuntimeMeta = (bundleId, cmps) => {
    return [bundleId, cmps.map(cmp => formatComponentRuntimeMeta(cmp, true))];
};
export const formatComponentRuntimeMeta = (compilerMeta, includeMethods) => {
    let flags = 0;
    if (compilerMeta.encapsulation === 'shadow') {
        flags |= 1 /* shadowDomEncapsulation */;
        if (compilerMeta.shadowDelegatesFocus) {
            flags |= 16 /* shadowDelegatesFocus */;
        }
    }
    else if (compilerMeta.encapsulation === 'scoped') {
        flags |= 2 /* scopedCssEncapsulation */;
    }
    if (compilerMeta.encapsulation !== 'shadow' && compilerMeta.htmlTagNames.includes('slot')) {
        flags |= 4 /* hasSlotRelocation */;
    }
    const members = formatComponentRuntimeMembers(compilerMeta, includeMethods);
    const hostListeners = formatHostListeners(compilerMeta);
    return trimFalsy([flags, compilerMeta.tagName, Object.keys(members).length > 0 ? members : undefined, hostListeners.length > 0 ? hostListeners : undefined]);
};
export const stringifyRuntimeData = (data) => {
    const json = JSON.stringify(data);
    if (json.length > 10000) {
        // JSON metadata is big, JSON.parse() is faster
        // https://twitter.com/mathias/status/1143551692732030979
        return `JSON.parse(${JSON.stringify(json)})`;
    }
    return json;
};
const formatComponentRuntimeMembers = (compilerMeta, includeMethods = true) => {
    return Object.assign(Object.assign(Object.assign({}, formatPropertiesRuntimeMember(compilerMeta.properties)), formatStatesRuntimeMember(compilerMeta.states)), (includeMethods ? formatMethodsRuntimeMember(compilerMeta.methods) : {}));
};
const formatPropertiesRuntimeMember = (properties) => {
    const runtimeMembers = {};
    properties.forEach(member => {
        runtimeMembers[member.name] = trimFalsy([
            /**
             * [0] member type
             */
            formatFlags(member),
            formatAttrName(member),
        ]);
    });
    return runtimeMembers;
};
const formatFlags = (compilerProperty) => {
    let type = formatPropType(compilerProperty.type);
    if (compilerProperty.mutable) {
        type |= 1024 /* Mutable */;
    }
    if (compilerProperty.reflect) {
        type |= 512 /* ReflectAttr */;
    }
    return type;
};
const formatAttrName = (compilerProperty) => {
    if (typeof compilerProperty.attribute === 'string') {
        // string attr name means we should observe this attribute
        if (compilerProperty.name === compilerProperty.attribute) {
            // property name and attribute name are the exact same
            // true value means to use the property name for the attribute name
            return undefined;
        }
        // property name and attribute name are not the same
        // so we need to return the actual string value
        // example: "multiWord" !== "multi-word"
        return compilerProperty.attribute;
    }
    // we shouldn't even observe an attribute for this property
    return undefined;
};
const formatPropType = (type) => {
    if (type === 'string') {
        return 1 /* String */;
    }
    if (type === 'number') {
        return 2 /* Number */;
    }
    if (type === 'boolean') {
        return 4 /* Boolean */;
    }
    if (type === 'any') {
        return 8 /* Any */;
    }
    return 16 /* Unknown */;
};
const formatStatesRuntimeMember = (states) => {
    const runtimeMembers = {};
    states.forEach(member => {
        runtimeMembers[member.name] = [
            32 /* State */,
        ];
    });
    return runtimeMembers;
};
const formatMethodsRuntimeMember = (methods) => {
    const runtimeMembers = {};
    methods.forEach(member => {
        runtimeMembers[member.name] = [
            64 /* Method */,
        ];
    });
    return runtimeMembers;
};
const formatHostListeners = (compilerMeta) => {
    return compilerMeta.listeners.map(compilerListener => {
        const hostListener = [computeListenerFlags(compilerListener), compilerListener.name, compilerListener.method];
        return hostListener;
    });
};
const computeListenerFlags = (listener) => {
    let flags = 0;
    if (listener.capture) {
        flags |= 2 /* Capture */;
    }
    if (listener.passive) {
        flags |= 1 /* Passive */;
    }
    switch (listener.target) {
        case 'document':
            flags |= 4 /* TargetDocument */;
            break;
        case 'window':
            flags |= 8 /* TargetWindow */;
            break;
        case 'parent':
            flags |= 16 /* TargetParent */;
            break;
        case 'body':
            flags |= 32 /* TargetBody */;
            break;
    }
    return flags;
};
const trimFalsy = (data) => {
    const arr = data;
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i]) {
            break;
        }
        // if falsy, safe to pop()
        arr.pop();
    }
    return arr;
};
