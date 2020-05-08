import * as d from '../declarations';
export declare function inlineExternalStyleSheets(appDir: string, doc: Document): Promise<void[]>;
export declare function minifyScriptElements(doc: Document): Promise<void[]>;
export declare function minifyStyleElements(doc: Document): Promise<void>;
export declare function addModulePreloads(doc: Document, hydrateResults: d.HydrateResults, componentGraph: Map<string, string[]>): boolean;
