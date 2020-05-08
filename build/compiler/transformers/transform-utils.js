import { augmentDiagnosticWithNode, buildError, normalizePath } from '@utils';
import { MEMBER_DECORATORS_TO_REMOVE } from './decorators-to-static/decorators-constants';
import ts from 'typescript';
export const getScriptTarget = () => {
    // using a fn so the browser compiler doesn't require the global ts for startup
    return ts.ScriptTarget.ES2017;
};
export const isMemberPrivate = (member) => {
    if (member.modifiers && member.modifiers.some(m => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword)) {
        return true;
    }
    return false;
};
export const convertValueToLiteral = (val, refs = null) => {
    if (refs == null) {
        refs = new WeakSet();
    }
    if (val === String) {
        return ts.createIdentifier('String');
    }
    if (val === Number) {
        return ts.createIdentifier('Number');
    }
    if (val === Boolean) {
        return ts.createIdentifier('Boolean');
    }
    if (val === undefined) {
        return ts.createIdentifier('undefined');
    }
    if (val === null) {
        return ts.createIdentifier('null');
    }
    if (Array.isArray(val)) {
        return arrayToArrayLiteral(val, refs);
    }
    if (typeof val === 'object') {
        if (val.__identifier && val.__escapedText) {
            return ts.createIdentifier(val.__escapedText);
        }
        return objectToObjectLiteral(val, refs);
    }
    return ts.createLiteral(val);
};
const arrayToArrayLiteral = (list, refs) => {
    const newList = list.map(l => {
        return convertValueToLiteral(l, refs);
    });
    return ts.createArrayLiteral(newList);
};
const objectToObjectLiteral = (obj, refs) => {
    if (refs.has(obj)) {
        return ts.createIdentifier('undefined');
    }
    refs.add(obj);
    const newProperties = Object.keys(obj).map(key => {
        const prop = ts.createPropertyAssignment(ts.createLiteral(key), convertValueToLiteral(obj[key], refs));
        return prop;
    });
    return ts.createObjectLiteral(newProperties, true);
};
export const createStaticGetter = (propName, returnExpression) => {
    return ts.createGetAccessor(undefined, [ts.createToken(ts.SyntaxKind.StaticKeyword)], propName, undefined, undefined, ts.createBlock([ts.createReturn(returnExpression)]));
};
export const removeDecorators = (node, decoratorNames) => {
    if (node.decorators) {
        const updatedDecoratorList = node.decorators.filter(dec => {
            const name = ts.isCallExpression(dec.expression) && ts.isIdentifier(dec.expression.expression) && dec.expression.expression.text;
            return !decoratorNames.has(name);
        });
        if (updatedDecoratorList.length === 0) {
            return undefined;
        }
        else if (updatedDecoratorList.length !== node.decorators.length) {
            return ts.createNodeArray(updatedDecoratorList);
        }
    }
    return node.decorators;
};
export const getStaticValue = (staticMembers, staticName) => {
    const staticMember = staticMembers.find(member => member.name.escapedText === staticName);
    if (!staticMember || !staticMember.body || !staticMember.body.statements) {
        return null;
    }
    const rtnStatement = staticMember.body.statements.find(s => s.kind === ts.SyntaxKind.ReturnStatement);
    if (!rtnStatement || !rtnStatement.expression) {
        return null;
    }
    const expKind = rtnStatement.expression.kind;
    if (expKind === ts.SyntaxKind.StringLiteral) {
        return rtnStatement.expression.text;
    }
    if (expKind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
        return rtnStatement.expression.text;
    }
    if (expKind === ts.SyntaxKind.TrueKeyword) {
        return true;
    }
    if (expKind === ts.SyntaxKind.FalseKeyword) {
        return false;
    }
    if (expKind === ts.SyntaxKind.ObjectLiteralExpression) {
        return objectLiteralToObjectMap(rtnStatement.expression);
    }
    if (expKind === ts.SyntaxKind.ArrayLiteralExpression && rtnStatement.expression.elements) {
        return arrayLiteralToArray(rtnStatement.expression);
    }
    if (expKind === ts.SyntaxKind.Identifier) {
        const identifier = rtnStatement.expression;
        if (typeof identifier.escapedText === 'string') {
            return getIdentifierValue(identifier.escapedText);
        }
        if (identifier.escapedText) {
            const obj = {};
            Object.keys(identifier.escapedText).forEach(key => {
                obj[key] = getIdentifierValue(identifier.escapedText[key]);
            });
            return obj;
        }
    }
    return null;
};
export const arrayLiteralToArray = (arr) => {
    return arr.elements.map(element => {
        let val;
        switch (element.kind) {
            case ts.SyntaxKind.ObjectLiteralExpression:
                val = objectLiteralToObjectMap(element);
                break;
            case ts.SyntaxKind.StringLiteral:
                val = element.text;
                break;
            case ts.SyntaxKind.TrueKeyword:
                val = true;
                break;
            case ts.SyntaxKind.FalseKeyword:
                val = false;
                break;
            case ts.SyntaxKind.Identifier:
                const escapedText = element.escapedText;
                if (escapedText === 'String') {
                    val = String;
                }
                else if (escapedText === 'Number') {
                    val = Number;
                }
                else if (escapedText === 'Boolean') {
                    val = Boolean;
                }
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
            default:
                val = element;
        }
        return val;
    });
};
export const objectLiteralToObjectMap = (objectLiteral) => {
    const attrs = objectLiteral.properties;
    return attrs.reduce((final, attr) => {
        const attrName = getTextOfPropertyName(attr.name);
        let val;
        switch (attr.initializer.kind) {
            case ts.SyntaxKind.ArrayLiteralExpression:
                val = arrayLiteralToArray(attr.initializer);
                break;
            case ts.SyntaxKind.ObjectLiteralExpression:
                val = objectLiteralToObjectMap(attr.initializer);
                break;
            case ts.SyntaxKind.StringLiteral:
                val = attr.initializer.text;
                break;
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                val = attr.initializer.text;
                break;
            case ts.SyntaxKind.TrueKeyword:
                val = true;
                break;
            case ts.SyntaxKind.FalseKeyword:
                val = false;
                break;
            case ts.SyntaxKind.Identifier:
                const escapedText = attr.initializer.escapedText;
                if (escapedText === 'String') {
                    val = String;
                }
                else if (escapedText === 'Number') {
                    val = Number;
                }
                else if (escapedText === 'Boolean') {
                    val = Boolean;
                }
                else if (escapedText === 'undefined') {
                    val = undefined;
                }
                else if (escapedText === 'null') {
                    val = null;
                }
                else {
                    val = getIdentifierValue(attr.initializer.escapedText);
                }
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
            default:
                val = attr.initializer;
        }
        final[attrName] = val;
        return final;
    }, {});
};
const getIdentifierValue = (escapedText) => {
    const identifier = {
        __identifier: true,
        __escapedText: escapedText,
    };
    return identifier;
};
const getTextOfPropertyName = (propName) => {
    switch (propName.kind) {
        case ts.SyntaxKind.Identifier:
            return propName.text;
        case ts.SyntaxKind.StringLiteral:
        case ts.SyntaxKind.NumericLiteral:
            return propName.text;
        case ts.SyntaxKind.ComputedPropertyName:
            const expression = propName.expression;
            if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) {
                return propName.expression.text;
            }
    }
    return undefined;
};
export class ObjectMap {
}
export const getAttributeTypeInfo = (baseNode, sourceFile) => {
    const allReferences = {};
    getAllTypeReferences(baseNode).forEach(rt => {
        allReferences[rt] = getTypeReferenceLocation(rt, sourceFile);
    });
    return allReferences;
};
const getEntityName = (entity) => {
    if (ts.isIdentifier(entity)) {
        return entity.escapedText.toString();
    }
    else {
        return getEntityName(entity.left);
    }
};
const getAllTypeReferences = (node) => {
    const referencedTypes = [];
    const visit = (node) => {
        if (ts.isTypeReferenceNode(node)) {
            referencedTypes.push(getEntityName(node.typeName));
            if (node.typeArguments) {
                node.typeArguments
                    .filter(ta => ts.isTypeReferenceNode(ta))
                    .forEach((tr) => {
                    const typeName = tr.typeName;
                    referencedTypes.push(typeName.escapedText.toString());
                });
            }
        }
        return ts.forEachChild(node, visit);
    };
    visit(node);
    return referencedTypes;
};
export const validateReferences = (diagnostics, references, node) => {
    Object.keys(references).forEach(refName => {
        const ref = references[refName];
        if (ref.path === '@stencil/core' && MEMBER_DECORATORS_TO_REMOVE.has(refName)) {
            const err = buildError(diagnostics);
            augmentDiagnosticWithNode(err, node);
        }
    });
};
const getTypeReferenceLocation = (typeName, tsNode) => {
    const sourceFileObj = tsNode.getSourceFile();
    // Loop through all top level imports to find any reference to the type for 'import' reference location
    const importTypeDeclaration = sourceFileObj.statements.find(st => {
        const statement = ts.isImportDeclaration(st) &&
            st.importClause &&
            ts.isImportClause(st.importClause) &&
            st.importClause.namedBindings &&
            ts.isNamedImports(st.importClause.namedBindings) &&
            Array.isArray(st.importClause.namedBindings.elements) &&
            st.importClause.namedBindings.elements.find(nbe => nbe.name.getText() === typeName);
        if (!statement) {
            return false;
        }
        return true;
    });
    if (importTypeDeclaration) {
        const localImportPath = importTypeDeclaration.moduleSpecifier.text;
        return {
            location: 'import',
            path: localImportPath,
        };
    }
    // Loop through all top level exports to find if any reference to the type for 'local' reference location
    const isExported = sourceFileObj.statements.some(st => {
        // Is the interface defined in the file and exported
        const isInterfaceDeclarationExported = ts.isInterfaceDeclaration(st) &&
            st.name.getText() === typeName &&
            Array.isArray(st.modifiers) &&
            st.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword);
        const isTypeAliasDeclarationExported = ts.isTypeAliasDeclaration(st) &&
            st.name.getText() === typeName &&
            Array.isArray(st.modifiers) &&
            st.modifiers.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword);
        // Is the interface exported through a named export
        const isTypeInExportDeclaration = ts.isExportDeclaration(st) && ts.isNamedExports(st.exportClause) && st.exportClause.elements.some(nee => nee.name.getText() === typeName);
        return isInterfaceDeclarationExported || isTypeAliasDeclarationExported || isTypeInExportDeclaration;
    });
    if (isExported) {
        return {
            location: 'local',
        };
    }
    // This is most likely a global type, if it is a local that is not exported then typescript will inform the dev
    return {
        location: 'global',
    };
};
export const resolveType = (checker, type) => {
    const set = new Set();
    parseDocsType(checker, type, set);
    // normalize booleans
    const hasTrue = set.delete('true');
    const hasFalse = set.delete('false');
    if (hasTrue || hasFalse) {
        set.add('boolean');
    }
    let parts = Array.from(set.keys()).sort();
    if (parts.length > 1) {
        parts = parts.map(p => (p.indexOf('=>') >= 0 ? `(${p})` : p));
    }
    if (parts.length > 20) {
        return typeToString(checker, type);
    }
    else {
        return parts.join(' | ');
    }
};
export const typeToString = (checker, type) => {
    const TYPE_FORMAT_FLAGS = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType;
    return checker.typeToString(type, undefined, TYPE_FORMAT_FLAGS);
};
export const parseDocsType = (checker, type, parts) => {
    if (type.isUnion()) {
        type.types.forEach(t => {
            parseDocsType(checker, t, parts);
        });
    }
    else {
        const text = typeToString(checker, type);
        parts.add(text);
    }
};
export const getModuleFromSourceFile = (compilerCtx, tsSourceFile) => {
    const sourceFilePath = normalizePath(tsSourceFile.fileName);
    const moduleFile = compilerCtx.moduleMap.get(sourceFilePath);
    if (moduleFile != null) {
        return moduleFile;
    }
    const moduleFiles = Array.from(compilerCtx.moduleMap.values());
    return moduleFiles.find(m => m.jsFilePath === sourceFilePath);
};
export const getComponentMeta = (compilerCtx, tsSourceFile, node) => {
    const meta = compilerCtx.nodeMap.get(node);
    if (meta) {
        return meta;
    }
    const moduleFile = getModuleFromSourceFile(compilerCtx, tsSourceFile);
    if (moduleFile != null && node.members != null) {
        const staticMembers = node.members.filter(isStaticGetter);
        const tagName = getComponentTagName(staticMembers);
        if (typeof tagName === 'string') {
            return moduleFile.cmps.find(cmp => cmp.tagName === tagName);
        }
    }
    return undefined;
};
export const getComponentTagName = (staticMembers) => {
    if (staticMembers.length > 0) {
        const tagName = getStaticValue(staticMembers, 'is');
        if (typeof tagName === 'string' && tagName.includes('-')) {
            return tagName;
        }
    }
    return null;
};
export const isStaticGetter = (member) => {
    return member.kind === ts.SyntaxKind.GetAccessor && member.modifiers && member.modifiers.some(({ kind }) => kind === ts.SyntaxKind.StaticKeyword);
};
export const serializeSymbol = (checker, symbol) => {
    if (!checker || !symbol) {
        return {
            tags: [],
            text: '',
        };
    }
    return {
        tags: symbol.getJsDocTags().map(tag => ({ text: tag.text, name: tag.name })),
        text: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
    };
};
export const serializeDocsSymbol = (checker, symbol) => {
    const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
    const set = new Set();
    parseDocsType(checker, type, set);
    // normalize booleans
    const hasTrue = set.delete('true');
    const hasFalse = set.delete('false');
    if (hasTrue || hasFalse) {
        set.add('boolean');
    }
    let parts = Array.from(set.keys()).sort();
    if (parts.length > 1) {
        parts = parts.map(p => (p.indexOf('=>') >= 0 ? `(${p})` : p));
    }
    if (parts.length > 20) {
        return typeToString(checker, type);
    }
    else {
        return parts.join(' | ');
    }
};
export const isInternal = (jsDocs) => {
    return jsDocs && jsDocs.tags.some(s => s.name === 'internal');
};
export const isMethod = (member, methodName) => {
    return ts.isMethodDeclaration(member) && member.name && member.name.escapedText === methodName;
};
export const isAsyncFn = (typeChecker, methodDeclaration) => {
    if (methodDeclaration.modifiers) {
        if (methodDeclaration.modifiers.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
            return true;
        }
    }
    const methodSignature = typeChecker.getSignatureFromDeclaration(methodDeclaration);
    const returnType = methodSignature.getReturnType();
    const typeStr = typeChecker.typeToString(returnType, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.InElementType);
    return typeStr.includes('Promise<');
};
