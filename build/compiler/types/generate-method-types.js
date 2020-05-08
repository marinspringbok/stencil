import { getTextDocs, isDocsPublic } from '@utils';
export const generateMethodTypes = (cmpMethods) => {
    return cmpMethods.map(cmpMethod => ({
        name: cmpMethod.name,
        type: cmpMethod.complexType.signature,
        optional: false,
        required: false,
        public: isDocsPublic(cmpMethod.docs),
        jsdoc: getTextDocs(cmpMethod.docs),
    }));
};
