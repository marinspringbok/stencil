import { addStaticStyleGetterWithinClass } from '../add-static-style';
import { formatComponentRuntimeMeta } from '@utils';
import { convertValueToLiteral, createStaticGetter } from '../transform-utils';
export const addHydrateRuntimeCmpMeta = (classMembers, cmp) => {
    const compactMeta = formatComponentRuntimeMeta(cmp, true);
    const cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
        $members$: compactMeta[2],
        $listeners$: compactMeta[3],
        $lazyBundleIds$: fakeBundleIds(cmp),
        $attrsToReflect$: getHydrateAttrsToReflect(cmp),
    };
    // We always need shadow-dom shim in hydrate runtime
    if (cmpMeta.$flags$ & 1 /* shadowDomEncapsulation */) {
        cmpMeta.$flags$ |= 8 /* needsShadowDomShim */;
    }
    const staticMember = createStaticGetter('cmpMeta', convertValueToLiteral(cmpMeta));
    addStaticStyleGetterWithinClass(classMembers, cmp);
    classMembers.push(staticMember);
};
const fakeBundleIds = (cmp) => {
    if (cmp.hasMode) {
        const modes = {};
        cmp.styles.forEach(s => {
            modes[s.modeName] = '-';
        });
        return modes;
    }
    return '-';
};
const getHydrateAttrsToReflect = (cmp) => {
    return cmp.properties.reduce((attrs, prop) => {
        if (prop.reflect) {
            attrs.push([prop.name, prop.attribute]);
        }
        return attrs;
    }, []);
};
