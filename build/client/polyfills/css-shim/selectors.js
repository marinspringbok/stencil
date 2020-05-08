import { compileTemplate, executeTemplate } from './template';
import { types } from './css-parser';
export function resolveValues(selectors) {
    const props = {};
    selectors.forEach(selector => {
        selector.declarations.forEach(dec => {
            props[dec.prop] = dec.value;
        });
    });
    const propsValues = {};
    const entries = Object.entries(props);
    for (let i = 0; i < 10; i++) {
        let dirty = false;
        entries.forEach(([key, value]) => {
            const propValue = executeTemplate(value, propsValues);
            if (propValue !== propsValues[key]) {
                propsValues[key] = propValue;
                dirty = true;
            }
        });
        if (!dirty) {
            break;
        }
    }
    return propsValues;
}
export function getSelectors(root, index = 0) {
    if (!root.rules) {
        return [];
    }
    const selectors = [];
    root.rules
        .filter(rule => rule.type === types.STYLE_RULE)
        .forEach(rule => {
        const declarations = getDeclarations(rule.cssText);
        if (declarations.length > 0) {
            rule.parsedSelector.split(',').forEach(selector => {
                selector = selector.trim();
                selectors.push({
                    selector: selector,
                    declarations,
                    specificity: computeSpecificity(selector),
                    nu: index,
                });
            });
        }
        index++;
    });
    return selectors;
}
export function computeSpecificity(_selector) {
    return 1;
}
const IMPORTANT = '!important';
const FIND_DECLARATIONS = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gm;
export function getDeclarations(cssText) {
    const declarations = [];
    let xArray;
    while ((xArray = FIND_DECLARATIONS.exec(cssText.trim()))) {
        const { value, important } = normalizeValue(xArray[2]);
        declarations.push({
            prop: xArray[1].trim(),
            value: compileTemplate(value),
            important,
        });
    }
    return declarations;
}
export function normalizeValue(value) {
    const regex = /\s+/gim;
    value = value.replace(regex, ' ').trim();
    const important = value.endsWith(IMPORTANT);
    if (important) {
        value = value.substr(0, value.length - IMPORTANT.length).trim();
    }
    return {
        value,
        important,
    };
}
export function getActiveSelectors(hostEl, hostScopeMap, globalScopes) {
    // computes the css scopes that might affect this particular element
    // avoiding using spread arrays to avoid ts helper fns when in es5
    const scopes = [];
    const scopesForElement = getScopesForElement(hostScopeMap, hostEl);
    // globalScopes are always took into account
    globalScopes.forEach(s => scopes.push(s));
    // the parent scopes are computed by walking parent dom until <html> is reached
    scopesForElement.forEach(s => scopes.push(s));
    // each scope might have an array of associated selectors
    // let's flatten the complete array of selectors from all the scopes
    const selectorSet = getSelectorsForScopes(scopes);
    // we filter to only the selectors that matches the hostEl
    const activeSelectors = selectorSet.filter(selector => matches(hostEl, selector.selector));
    // sort selectors by specifity
    return sortSelectors(activeSelectors);
}
function getScopesForElement(hostTemplateMap, node) {
    const scopes = [];
    while (node) {
        const scope = hostTemplateMap.get(node);
        if (scope) {
            scopes.push(scope);
        }
        node = node.parentElement;
    }
    return scopes;
}
export function getSelectorsForScopes(scopes) {
    const selectors = [];
    scopes.forEach(scope => {
        selectors.push(...scope.selectors);
    });
    return selectors;
}
export function sortSelectors(selectors) {
    selectors.sort((a, b) => {
        if (a.specificity === b.specificity) {
            return a.nu - b.nu;
        }
        return a.specificity - b.specificity;
    });
    return selectors;
}
export function matches(el, selector) {
    return selector === ':root' || selector === 'html' || el.matches(selector);
}
