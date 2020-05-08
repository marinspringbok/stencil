import { CSSScope } from './interfaces';
export declare function parseCSS(original: string): CSSScope;
export declare function addGlobalStyle(globalScopes: CSSScope[], styleEl: HTMLStyleElement): boolean;
export declare function updateGlobalScopes(scopes: CSSScope[]): void;
export declare function reScope(scope: CSSScope, scopeId: string): CSSScope;
export declare function replaceScope(original: string, oldScopeId: string, newScopeId: string): string;
export declare function replaceAll(input: string, find: string, replace: string): string;
