"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const alias_plugin_1 = require("./plugins/alias-plugin");
const graceful_fs_plugin_1 = require("./plugins/graceful-fs-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
const write_pkg_json_1 = require("../utils/write-pkg-json");
async function cli(opts) {
    const inputDir = path_1.join(opts.transpiledDir, 'cli');
    // create public d.ts
    let dts = await fs_extra_1.default.readFile(path_1.join(inputDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../internal/index');
    await fs_extra_1.default.writeFile(path_1.join(opts.output.cliDir, 'index.d.ts'), dts);
    // write package.json
    write_pkg_json_1.writePkgJson(opts, opts.output.cliDir, {
        name: '@stencil/core/cli',
        description: 'Stencil CLI.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    const external = [
        'assert',
        'buffer',
        'child_process',
        'constants',
        'crypto',
        'events',
        'fs',
        'https',
        'os',
        'path',
        'readline',
        'stream',
        'string_decoder',
        'tty',
        'typescript',
        'url',
        'util',
    ];
    const cliBundle = {
        input: path_1.join(inputDir, 'index.js'),
        output: {
            format: 'cjs',
            file: path_1.join(opts.output.cliDir, 'index.js'),
            esModule: false,
            preferConst: true,
        },
        external,
        plugins: [
            {
                name: 'cliImportResolverPlugin',
                resolveId(importee) {
                    if (importee === '@stencil/core/compiler') {
                        return {
                            id: '../compiler/stencil.js',
                            external: true,
                        };
                    }
                    if (importee === '@stencil/core/dev-server') {
                        return {
                            id: '../dev-server/index.js',
                            external: true,
                        };
                    }
                    if (importee === '@stencil/core/mock-doc') {
                        return {
                            id: '../mock-doc/index.js',
                            external: true,
                        };
                    }
                    return null;
                },
            },
            graceful_fs_plugin_1.gracefulFsPlugin(),
            alias_plugin_1.aliasPlugin(opts),
            replace_plugin_1.replacePlugin(opts),
            plugin_node_resolve_1.default({
                preferBuiltins: true,
            }),
            plugin_commonjs_1.default(),
        ],
    };
    const cliWorkerBundle = {
        input: path_1.join(inputDir, 'worker', 'index.js'),
        output: {
            format: 'cjs',
            file: path_1.join(opts.output.cliDir, 'cli-worker.js'),
            esModule: false,
            preferConst: true,
        },
        external,
        plugins: [
            {
                name: 'cliWorkerImportResolverPlugin',
                resolveId(importee) {
                    if (importee === '@stencil/core/compiler') {
                        return {
                            id: '../compiler/stencil.js',
                            external: true,
                        };
                    }
                    if (importee === '@stencil/core/mock-doc') {
                        return {
                            id: '../mock-doc/index.js',
                            external: true,
                        };
                    }
                    return null;
                },
            },
            graceful_fs_plugin_1.gracefulFsPlugin(),
            alias_plugin_1.aliasPlugin(opts),
            replace_plugin_1.replacePlugin(opts),
            plugin_node_resolve_1.default({
                preferBuiltins: true,
            }),
            plugin_commonjs_1.default(),
        ],
    };
    return [cliBundle, cliWorkerBundle];
}
exports.cli = cli;
