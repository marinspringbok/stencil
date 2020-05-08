import { generateRollupOutput } from '../../app-core/bundle-app-core';
import { generateLazyModules } from './generate-lazy-module';
import { getAppBrowserCorePolyfills } from '../../app-core/app-polyfills';
import { join } from 'path';
import { relativeImport } from '../output-utils';
export const generateSystem = async (config, compilerCtx, buildCtx, rollupBuild, outputTargets) => {
    const systemOutputs = outputTargets.filter(o => !!o.systemDir);
    if (systemOutputs.length > 0) {
        const esmOpts = {
            format: 'system',
            entryFileNames: config.hashFileNames ? 'p-[hash].system.js' : '[name].system.js',
            chunkFileNames: config.hashFileNames ? 'p-[hash].system.js' : '[name]-[hash].system.js',
            assetFileNames: config.hashFileNames ? 'p-[hash][extname]' : '[name]-[hash][extname]',
            preferConst: true,
        };
        const results = await generateRollupOutput(rollupBuild, esmOpts, config, buildCtx.entryModules);
        if (results != null) {
            const destinations = systemOutputs.map(o => o.esmDir);
            await generateLazyModules(config, compilerCtx, buildCtx, outputTargets[0].type, destinations, results, 'es5', true, '.system');
            await generateSystemLoaders(config, compilerCtx, results, systemOutputs);
        }
    }
};
const generateSystemLoaders = (config, compilerCtx, rollupResult, systemOutputs) => {
    const loaderFilename = rollupResult.find(r => r.type === 'chunk' && r.isBrowserLoader).fileName;
    return Promise.all(systemOutputs.map(o => writeSystemLoader(config, compilerCtx, loaderFilename, o)));
};
const writeSystemLoader = async (config, compilerCtx, loaderFilename, outputTarget) => {
    if (outputTarget.systemLoaderFile) {
        const entryPointPath = join(outputTarget.systemDir, loaderFilename);
        const relativePath = relativeImport(outputTarget.systemLoaderFile, entryPointPath);
        const loaderContent = await getSystemLoader(config, compilerCtx, relativePath, outputTarget.polyfills);
        await compilerCtx.fs.writeFile(outputTarget.systemLoaderFile, loaderContent, { outputTargetType: outputTarget.type });
    }
};
const getSystemLoader = async (config, compilerCtx, corePath, includePolyfills) => {
    const polyfills = includePolyfills ? await getAppBrowserCorePolyfills(config, compilerCtx) : '/* polyfills excluded */';
    return `
'use strict';
(function () {
  var currentScript = document.currentScript;

  // Safari 10 support type="module" but still download and executes the nomodule script
  if (!currentScript || !currentScript.hasAttribute('nomodule') || !('onbeforeload' in currentScript)) {

    ${polyfills}

    // Figure out currentScript (for IE11, since it does not support currentScript)
    var regex = /\\/${config.fsNamespace}(\\.esm)?\\.js($|\\?|#)/;
    var scriptElm = currentScript || Array.from(document.querySelectorAll('script')).find(function(s) {
      return regex.test(s.src) || s.getAttribute('data-stencil-namespace') === "${config.fsNamespace}";
    });

    var resourcesUrl = scriptElm ? scriptElm.getAttribute('data-resources-url') || scriptElm.src : '';
    var start = function() {
      var url = new URL('${corePath}', resourcesUrl);
      System.import(url.href);
    };

    if (window.__cssshim) {
      window.__cssshim.i().then(start);
    } else {
      start();
    }

    // Note: using .call(window) here because the self-executing function needs
    // to be scoped to the window object for the ES6Promise polyfill to work
  }
}).call(window);
`;
};
