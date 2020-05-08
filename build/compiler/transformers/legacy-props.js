import { GET_CONNECT, GET_CONTEXT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import ts from 'typescript';
export const addLegacyProps = (moduleFile, cmp) => {
    if (cmp.legacyConnect.length > 0) {
        addCoreRuntimeApi(moduleFile, RUNTIME_APIS.getConnect);
    }
    if (cmp.legacyContext.length > 0) {
        addCoreRuntimeApi(moduleFile, RUNTIME_APIS.getContext);
    }
    return [...cmp.legacyConnect.map(c => getStatement(c.name, GET_CONNECT, c.connect)), ...cmp.legacyContext.map(c => getStatement(c.name, GET_CONTEXT, c.context))];
};
const getStatement = (propName, method, arg) => {
    return ts.createExpressionStatement(ts.createAssignment(ts.createPropertyAccess(ts.createThis(), propName), ts.createCall(ts.createIdentifier(method), undefined, [ts.createThis(), ts.createLiteral(arg)])));
};
