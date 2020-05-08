import { getModuleLegacy } from '../../build/compiler-ctx';
import { dirname, join, relative } from 'path';
import { normalizePath } from '@utils';
import { setComponentBuildConditionals } from '../component-build-conditionals';
export const parseComponentsDeprecated = (config, compilerCtx, collection, collectionDir, collectionManifest) => {
    if (collectionManifest.components) {
        collectionManifest.components.forEach(cmpData => {
            parseComponentDeprecated(config, compilerCtx, collection, collectionDir, cmpData);
        });
    }
};
function parseComponentDeprecated(config, compilerCtx, collection, collectionDir, cmpData) {
    const sourceFilePath = normalizePath(join(collectionDir, cmpData.componentPath));
    const moduleFile = getModuleLegacy(config, compilerCtx, sourceFilePath);
    moduleFile.isCollectionDependency = true;
    moduleFile.isLegacy = true;
    moduleFile.collectionName = collection.collectionName;
    moduleFile.excludeFromCollection = excludeFromCollection(config, cmpData);
    moduleFile.originalCollectionComponentPath = cmpData.componentPath;
    moduleFile.jsFilePath = parseJsFilePath(collectionDir, cmpData);
    const cmpMeta = {
        isLegacy: moduleFile.isLegacy,
        excludeFromCollection: moduleFile.excludeFromCollection,
        isCollectionDependency: moduleFile.isCollectionDependency,
        tagName: parseTag(cmpData),
        componentClassName: parseComponentClass(cmpData),
        virtualProperties: [],
        docs: {
            text: '',
            tags: [],
        },
        internal: false,
        jsFilePath: moduleFile.jsFilePath,
        sourceFilePath: '',
        styleDocs: [],
        assetsDirs: parseAssetsDir(collectionDir, cmpData),
        styles: parseStyles(collectionDir, cmpData),
        properties: parseProps(cmpData),
        states: parseStates(cmpData),
        listeners: parseListeners(cmpData),
        methods: parseMethods(cmpData),
        elementRef: parseHostElementMember(cmpData),
        events: parseEvents(cmpData),
        encapsulation: parseEncapsulation(cmpData),
        shadowDelegatesFocus: null,
        watchers: parseWatchers(cmpData),
        legacyConnect: parseConnectProps(cmpData),
        legacyContext: parseContextProps(cmpData),
        hasAttributeChangedCallbackFn: false,
        hasComponentWillLoadFn: true,
        hasComponentDidLoadFn: true,
        hasComponentShouldUpdateFn: true,
        hasComponentWillUpdateFn: true,
        hasComponentDidUpdateFn: true,
        hasComponentWillRenderFn: false,
        hasComponentDidRenderFn: false,
        hasComponentDidUnloadFn: true,
        hasConnectedCallbackFn: false,
        hasDisconnectedCallbackFn: false,
        hasElement: false,
        hasEvent: false,
        hasLifecycle: false,
        hasListener: false,
        hasListenerTarget: false,
        hasListenerTargetWindow: false,
        hasListenerTargetDocument: false,
        hasListenerTargetBody: false,
        hasListenerTargetParent: false,
        hasMember: false,
        hasMethod: false,
        hasMode: false,
        hasAttribute: false,
        hasProp: false,
        hasPropNumber: false,
        hasPropBoolean: false,
        hasPropString: false,
        hasPropMutable: false,
        hasReflect: false,
        hasRenderFn: false,
        hasState: false,
        hasStyle: false,
        hasVdomAttribute: true,
        hasVdomClass: true,
        hasVdomFunctional: true,
        hasVdomKey: true,
        hasVdomListener: true,
        hasVdomPropOrAttr: true,
        hasVdomRef: true,
        hasVdomRender: false,
        hasVdomStyle: true,
        hasVdomText: true,
        hasVdomXlink: true,
        hasWatchCallback: false,
        isPlain: false,
        htmlAttrNames: [],
        htmlTagNames: [],
        isUpdateable: false,
        potentialCmpRefs: [],
    };
    setComponentBuildConditionals(cmpMeta);
    moduleFile.cmps = [cmpMeta];
    // parseComponentDependencies(cmpData, cmpMeta);
    // parseContextMember(cmpData, cmpMeta);
    // parseConnectMember(cmpData, cmpMeta);
    collection.moduleFiles.push(moduleFile);
}
function excludeFromCollection(config, cmpData) {
    // this is a component from a collection dependency
    // however, this project may also become a collection
    // for example, "ionicons" is a dependency of "ionic"
    // and "ionic" is it's own stand-alone collection, so within
    // ionic's collection we want ionicons to just work
    // cmpData is a component from a collection dependency
    // if this component is listed in this config's bundles
    // then we'll need to ensure it also becomes apart of this collection
    const isInBundle = config.bundles &&
        config.bundles.some(bundle => {
            return bundle.components && bundle.components.some(tag => tag === cmpData.tag);
        });
    // if it's not in the config bundle then it's safe to exclude
    // this component from going into this build's collection
    return !isInBundle;
}
function parseTag(cmpData) {
    return cmpData.tag;
}
function parseJsFilePath(collectionDir, cmpData) {
    // convert the path that's relative to the collection file
    // into an absolute path to the component's js file path
    if (typeof cmpData.componentPath !== 'string') {
        throw new Error(`parseModuleJsFilePath, "componentPath" missing on cmpData: ${cmpData.tag}`);
    }
    return normalizePath(join(collectionDir, cmpData.componentPath));
}
// function parseComponentDependencies(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpData.dependencies)) {
//     cmpMeta.dependencies = [];
//   } else {
//     cmpMeta.dependencies = cmpData.dependencies.sort();
//   }
// }
function parseComponentClass(cmpData) {
    return cmpData.componentClass;
}
function parseStyles(collectionDir, cmpData) {
    const stylesData = cmpData.styles;
    if (stylesData) {
        const modeNames = Object.keys(stylesData);
        return modeNames.map(modeName => {
            return parseStyle(collectionDir, cmpData, stylesData[modeName], modeName.toLowerCase());
        });
    }
    else {
        return [];
    }
}
function parseAssetsDir(collectionDir, cmpData) {
    if (invalidArrayData(cmpData.assetPaths)) {
        return [];
    }
    return cmpData.assetPaths
        .map(assetsPath => {
        const assetsMeta = {
            absolutePath: normalizePath(join(collectionDir, assetsPath)),
            cmpRelativePath: normalizePath(relative(dirname(cmpData.componentPath), assetsPath)),
            originalComponentPath: normalizePath(assetsPath),
        };
        return assetsMeta;
    })
        .sort((a, b) => {
        if (a.cmpRelativePath < b.cmpRelativePath)
            return -1;
        if (a.cmpRelativePath > b.cmpRelativePath)
            return 1;
        return 0;
    });
}
function parseStyle(collectionDir, cmpData, modeStyleData, modeName) {
    const modeStyle = {
        modeName: modeName,
        styleId: cmpData.tag,
        styleStr: modeStyleData.style,
        styleIdentifier: null,
        externalStyles: [],
        compiledStyleText: null,
        compiledStyleTextScoped: null,
        compiledStyleTextScopedCommented: null,
    };
    if (Array.isArray(modeStyleData.stylePaths)) {
        modeStyleData.stylePaths.forEach(stylePath => {
            const externalStyle = {
                absolutePath: normalizePath(join(collectionDir, stylePath)),
                relativePath: normalizePath(relative(dirname(cmpData.componentPath), stylePath)),
                originalComponentPath: stylePath,
            };
            modeStyle.externalStyles.push(externalStyle);
        });
    }
    return modeStyle;
}
function parseProps(cmpData) {
    const propsData = cmpData.props;
    if (invalidArrayData(propsData)) {
        return [];
    }
    return propsData.map(propData => {
        const type = convertType(propData.type);
        const prop = {
            name: propData.name,
            attribute: typeof propData.attr === 'string' ? propData.attr : null,
            mutable: !!propData.mutable,
            optional: true,
            required: false,
            reflect: !!propData.reflectToAttr,
            type,
            internal: false,
            complexType: {
                original: type === 'unknown' ? 'any' : type,
                resolved: type,
                references: {},
            },
            docs: {
                text: '',
                tags: [],
            },
        };
        return prop;
    });
}
function parseConnectProps(cmpData) {
    const connectData = cmpData.connect;
    if (invalidArrayData(connectData)) {
        return [];
    }
    return connectData.map(propData => {
        const prop = {
            name: propData.name,
            connect: propData.tag,
        };
        return prop;
    });
}
function parseContextProps(cmpData) {
    const contextData = cmpData.context;
    if (invalidArrayData(contextData)) {
        return [];
    }
    return contextData.map(propData => {
        return {
            name: propData.name,
            context: propData.id,
        };
    });
}
function parseStates(cmpData) {
    if (invalidArrayData(cmpData.states)) {
        return [];
    }
    return cmpData.states.map(state => {
        return {
            name: state.name,
        };
    });
}
function parseWatchers(cmpData) {
    if (invalidArrayData(cmpData.props)) {
        return [];
    }
    const watchers = [];
    cmpData.props
        .filter(prop => prop.watch && prop.watch.length > 0)
        .forEach(prop => {
        prop.watch.forEach(watch => {
            watchers.push({
                propName: prop.name,
                methodName: watch,
            });
        });
    });
    return watchers;
}
function parseListeners(cmpData) {
    const listenersData = cmpData.listeners;
    if (invalidArrayData(listenersData)) {
        return [];
    }
    return listenersData.map(listenerData => {
        const listener = {
            name: listenerData.event,
            method: listenerData.method,
            target: undefined,
            passive: listenerData.passive !== false,
            capture: listenerData.capture !== false,
        };
        return listener;
    });
}
function parseMethods(cmpData) {
    if (invalidArrayData(cmpData.methods)) {
        return [];
    }
    return cmpData.methods.map(methodData => {
        const method = {
            name: methodData.name,
            internal: false,
            complexType: {
                signature: '(...args: any[]) => Promise<any>',
                parameters: [],
                return: 'Promise<any>',
                references: {},
            },
            docs: {
                text: '',
                tags: [],
            },
        };
        return method;
    });
}
function convertType(type) {
    switch (type) {
        case 'String':
            return 'string';
        case 'Any':
            return 'any';
        case 'Number':
            return 'number';
        case 'Boolean':
            return 'boolean';
        default:
            return 'unknown';
    }
}
// function parseContextMember(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpData.context)) {
//     return;
//   }
//   cmpData.context.forEach(methodData => {
//     if (methodData.id) {
//       cmpMeta.membersMeta = cmpMeta.membersMeta || {};
//       cmpMeta.membersMeta[methodData.name] = {
//         memberType: MEMBER_FLAGS.PropContext,
//         ctrlId: methodData.id
//       };
//     }
//   });
// }
// function parseConnectMember(cmpData: d.ComponentDataDeprecated, cmpMeta: d.ComponentCompilerMeta) {
//   if (invalidArrayData(cmpData.connect)) {
//     return;
//   }
//   cmpData.connect.forEach(methodData => {
//     if (methodData.tag) {
//       cmpMeta.membersMeta = cmpMeta.membersMeta || {};
//       cmpMeta.membersMeta[methodData.name] = {
//         memberType: MEMBER_FLAGS.PropConnect,
//         ctrlId: methodData.tag
//       };
//     }
//   });
// }
function parseHostElementMember(cmpData) {
    if (!cmpData.hostElement) {
        return undefined;
    }
    return cmpData.hostElement.name;
}
function parseEvents(cmpData) {
    const eventsData = cmpData.events;
    if (invalidArrayData(eventsData)) {
        return [];
    }
    return eventsData.map(eventData => {
        const event = {
            name: eventData.event,
            method: eventData.method ? eventData.method : eventData.event,
            bubbles: eventData.bubbles !== false,
            cancelable: eventData.cancelable !== false,
            composed: eventData.composed !== false,
            internal: false,
            docs: {
                text: '',
                tags: [],
            },
            complexType: {
                original: 'any',
                resolved: 'any',
                references: {},
            },
        };
        return event;
    });
}
function parseEncapsulation(cmpData) {
    if (cmpData.shadow === true) {
        return 'shadow';
    }
    else if (cmpData.scoped === true) {
        return 'scoped';
    }
    else {
        return 'none';
    }
}
function invalidArrayData(arr) {
    return !arr || !Array.isArray(arr) || arr.length === 0;
}
