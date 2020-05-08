import { getTextDocs, isDocsPublic } from '@utils';
export const generatePropTypes = (cmpMeta) => {
    return [
        ...cmpMeta.properties.map(cmpProp => ({
            name: cmpProp.name,
            type: cmpProp.complexType.original,
            optional: cmpProp.optional,
            required: cmpProp.required,
            public: isDocsPublic(cmpProp.docs),
            jsdoc: getTextDocs(cmpProp.docs),
        })),
        ...cmpMeta.virtualProperties.map(cmpProp => ({
            name: cmpProp.name,
            type: cmpProp.type,
            optional: true,
            required: false,
            jsdoc: cmpProp.docs,
            public: true,
        })),
    ];
};
