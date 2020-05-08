export declare type CSSVariables = {
    [prop: string]: string;
};
export declare type CSSEval = (p: CSSVariables) => string;
export declare type CSSSegment = string | CSSEval;
export declare type CSSTemplate = CSSSegment[];
export interface CSSSelector {
    nu: number;
    selector: string;
    specificity: number;
    declarations: Declaration[];
}
export interface Declaration {
    prop: string;
    value: CSSTemplate;
    important: boolean;
}
export interface CSSScope {
    original: string;
    scopeId?: string;
    isScoped?: boolean;
    selectors: CSSSelector[];
    template: CSSTemplate;
    usesCssVars: boolean;
    styleEl?: HTMLStyleElement;
}
