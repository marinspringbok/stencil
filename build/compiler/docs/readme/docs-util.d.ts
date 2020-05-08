import * as d from '../../../declarations';
export declare class MarkdownTable {
    private rows;
    addHeader(data: string[]): void;
    addRow(data: string[], isHeader?: boolean): void;
    toMarkdown(): string[];
}
export declare const getEventDetailType: (eventType: d.JsDoc) => string;
export declare const getMemberDocumentation: (jsDoc: d.JsDoc) => string;
export declare const getPlatform: (jsDoc: d.JsDoc) => string;
export declare const getMemberType: (jsDoc: d.JsDoc) => string;
export declare const getMethodParameters: ({ parameters }: d.JsDoc) => d.JsonDocMethodParameter[];
export declare const getMethodReturns: ({ returns }: d.JsDoc) => d.JsonDocsMethodReturn;
