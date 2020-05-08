/** @unrestricted */
export declare class StyleNode {
    start: number;
    end: number;
    previous: StyleNode | null;
    parent: StyleNode | null;
    rules: StyleNode[] | null;
    parsedCssText: string;
    cssText: string;
    atRule: boolean;
    type: number;
    keyframesName: string | undefined;
    selector: string;
    parsedSelector: string;
}
/**
 * @param {string} text
 * @return {StyleNode}
 */
export declare function parse(text: string): StyleNode;
/**
 * stringify parsed css.
 * @param {StyleNode} node
 * @param {boolean=} preserveProperties
 * @param {string=} text
 * @return {string}
 */
export declare function stringify(node: StyleNode, preserveProperties: any, text?: string): string;
/**
 * @param {string} cssText
 * @return {string}
 */
export declare function removeCustomPropAssignment(cssText: string): string;
/** @enum {number} */
export declare const types: {
    STYLE_RULE: number;
    KEYFRAMES_RULE: number;
    MEDIA_RULE: number;
    MIXIN_RULE: number;
};
