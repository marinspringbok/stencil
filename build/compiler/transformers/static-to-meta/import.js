import { addExternalImport } from '../collections/add-external-import';
import { isAbsolute, resolve } from 'path';
import { normalizePath } from '@utils';
import ts from 'typescript';
export const parseModuleImport = (config, compilerCtx, buildCtx, moduleFile, dirPath, importNode) => {
    if (importNode.moduleSpecifier && ts.isStringLiteral(importNode.moduleSpecifier)) {
        let importPath = importNode.moduleSpecifier.text;
        if (!moduleFile.originalImports.includes(importPath)) {
            moduleFile.originalImports.push(importPath);
        }
        if (isAbsolute(importPath)) {
            // absolute import
            importPath = normalizePath(importPath);
            moduleFile.localImports.push(importPath);
        }
        else if (importPath.startsWith('.')) {
            // relative import
            importPath = normalizePath(resolve(dirPath, importPath));
            moduleFile.localImports.push(importPath);
        }
        else {
            // node resolve side effect import
            addExternalImport(config, compilerCtx, buildCtx, moduleFile, moduleFile.sourceFilePath, importPath);
        }
    }
};
