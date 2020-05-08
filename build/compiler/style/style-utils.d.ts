import * as d from '../../declarations';
export declare const getStyleId: (cmp: d.ComponentCompilerMeta, modeName: string, isScopedStyles: boolean) => string;
export declare const escapeCssForJs: (style: string) => string;
export declare const requiresScopedStyles: (encapsulation: "none" | "shadow" | "scoped", commentOriginalSelector: boolean) => boolean;
export declare const PLUGIN_HELPERS: {
    pluginName: string;
    pluginId: string;
    pluginExts: string[];
}[];
export declare const stripCssComments: (input: string) => string;
