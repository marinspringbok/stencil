"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const alias_plugin_1 = require("./plugins/alias-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
const reorder_statements_1 = require("./plugins/reorder-statements");
const banner_1 = require("../utils/banner");
const write_pkg_json_1 = require("../utils/write-pkg-json");
async function internalTesting(opts) {
    const inputTestingPlatform = path_1.join(opts.transpiledDir, 'testing', 'platform', 'index.js');
    const outputTestingPlatformDir = path_1.join(opts.output.internalDir, 'testing');
    await fs_extra_1.default.emptyDir(outputTestingPlatformDir);
    // write @stencil/core/internal/testing/package.json
    write_pkg_json_1.writePkgJson(opts, outputTestingPlatformDir, {
        name: '@stencil/core/internal/testing',
        description: 'Stencil internal testing platform to be imported by the Stencil Compiler. Breaking changes can and will happen at any time.',
        main: 'index.js',
    });
    const output = {
        format: 'cjs',
        dir: outputTestingPlatformDir,
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        banner: banner_1.getBanner(opts, 'Stencil Testing Platform'),
        esModule: false,
        preferConst: true,
    };
    const internalTestingPlatformBundle = {
        input: {
            index: inputTestingPlatform,
        },
        output,
        plugins: [
            {
                name: 'internalTestingPlugin',
                resolveId(importee) {
                    if (importee === '@platform') {
                        return inputTestingPlatform;
                    }
                    return null;
                },
            },
            alias_plugin_1.aliasPlugin(opts),
            replace_plugin_1.replacePlugin(opts),
            reorder_statements_1.reorderCoreStatementsPlugin(),
        ],
    };
    return [internalTestingPlatformBundle];
}
exports.internalTesting = internalTesting;
