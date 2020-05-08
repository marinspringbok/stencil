"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const bundle_dts_1 = require("../utils/bundle-dts");
const alias_plugin_1 = require("./plugins/alias-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
const url_plugin_1 = require("./plugins/url-plugin");
const banner_1 = require("../utils/banner");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const write_pkg_json_1 = require("../utils/write-pkg-json");
async function internalHydrate(opts) {
    const inputHydrateDir = path_1.join(opts.transpiledDir, 'hydrate');
    const outputInternalHydrateDir = path_1.join(opts.output.internalDir, 'hydrate');
    await fs_extra_1.default.emptyDir(outputInternalHydrateDir);
    // write @stencil/core/internal/hydrate/package.json
    write_pkg_json_1.writePkgJson(opts, outputInternalHydrateDir, {
        name: '@stencil/core/internal/hydrate',
        description: 'Stencil internal hydrate platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
        main: 'index.mjs',
    });
    await createHydrateRunnerDtsBundle(opts, inputHydrateDir, outputInternalHydrateDir);
    const hydratePlatformInput = path_1.join(inputHydrateDir, 'platform', 'index.js');
    const internalHydratePlatformBundle = {
        input: hydratePlatformInput,
        output: {
            format: 'es',
            dir: outputInternalHydrateDir,
            entryFileNames: '[name].mjs',
            chunkFileNames: '[name].mjs',
            banner: banner_1.getBanner(opts, 'Stencil Hydrate Platform'),
            preferConst: true,
        },
        plugins: [
            {
                name: 'internalHydratePlugin',
                resolveId(importee) {
                    if (importee === '@platform') {
                        return hydratePlatformInput;
                    }
                },
            },
            alias_plugin_1.aliasPlugin(opts),
            replace_plugin_1.replacePlugin(opts),
            url_plugin_1.urlPlugin(opts),
            plugin_node_resolve_1.default({
                preferBuiltins: true,
            }),
            plugin_commonjs_1.default(),
        ],
    };
    const internalHydrateRunnerBundle = {
        input: path_1.join(inputHydrateDir, 'runner', 'index.js'),
        output: {
            format: 'es',
            file: path_1.join(outputInternalHydrateDir, 'runner.mjs'),
            banner: banner_1.getBanner(opts, 'Stencil Hydrate Runner'),
            preferConst: true,
        },
        plugins: [
            alias_plugin_1.aliasPlugin(opts),
            replace_plugin_1.replacePlugin(opts),
            url_plugin_1.urlPlugin(opts),
            plugin_node_resolve_1.default({
                preferBuiltins: true,
            }),
            plugin_commonjs_1.default(),
        ],
    };
    return [internalHydratePlatformBundle, internalHydrateRunnerBundle];
}
exports.internalHydrate = internalHydrate;
async function createHydrateRunnerDtsBundle(opts, inputHydrateDir, outputDir) {
    // bundle @stencil/core/internal/hydrate/runner.d.ts
    const dtsEntry = path_1.join(inputHydrateDir, 'runner', 'index.d.ts');
    const dtsContent = await bundle_dts_1.bundleDts(opts, dtsEntry);
    const outputPath = path_1.join(outputDir, 'runner.d.ts');
    await fs_extra_1.default.writeFile(outputPath, dtsContent);
}
