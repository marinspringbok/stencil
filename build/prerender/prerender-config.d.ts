import * as d from '../declarations';
export declare function getPrerenderConfig(diagnostics: d.Diagnostic[], prerenderConfigPath: string): d.PrerenderConfig;
export declare function validatePrerenderConfigPath(diagnostics: d.Diagnostic[], prerenderConfigPath: string): void;
export declare function getHydrateOptions(prerenderConfig: d.PrerenderConfig, url: URL, diagnostics: d.Diagnostic[]): d.PrerenderHydrateOptions;
