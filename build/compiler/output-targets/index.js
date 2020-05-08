import { outputAngular } from './output-angular';
import { outputCopy } from './copy/output-copy';
import { outputCustomElements } from './dist-custom-elements';
import { outputCustomElementsBundle } from './dist-custom-elements-bundle';
import { outputDocs } from './output-docs';
import { outputHydrateScript } from './dist-hydrate-script';
import { outputLazy } from './dist-lazy/lazy-output';
import { outputLazyLoader } from './output-lazy-loader';
import { outputWww } from './output-www';
import { outputCollection } from './dist-collection';
import { outputTypes } from './output-types';
export const generateOutputTargets = async (config, compilerCtx, buildCtx) => {
    const timeSpan = buildCtx.createTimeSpan('generate outputs started', true);
    const changedModuleFiles = Array.from(compilerCtx.changedModules)
        .map(filename => compilerCtx.moduleMap.get(filename))
        .filter(mod => mod && !mod.isCollectionDependency);
    compilerCtx.changedModules.clear();
    invalidateRollupCaches(compilerCtx);
    await Promise.all([
        outputAngular(config, compilerCtx, buildCtx),
        outputCopy(config, compilerCtx, buildCtx),
        outputCollection(config, compilerCtx, buildCtx, changedModuleFiles),
        outputCustomElements(config, compilerCtx, buildCtx, changedModuleFiles),
        outputCustomElementsBundle(config, compilerCtx, buildCtx),
        outputHydrateScript(config, compilerCtx, buildCtx),
        outputLazyLoader(config, compilerCtx),
        outputApp(config, compilerCtx, buildCtx),
    ]);
    // must run after all the other outputs
    // since it validates files were created
    await outputDocs(config, compilerCtx, buildCtx);
    await outputTypes(config, compilerCtx, buildCtx);
    timeSpan.finish('generate outputs finished');
};
const outputApp = async (config, compilerCtx, buildCtx) => {
    await outputLazy(config, compilerCtx, buildCtx);
    await outputWww(config, compilerCtx, buildCtx);
};
const invalidateRollupCaches = (compilerCtx) => {
    const invalidatedIds = compilerCtx.changedFiles;
    compilerCtx.rollupCache.forEach((cache) => {
        cache.modules.forEach(mod => {
            if (mod.transformDependencies.some(id => invalidatedIds.has(id))) {
                mod.originalCode = null;
            }
        });
    });
};
