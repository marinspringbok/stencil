import { CSSScope } from './interfaces';
export declare function loadDocument(doc: Document, globalScopes: CSSScope[]): Promise<void>;
export declare function startWatcher(doc: Document, globalScopes: CSSScope[]): void;
export declare function loadDocumentLinks(doc: Document, globalScopes: CSSScope[]): Promise<any[]>;
export declare function loadDocumentStyles(doc: Document, globalScopes: CSSScope[]): boolean;
export declare function addGlobalLink(doc: Document, globalScopes: CSSScope[], linkElm: HTMLLinkElement): Promise<void>;
export declare function hasCssVariables(css: string): boolean;
export declare function hasRelativeUrls(css: string): boolean;
export declare function fixRelativeUrls(css: string, originalUrl: string): string;
