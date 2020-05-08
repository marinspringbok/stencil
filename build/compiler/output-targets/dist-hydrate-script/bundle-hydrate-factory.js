import { getBuildFeatures } from '../../app-core/app-data';
import { bundleOutput } from '../../bundle/bundle-output';
import { hydrateComponentTransform } from '../../transformers/component-hydrate/tranform-to-hydrate-component';
import { loadRollupDiagnostics } from '@utils';
import { removeCollectionImports } from '../../transformers/remove-collection-imports';
import { STENCIL_INTERNAL_HYDRATE_ID } from '../../bundle/entry-alias-ids';
import { updateStencilCoreImports } from '../../transformers/update-stencil-core-import';
export const bundleHydrateFactory = async (config, compilerCtx, buildCtx, _build, appFactoryEntryCode) => {
    try {
        const bundleOpts = {
            id: 'hydrate',
            platform: 'hydrate',
            conditionals: getHydrateBuildConditionals(buildCtx.components),
            customTransformers: getHydrateCustomTransformer(config, compilerCtx),
            inlineDynamicImports: true,
            inputs: {
                '@app-factory-entry': '@app-factory-entry',
            },
            loader: {
                '@app-factory-entry': appFactoryEntryCode,
            },
        };
        const rollupBuild = await bundleOutput(config, compilerCtx, buildCtx, bundleOpts);
        return rollupBuild;
    }
    catch (e) {
        if (!buildCtx.hasError) {
            loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
        }
    }
    return undefined;
};
const getHydrateBuildConditionals = (cmps) => {
    const build = getBuildFeatures(cmps);
    build.lazyLoad = true;
    build.hydrateServerSide = true;
    build.cssVarShim = false;
    build.hydrateClientSide = true;
    build.isDebug = false;
    build.isDev = false;
    build.isTesting = false;
    build.devTools = false;
    build.lifecycleDOMEvents = false;
    build.profile = false;
    build.hotModuleReplacement = false;
    build.updatable = true;
    build.member = true;
    build.constructableCSS = false;
    build.asyncLoading = true;
    build.appendChildSlotFix = false;
    build.slotChildNodesFix = false;
    build.cloneNodeFix = false;
    build.cssAnnotations = true;
    build.shadowDomShim = true;
    build.safari10 = false;
    build.hydratedAttribute = false;
    build.hydratedClass = true;
    build.scriptDataOpts = false;
    build.dynamicImportShim = false;
    return build;
};
const getHydrateCustomTransformer = (config, compilerCtx) => {
    const transformOpts = {
        coreImportPath: STENCIL_INTERNAL_HYDRATE_ID,
        componentExport: null,
        componentMetadata: null,
        currentDirectory: config.cwd,
        proxy: null,
        style: 'static',
    };
    return [updateStencilCoreImports(transformOpts.coreImportPath), hydrateComponentTransform(compilerCtx, transformOpts), removeCollectionImports(compilerCtx)];
};
