import { createModule, getModule } from '../../transpile/transpiled-module';
import { dirname, basename, join } from 'path';
import { normalizePath } from '@utils';
import { parseCallExpression } from './call-expression';
import { parseModuleImport } from './import';
import { parseStaticComponentMeta } from './component';
import { parseStringLiteral } from './string-literal';
import ts from 'typescript';
export const updateModule = (config, compilerCtx, buildCtx, tsSourceFile, sourceFileText, emitFilePath, typeChecker, collection) => {
    const sourceFilePath = normalizePath(tsSourceFile.fileName);
    const prevModuleFile = getModule(compilerCtx, sourceFilePath);
    if (prevModuleFile && prevModuleFile.staticSourceFileText === sourceFileText) {
        return prevModuleFile;
    }
    const srcDirPath = dirname(sourceFilePath);
    const emitFileName = basename(emitFilePath);
    emitFilePath = normalizePath(join(srcDirPath, emitFileName));
    const moduleFile = createModule(tsSourceFile, sourceFileText, emitFilePath);
    const moduleFileKey = normalizePath(moduleFile.sourceFilePath);
    compilerCtx.moduleMap.set(moduleFileKey, moduleFile);
    compilerCtx.changedModules.add(moduleFile.sourceFilePath);
    const visitNode = (node) => {
        if (ts.isClassDeclaration(node)) {
            parseStaticComponentMeta(compilerCtx, typeChecker, node, moduleFile, compilerCtx.nodeMap);
            return;
        }
        else if (ts.isImportDeclaration(node)) {
            parseModuleImport(config, compilerCtx, buildCtx, moduleFile, srcDirPath, node);
            return;
        }
        else if (ts.isCallExpression(node)) {
            parseCallExpression(moduleFile, node);
        }
        else if (ts.isStringLiteral(node)) {
            parseStringLiteral(moduleFile, node);
        }
        node.forEachChild(visitNode);
    };
    if (collection != null) {
        moduleFile.isCollectionDependency = true;
        moduleFile.collectionName = collection.collectionName;
        collection.moduleFiles.push(moduleFile);
    }
    visitNode(tsSourceFile);
    // TODO: workaround around const enums
    // find better way
    if (moduleFile.cmps.length > 0) {
        moduleFile.staticSourceFile = ts.createSourceFile(sourceFilePath, sourceFileText, tsSourceFile.languageVersion, true, ts.ScriptKind.JS);
    }
    return moduleFile;
};
