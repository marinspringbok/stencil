import { COLLECTION_MANIFEST_FILE_NAME, flatOne, normalizePath, sortBy } from '@utils';
import { isOutputTargetDistCollection } from './output-utils';
import { join, relative } from 'path';
import { typescriptVersion, version } from '../../version';
export const outputCollections = async (config, compilerCtx, buildCtx) => {
    const outputTargets = config.outputTargets.filter(isOutputTargetDistCollection);
    if (outputTargets.length === 0) {
        return;
    }
    const timespan = buildCtx.createTimeSpan(`generate collections started`, true);
    const moduleFiles = buildCtx.moduleFiles.filter(m => !m.isCollectionDependency && m.jsFilePath);
    await Promise.all([writeJsFiles(config, compilerCtx, moduleFiles, outputTargets), writeCollectionManifests(config, compilerCtx, buildCtx, outputTargets)]);
    timespan.finish(`generate collections finished`);
};
const writeJsFiles = (config, compilerCtx, moduleFiles, outputTargets) => {
    return Promise.all(moduleFiles.map(moduleFile => writeModuleFile(config, compilerCtx, moduleFile, outputTargets)));
};
const writeModuleFile = async (config, compilerCtx, moduleFile, outputTargets) => {
    const relPath = relative(config.srcDir, moduleFile.jsFilePath);
    const jsContent = await compilerCtx.fs.readFile(moduleFile.jsFilePath);
    await Promise.all(outputTargets.map(o => {
        const outputFilePath = join(o.collectionDir, relPath);
        return compilerCtx.fs.writeFile(outputFilePath, jsContent);
    }));
};
export const writeCollectionManifests = async (config, compilerCtx, buildCtx, outputTargets) => {
    const collectionData = JSON.stringify(serializeCollectionManifest(config, compilerCtx, buildCtx), null, 2);
    return Promise.all(outputTargets.map(o => writeCollectionManifest(compilerCtx, collectionData, o)));
};
// this maps the json data to our internal data structure
// apping is so that the internal data structure "could"
// change, but the external user data will always use the same api
// over the top lame mapping functions is basically so we can loosly
// couple core component meta data between specific versions of the compiler
const writeCollectionManifest = async (compilerCtx, collectionData, outputTarget) => {
    // get the absolute path to the directory where the collection will be saved
    const collectionDir = normalizePath(outputTarget.collectionDir);
    // create an absolute file path to the actual collection json file
    const collectionFilePath = normalizePath(join(collectionDir, COLLECTION_MANIFEST_FILE_NAME));
    // don't bother serializing/writing the collection if we're not creating a distribution
    await compilerCtx.fs.writeFile(collectionFilePath, collectionData);
};
export const serializeCollectionManifest = (config, compilerCtx, buildCtx) => {
    // create the single collection we're going to fill up with data
    const collectionManifest = {
        entries: buildCtx.moduleFiles.filter(mod => !mod.isCollectionDependency && mod.cmps.length > 0).map(mod => relative(config.srcDir, mod.jsFilePath)),
        compiler: {
            name: '@stencil/core',
            version,
            typescriptVersion,
        },
        collections: serializeCollectionDependencies(compilerCtx),
        bundles: config.bundles.map(b => ({
            components: b.components.slice().sort(),
        })),
    };
    if (config.globalScript) {
        const mod = compilerCtx.moduleMap.get(normalizePath(config.globalScript));
        if (mod) {
            collectionManifest.global = relative(config.srcDir, mod.jsFilePath);
        }
    }
    return collectionManifest;
};
const serializeCollectionDependencies = (compilerCtx) => {
    const collectionDeps = compilerCtx.collections.map(c => ({
        name: c.collectionName,
        tags: flatOne(c.moduleFiles.map(m => m.cmps))
            .map(cmp => cmp.tagName)
            .sort(),
    }));
    return sortBy(collectionDeps, item => item.name);
};
