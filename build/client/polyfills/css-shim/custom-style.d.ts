import { CssVarShim } from '../../../declarations';
export declare class CustomStyle implements CssVarShim {
    private win;
    private doc;
    private count;
    private hostStyleMap;
    private hostScopeMap;
    private globalScopes;
    private scopesMap;
    private didInit;
    constructor(win: Window, doc: Document);
    i(): Promise<unknown>;
    addLink(linkEl: HTMLLinkElement): Promise<void>;
    addGlobalStyle(styleEl: HTMLStyleElement): void;
    createHostStyle(hostEl: HTMLElement, cssScopeId: string, cssText: string, isScoped: boolean): HTMLStyleElement;
    removeHost(hostEl: HTMLElement): void;
    updateHost(hostEl: HTMLElement): void;
    updateGlobal(): void;
    private registerHostTemplate;
}
