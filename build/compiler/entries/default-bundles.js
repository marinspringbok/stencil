import { buildError, buildWarn, flatOne, unique, validateComponentTag } from '@utils';
import { getUsedComponents } from '../html/used-components';
export function getDefaultBundles(config, buildCtx, cmps) {
    const userConfigEntryPoints = getUserConfigBundles(config, buildCtx, cmps);
    if (userConfigEntryPoints.length > 0) {
        return userConfigEntryPoints;
    }
    let entryPointsHints = config.entryComponentsHint;
    if (!entryPointsHints && buildCtx.indexDoc) {
        entryPointsHints = getUsedComponents(buildCtx.indexDoc, cmps);
    }
    if (!entryPointsHints) {
        return [];
    }
    const mainBundle = unique([...entryPointsHints, ...flatOne(entryPointsHints.map(resolveTag).map(cmp => cmp.dependencies))]).map(resolveTag);
    function resolveTag(tag) {
        return cmps.find(cmp => cmp.tagName === tag);
    }
    return [mainBundle];
}
export function getUserConfigBundles(config, buildCtx, cmps) {
    const definedTags = new Set();
    const entryTags = config.bundles.map(b => {
        return b.components
            .map(tag => {
            const tagError = validateComponentTag(tag);
            if (tagError) {
                const err = buildError(buildCtx.diagnostics);
                err.header = `Stencil Config`;
                err.messageText = tagError;
            }
            const component = cmps.find(cmp => cmp.tagName === tag);
            if (!component) {
                const warn = buildWarn(buildCtx.diagnostics);
                warn.header = `Stencil Config`;
                warn.messageText = `Component tag "${tag}" is defined in a bundle but no matching component was found within this app or its collections.`;
            }
            if (definedTags.has(tag)) {
                const warn = buildWarn(buildCtx.diagnostics);
                warn.header = `Stencil Config`;
                warn.messageText = `Component tag "${tag}" has been defined multiple times in the "bundles" config.`;
            }
            definedTags.add(tag);
            return component;
        })
            .sort();
    });
    return entryTags;
}
