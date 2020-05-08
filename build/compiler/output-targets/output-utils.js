import { basename, dirname, join, relative } from 'path';
import { flatOne, normalizePath, sortBy } from '@utils';
export const relativeImport = (pathFrom, pathTo, ext, addPrefix = true) => {
    let relativePath = relative(dirname(pathFrom), dirname(pathTo));
    if (addPrefix) {
        if (relativePath === '') {
            relativePath = '.';
        }
        else if (relativePath[0] !== '.') {
            relativePath = './' + relativePath;
        }
    }
    return normalizePath(`${relativePath}/${basename(pathTo, ext)}`);
};
export const getDistEsmDir = (outputTarget, sourceTarget) => join(outputTarget.buildDir, 'esm', sourceTarget || '');
export const getDistEsmComponentsDir = (outputTarget, sourceTarget) => join(getDistEsmDir(outputTarget, sourceTarget), 'build');
export const getDistEsmIndexPath = (outputTarget, sourceTarget) => join(getDistEsmDir(outputTarget, sourceTarget), 'index.js');
export const getDefineCustomElementsPath = (config, outputTarget, sourceTarget) => join(getDistEsmDir(outputTarget, sourceTarget), getDefineEsmFilename(config));
export const getComponentsEsmBuildPath = (config, outputTarget, sourceTarget) => join(getDistEsmDir(outputTarget, sourceTarget), getComponentsEsmFileName(config));
export const getCoreEsmFileName = (config) => `${config.fsNamespace}.core.js`;
export const getDefineEsmFilename = (config) => `${config.fsNamespace}.define.js`;
export const getComponentsEsmFileName = (config) => `${config.fsNamespace}.components.js`;
export const getLoaderEsmPath = (outputTarget) => join(outputTarget.buildDir, outputTarget.esmLoaderPath);
export const getComponentsDtsSrcFilePath = (config) => join(config.srcDir, GENERATED_DTS);
export const getComponentsDtsTypesFilePath = (outputTarget) => join(outputTarget.typesDir, GENERATED_DTS);
export const isOutputTargetDist = (o) => o.type === DIST;
export const isOutputTargetDistCollection = (o) => o.type === DIST_COLLECTION;
export const isOutputTargetDistCustomElements = (o) => o.type === DIST_CUSTOM_ELEMENTS;
export const isOutputTargetDistCustomElementsBundle = (o) => o.type === DIST_CUSTOM_ELEMENTS_BUNDLE || o.type === EXPERIMENTAL_DIST_MODULE;
export const isOutputTargetCopy = (o) => o.type === COPY;
export const isOutputTargetDistLazy = (o) => o.type === DIST_LAZY;
export const isOutputTargetAngular = (o) => o.type === ANGULAR;
export const isOutputTargetDistLazyLoader = (o) => o.type === DIST_LAZY_LOADER;
export const isOutputTargetDistGlobalStyles = (o) => o.type === DIST_GLOBAL_STYLES;
export const isOutputTargetDistSelfContained = (o) => o.type === DIST_SELF_CONTAINED;
export const isOutputTargetHydrate = (o) => o.type === DIST_HYDRATE_SCRIPT;
export const isOutputTargetCustom = (o) => o.type === CUSTOM;
export const isOutputTargetDocs = (o) => o.type === DOCS || o.type === DOCS_README || o.type === DOCS_JSON || o.type === DOCS_CUSTOM || o.type === DOCS_VSCODE;
export const isOutputTargetDocsReadme = (o) => o.type === DOCS_README || o.type === DOCS;
export const isOutputTargetDocsJson = (o) => o.type === DOCS_JSON;
export const isOutputTargetDocsCustom = (o) => o.type === DOCS_CUSTOM;
export const isOutputTargetDocsVscode = (o) => o.type === DOCS_VSCODE;
export const isOutputTargetWww = (o) => o.type === WWW;
export const isOutputTargetStats = (o) => o.type === STATS;
export const isOutputTargetDistTypes = (o) => o.type === DIST_TYPES;
export const getComponentsFromModules = (moduleFiles) => sortBy(flatOne(moduleFiles.map(m => m.cmps)), (c) => c.tagName);
export const canSkipOutputTargets = (buildCtx) => {
    if (buildCtx.components.length === 0) {
        return true;
    }
    if (buildCtx.requiresFullBuild) {
        return false;
    }
    if (buildCtx.isRebuild && (buildCtx.hasScriptChanges || buildCtx.hasStyleChanges || buildCtx.hasHtmlChanges)) {
        return false;
    }
    return true;
};
export const ANGULAR = `angular`;
export const COPY = 'copy';
export const CUSTOM = `custom`;
export const DIST = `dist`;
export const DIST_COLLECTION = `dist-collection`;
export const DIST_CUSTOM_ELEMENTS = `dist-custom-elements`;
export const DIST_CUSTOM_ELEMENTS_BUNDLE = `dist-custom-elements-bundle`;
export const EXPERIMENTAL_DIST_MODULE = `experimental-dist-module`;
export const DIST_TYPES = `dist-types`;
export const DIST_HYDRATE_SCRIPT = `dist-hydrate-script`;
export const DIST_LAZY = `dist-lazy`;
export const DIST_LAZY_LOADER = `dist-lazy-loader`;
export const DIST_SELF_CONTAINED = `dist-self-contained`;
export const DIST_GLOBAL_STYLES = 'dist-global-styles';
export const DOCS = `docs`;
export const DOCS_CUSTOM = 'docs-custom';
export const DOCS_JSON = `docs-json`;
export const DOCS_README = `docs-readme`;
export const DOCS_VSCODE = `docs-vscode`;
export const STATS = `stats`;
export const WWW = `www`;
export const VALID_TYPES = [
    ANGULAR,
    COPY,
    CUSTOM,
    DIST,
    DIST_COLLECTION,
    DIST_CUSTOM_ELEMENTS,
    EXPERIMENTAL_DIST_MODULE,
    DIST_GLOBAL_STYLES,
    DIST_HYDRATE_SCRIPT,
    DIST_LAZY,
    DIST_SELF_CONTAINED,
    DOCS,
    DOCS_JSON,
    DOCS_README,
    DOCS_VSCODE,
    DOCS_CUSTOM,
    STATS,
    WWW,
];
export const VALID_TYPES_NEXT = [
    // DIST
    WWW,
    DIST,
    DIST_COLLECTION,
    // DIST_CUSTOM_ELEMENTS,
    DIST_CUSTOM_ELEMENTS_BUNDLE,
    EXPERIMENTAL_DIST_MODULE,
    DIST_LAZY,
    DIST_HYDRATE_SCRIPT,
    // DOCS
    DOCS,
    DOCS_JSON,
    DOCS_README,
    DOCS_VSCODE,
    DOCS_CUSTOM,
    // MISC
    ANGULAR,
    COPY,
    CUSTOM,
    STATS,
];
export const GENERATED_DTS = 'components.d.ts';
