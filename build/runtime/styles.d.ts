import * as d from '../declarations';
export declare const registerStyle: (scopeId: string, cssText: string, allowCS: boolean) => void;
export declare const addStyle: (styleContainerNode: any, cmpMeta: d.ComponentRuntimeMeta, mode?: string, hostElm?: HTMLElement) => string;
export declare const attachStyles: (hostRef: d.HostRef) => void;
export declare const getScopeId: (tagName: string, mode?: string) => string;
export declare const convertScopedToShadow: (css: string) => string;
declare global {
    export interface CSSStyleSheet {
        replaceSync(cssText: string): void;
        replace(cssText: string): Promise<CSSStyleSheet>;
    }
}
