import { getStaticValue } from '../transform-utils';
export const parseStaticEncapsulation = (staticMembers) => {
    let encapsulation = getStaticValue(staticMembers, 'encapsulation');
    if (typeof encapsulation === 'string') {
        encapsulation = encapsulation.toLowerCase().trim();
        if (encapsulation === 'shadow' || encapsulation === 'scoped') {
            return encapsulation;
        }
    }
    return 'none';
};
export const parseStaticShadowDelegatesFocus = (encapsulation, staticMembers) => {
    if (encapsulation === 'shadow') {
        const delegatesFocus = getStaticValue(staticMembers, 'delegatesFocus');
        return !!delegatesFocus;
    }
    return null;
};
