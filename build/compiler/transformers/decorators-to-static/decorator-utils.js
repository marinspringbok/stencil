import { objectLiteralToObjectMap } from '../transform-utils';
import ts from 'typescript';
export const getDeclarationParameters = (decorator) => {
    if (!ts.isCallExpression(decorator.expression)) {
        return [];
    }
    return decorator.expression.arguments.map(getDeclarationParameter);
};
const getDeclarationParameter = (arg) => {
    if (ts.isObjectLiteralExpression(arg)) {
        return objectLiteralToObjectMap(arg);
    }
    else if (ts.isStringLiteral(arg)) {
        return arg.text;
    }
    throw new Error(`invalid decorator argument: ${arg.getText()}`);
};
export const isDecoratorNamed = (propName) => {
    return (dec) => {
        return ts.isCallExpression(dec.expression) && dec.expression.expression.getText() === propName;
    };
};
