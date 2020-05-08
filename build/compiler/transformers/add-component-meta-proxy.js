import { convertValueToLiteral } from './transform-utils';
import { formatComponentRuntimeMeta } from '@utils';
import { PROXY_CUSTOM_ELEMENT, RUNTIME_APIS, addCoreRuntimeApi } from './core-runtime-apis';
import ts from 'typescript';
export const addModuleMetadataProxies = (tsSourceFile, moduleFile) => {
    const statements = tsSourceFile.statements.slice();
    addCoreRuntimeApi(moduleFile, RUNTIME_APIS.proxyCustomElement);
    statements.push(...moduleFile.cmps.map(addComponentMetadataProxy));
    return ts.updateSourceFileNode(tsSourceFile, statements);
};
const addComponentMetadataProxy = (compilerMeta) => {
    const compactMeta = formatComponentRuntimeMeta(compilerMeta, true);
    const liternalCmpClassName = ts.createIdentifier(compilerMeta.componentClassName);
    const liternalMeta = convertValueToLiteral(compactMeta);
    return ts.createStatement(ts.createCall(ts.createIdentifier(PROXY_CUSTOM_ELEMENT), [], [liternalCmpClassName, liternalMeta]));
};
