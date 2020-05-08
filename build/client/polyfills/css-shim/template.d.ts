import { CSSTemplate, CSSVariables } from './interfaces';
export declare function resolveVar(props: CSSVariables, prop: string, fallback: CSSTemplate | undefined): string;
export declare function findVarEndIndex(cssText: string, offset: number): number;
export declare function parseVar(cssText: string, offset: number): {
    start: number;
    end: number;
    propName: string;
    fallback: string;
};
export declare function compileVar(cssText: string, template: CSSTemplate, offset: number): number;
export declare function executeTemplate(template: CSSTemplate, props: CSSVariables): string;
export declare function findEndValue(cssText: string, offset: number): number;
export declare function removeCustomAssigns(cssText: string): string;
export declare function compileTemplate(cssText: string): CSSTemplate;
