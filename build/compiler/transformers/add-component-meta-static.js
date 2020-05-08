import { convertValueToLiteral, createStaticGetter } from './transform-utils';
import ts from 'typescript';
export const addComponentMetaStatic = (cmpNode, cmpMeta) => {
    const publicCompilerMeta = getPublicCompilerMeta(cmpMeta);
    const cmpMetaStaticProp = createStaticGetter('COMPILER_META', convertValueToLiteral(publicCompilerMeta));
    const classMembers = [...cmpNode.members, cmpMetaStaticProp];
    return ts.updateClassDeclaration(cmpNode, cmpNode.decorators, cmpNode.modifiers, cmpNode.name, cmpNode.typeParameters, cmpNode.heritageClauses, classMembers);
};
export const getPublicCompilerMeta = (cmpMeta) => {
    const publicCompilerMeta = Object.assign({}, cmpMeta);
    // no need to copy all compiler meta data
    delete publicCompilerMeta.assetsDirs;
    delete publicCompilerMeta.dependencies;
    delete publicCompilerMeta.excludeFromCollection;
    delete publicCompilerMeta.isCollectionDependency;
    delete publicCompilerMeta.docs;
    delete publicCompilerMeta.jsFilePath;
    delete publicCompilerMeta.potentialCmpRefs;
    delete publicCompilerMeta.styleDocs;
    delete publicCompilerMeta.sourceFilePath;
    return publicCompilerMeta;
};
