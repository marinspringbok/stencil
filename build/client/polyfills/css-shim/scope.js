import { parse } from './css-parser';
import { getSelectors, getSelectorsForScopes, resolveValues } from './selectors';
import { compileTemplate, executeTemplate } from './template';
export function parseCSS(original) {
    const ast = parse(original);
    const template = compileTemplate(original);
    const selectors = getSelectors(ast);
    return {
        original,
        template,
        selectors,
        usesCssVars: template.length > 1,
    };
}
export function addGlobalStyle(globalScopes, styleEl) {
    if (globalScopes.some(css => css.styleEl === styleEl)) {
        return false;
    }
    const css = parseCSS(styleEl.textContent);
    css.styleEl = styleEl;
    globalScopes.push(css);
    return true;
}
export function updateGlobalScopes(scopes) {
    const selectors = getSelectorsForScopes(scopes);
    const props = resolveValues(selectors);
    scopes.forEach(scope => {
        if (scope.usesCssVars) {
            scope.styleEl.textContent = executeTemplate(scope.template, props);
        }
    });
}
export function reScope(scope, scopeId) {
    const template = scope.template.map(segment => {
        return typeof segment === 'string' ? replaceScope(segment, scope.scopeId, scopeId) : segment;
    });
    const selectors = scope.selectors.map(sel => {
        return Object.assign(Object.assign({}, sel), { selector: replaceScope(sel.selector, scope.scopeId, scopeId) });
    });
    return Object.assign(Object.assign({}, scope), { template,
        selectors,
        scopeId });
}
export function replaceScope(original, oldScopeId, newScopeId) {
    original = replaceAll(original, `\\.${oldScopeId}`, `.${newScopeId}`);
    return original;
}
export function replaceAll(input, find, replace) {
    return input.replace(new RegExp(find, 'g'), replace);
}
