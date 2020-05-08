import { addImports } from '../add-imports';
import { addLegacyApis } from '../core-runtime-apis';
import { getComponentMeta, getModuleFromSourceFile } from '../transform-utils';
import { updateLazyComponentClass } from './lazy-component';
import { updateStyleImports } from '../style-imports';
import ts from 'typescript';
export const lazyComponentTransform = (compilerCtx, transformOpts) => {
    return transformCtx => {
        return tsSourceFile => {
            const styleStatements = [];
            const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
            const visitNode = (node) => {
                if (ts.isClassDeclaration(node)) {
                    const cmp = getComponentMeta(compilerCtx, tsSourceFile, node);
                    if (cmp != null) {
                        return updateLazyComponentClass(transformOpts, styleStatements, node, moduleFile, cmp);
                    }
                }
                return ts.visitEachChild(node, visitNode, transformCtx);
            };
            tsSourceFile = ts.visitEachChild(tsSourceFile, visitNode, transformCtx);
            if (moduleFile.cmps.length > 0) {
                tsSourceFile = updateStyleImports(transformOpts, tsSourceFile, moduleFile);
            }
            if (moduleFile.isLegacy) {
                addLegacyApis(moduleFile);
            }
            tsSourceFile = addImports(transformOpts, tsSourceFile, moduleFile.coreRuntimeApis, transformOpts.coreImportPath);
            if (styleStatements.length > 0) {
                tsSourceFile = ts.updateSourceFileNode(tsSourceFile, [...tsSourceFile.statements, ...styleStatements]);
            }
            return tsSourceFile;
        };
    };
};
