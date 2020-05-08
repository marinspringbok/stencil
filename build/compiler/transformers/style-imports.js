import { serializeImportPath } from './stencil-import-path';
import ts from 'typescript';
export const updateStyleImports = (transformOpts, tsSourceFile, moduleFile) => {
    // add style imports built from @Component() styleUrl option
    if (transformOpts.module === 'cjs') {
        return updateCjsStyleRequires(tsSourceFile, moduleFile);
    }
    return updateEsmStyleImports(tsSourceFile, moduleFile);
};
const updateEsmStyleImports = (tsSourceFile, moduleFile) => {
    const styleImports = [];
    let statements = tsSourceFile.statements.slice();
    let updateSourceFile = false;
    moduleFile.cmps.forEach(cmp => {
        cmp.styles.forEach(style => {
            if (typeof style.styleIdentifier === 'string') {
                updateSourceFile = true;
                if (style.externalStyles.length > 0) {
                    // add style imports built from @Component() styleUrl option
                    styleImports.push(createEsmStyleImport(tsSourceFile, cmp, style));
                }
                else {
                    // update existing esm import of a style identifier
                    statements = updateEsmStyleImportPath(tsSourceFile, statements, cmp, style);
                }
            }
        });
    });
    if (updateSourceFile) {
        let lastImportIndex = -1;
        for (let i = 0; i < statements.length; i++) {
            if (ts.isImportDeclaration(statements[i])) {
                lastImportIndex = i;
            }
        }
        statements.splice(lastImportIndex + 1, 0, ...styleImports);
        return ts.updateSourceFileNode(tsSourceFile, statements);
    }
    return tsSourceFile;
};
const updateEsmStyleImportPath = (tsSourceFile, statements, cmp, style) => {
    for (let i = 0; i < statements.length; i++) {
        const n = statements[i];
        if (ts.isImportDeclaration(n) && n.importClause && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
            if (n.importClause.name && n.importClause.name.escapedText === style.styleIdentifier) {
                const orgImportPath = n.moduleSpecifier.text;
                const importPath = getStyleImportPath(tsSourceFile, cmp, style, orgImportPath);
                statements[i] = ts.updateImportDeclaration(n, n.decorators, n.modifiers, n.importClause, ts.createStringLiteral(importPath));
                break;
            }
        }
    }
    return statements;
};
const createEsmStyleImport = (tsSourceFile, cmp, style) => {
    const importName = ts.createIdentifier(style.styleIdentifier);
    const importPath = getStyleImportPath(tsSourceFile, cmp, style, style.externalStyles[0].absolutePath);
    return ts.createImportDeclaration(undefined, undefined, ts.createImportClause(importName, undefined), ts.createLiteral(importPath));
};
const updateCjsStyleRequires = (tsSourceFile, moduleFile) => {
    const styleRequires = [];
    moduleFile.cmps.forEach(cmp => {
        cmp.styles.forEach(style => {
            if (typeof style.styleIdentifier === 'string' && style.externalStyles.length > 0) {
                // add style imports built from @Component() styleUrl option
                styleRequires.push(createCjsStyleRequire(tsSourceFile, cmp, style));
            }
        });
    });
    if (styleRequires.length > 0) {
        return ts.updateSourceFileNode(tsSourceFile, [...styleRequires, ...tsSourceFile.statements]);
    }
    return tsSourceFile;
};
const createCjsStyleRequire = (tsSourceFile, cmp, style) => {
    const importName = ts.createIdentifier(style.styleIdentifier);
    const importPath = getStyleImportPath(tsSourceFile, cmp, style, style.externalStyles[0].absolutePath);
    return ts.createVariableStatement(undefined, ts.createVariableDeclarationList([ts.createVariableDeclaration(importName, undefined, ts.createCall(ts.createIdentifier('require'), [], [ts.createLiteral(importPath)]))], ts.NodeFlags.Const));
};
const getStyleImportPath = (tsSourceFile, cmp, style, importPath) => {
    const importData = {
        importeePath: importPath,
        importerPath: tsSourceFile.fileName,
        tag: cmp.tagName,
        encapsulation: cmp.encapsulation,
        mode: style.modeName,
    };
    return serializeImportPath(importData);
};
