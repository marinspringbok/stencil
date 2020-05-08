import ts from 'typescript';
export declare const getDeclarationParameters: GetDeclarationParameters;
export declare const isDecoratorNamed: (propName: string) => (dec: ts.Decorator) => boolean;
export interface GetDeclarationParameters {
    <T>(decorator: ts.Decorator): [T];
    <T, T1>(decorator: ts.Decorator): [T, T1];
    <T, T1, T2>(decorator: ts.Decorator): [T, T1, T2];
}
