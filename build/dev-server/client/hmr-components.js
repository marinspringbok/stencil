import { setHmrAttr, hasShadowRoot } from './hmr-util';
export const hmrComponents = (elm, versionId, hmrTagNames) => {
    const updatedTags = [];
    hmrTagNames.forEach(hmrTagName => {
        hmrComponent(updatedTags, elm, versionId, hmrTagName);
    });
    return updatedTags.sort();
};
const hmrComponent = (updatedTags, elm, versionId, cmpTagName) => {
    // drill down through every node in the page
    // to include shadow roots and look for this
    // component tag to run hmr() on
    if (elm.nodeName.toLowerCase() === cmpTagName && typeof elm['s-hmr'] === 'function') {
        elm['s-hmr'](versionId);
        setHmrAttr(elm, versionId);
        if (updatedTags.indexOf(cmpTagName) === -1) {
            updatedTags.push(cmpTagName);
        }
    }
    if (hasShadowRoot(elm)) {
        hmrComponent(updatedTags, elm.shadowRoot, versionId, cmpTagName);
    }
    if (elm.children) {
        for (let i = 0; i < elm.children.length; i++) {
            hmrComponent(updatedTags, elm.children[i], versionId, cmpTagName);
        }
    }
};
