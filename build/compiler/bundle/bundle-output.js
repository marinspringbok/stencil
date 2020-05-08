import { appDataPlugin } from './app-data-plugin';
import { coreResolvePlugin } from './core-resolve-plugin';
import { createCustomResolverAsync } from '../sys/resolve/resolve-module-async';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { devNodeModuleResolveId } from './dev-module';
import { extTransformsPlugin } from './ext-transforms-plugin';
import { fileLoadPlugin } from './file-load-plugin';
import { imagePlugin } from './image-plugin';
import { lazyComponentPlugin } from '../output-targets/dist-lazy/lazy-component-plugin';
import { loaderPlugin } from './loader-plugin';
import { pluginHelper } from './plugin-helper';
import { resolveIdWithTypeScript, typescriptPlugin } from './typescript-plugin';
import { rollupCommonjsPlugin, rollupJsonPlugin, rollupNodeResolvePlugin, rollupReplacePlugin } from '@compiler-plugins';
import { rollup } from 'rollup';
import { textPlugin } from './text-plugin';
import { userIndexPlugin } from './user-index-plugin';
import { workerPlugin } from './worker-plugin';
export const bundleOutput = async (config, compilerCtx, buildCtx, bundleOpts) => {
    try {
        const rollupOptions = getRollupOptions(config, compilerCtx, buildCtx, bundleOpts);
        const rollupBuild = await rollup(rollupOptions);
        compilerCtx.rollupCache.set(bundleOpts.id, rollupBuild.cache);
        return rollupBuild;
    }
    catch (e) {
        if (!buildCtx.hasError) {
            loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
        }
    }
    return undefined;
};
export const getRollupOptions = (config, compilerCtx, buildCtx, bundleOpts) => {
    const customResolveOptions = createCustomResolverAsync(config.sys, compilerCtx.fs, ['.tsx', '.ts', '.js', '.mjs', '.json']);
    const nodeResolvePlugin = rollupNodeResolvePlugin(Object.assign({ mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'], customResolveOptions, browser: true }, config.nodeResolve));
    if (config.devServer && config.devServer.experimentalDevModules) {
        const orgNodeResolveId = nodeResolvePlugin.resolveId;
        nodeResolvePlugin.resolveId = async function (importee, importer) {
            const resolvedId = await orgNodeResolveId.call(nodeResolvePlugin, importee, importer);
            return devNodeModuleResolveId(config, compilerCtx.fs, resolvedId, importee);
        };
    }
    const beforePlugins = config.rollupPlugins.before || [];
    const afterPlugins = config.rollupPlugins.after || [];
    const rollupOptions = {
        input: bundleOpts.inputs,
        plugins: [
            coreResolvePlugin(config, compilerCtx, bundleOpts.platform),
            appDataPlugin(config, compilerCtx, buildCtx, bundleOpts.conditionals, bundleOpts.platform),
            lazyComponentPlugin(buildCtx),
            loaderPlugin(bundleOpts.loader),
            userIndexPlugin(config, compilerCtx),
            typescriptPlugin(compilerCtx, bundleOpts),
            imagePlugin(config, buildCtx),
            textPlugin(),
            extTransformsPlugin(config, compilerCtx, buildCtx, bundleOpts),
            workerPlugin(config, compilerCtx, buildCtx, bundleOpts.platform, !!bundleOpts.inlineWorkers),
            ...beforePlugins,
            nodeResolvePlugin,
            resolveIdWithTypeScript(config, compilerCtx),
            rollupCommonjsPlugin(Object.assign({ include: /node_modules/, sourceMap: config.sourceMap }, config.commonjs)),
            ...afterPlugins,
            pluginHelper(config, buildCtx),
            rollupJsonPlugin({
                preferConst: true,
            }),
            rollupReplacePlugin({
                'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"',
            }),
            fileLoadPlugin(compilerCtx.fs),
        ],
        treeshake: getTreeshakeOption(config, bundleOpts),
        inlineDynamicImports: bundleOpts.inlineDynamicImports,
        onwarn: createOnWarnFn(buildCtx.diagnostics),
        cache: compilerCtx.rollupCache.get(bundleOpts.id),
    };
    return rollupOptions;
};
const getTreeshakeOption = (config, bundleOpts) => {
    if (bundleOpts.platform === 'hydrate') {
        return {
            propertyReadSideEffects: false,
            tryCatchDeoptimization: false,
        };
    }
    const treeshake = !config.devMode && config.rollupConfig.inputOptions.treeshake !== false
        ? {
            propertyReadSideEffects: false,
            tryCatchDeoptimization: false,
        }
        : false;
    return treeshake;
};
