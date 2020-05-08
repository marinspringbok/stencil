import { CSSScope, CSSSelector, Declaration } from './interfaces';
import { StyleNode } from './css-parser';
export declare function resolveValues(selectors: CSSSelector[]): any;
export declare function getSelectors(root: StyleNode, index?: number): CSSSelector[];
export declare function computeSpecificity(_selector: string): number;
export declare function getDeclarations(cssText: string): Declaration[];
export declare function normalizeValue(value: string): {
    value: string;
    important: boolean;
};
export declare function getActiveSelectors(hostEl: HTMLElement, hostScopeMap: WeakMap<HTMLElement, CSSScope>, globalScopes: CSSScope[]): CSSSelector[];
export declare function getSelectorsForScopes(scopes: CSSScope[]): CSSSelector[];
export declare function sortSelectors(selectors: CSSSelector[]): CSSSelector[];
export declare function matches(el: HTMLElement, selector: string): boolean;
