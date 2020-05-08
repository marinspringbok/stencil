"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const rollup_1 = require("rollup");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
function inlinedCompilerPluginsPlugin(opts, inputDir) {
    return {
        name: 'inlinedCompilerPluginsPlugin',
        resolveId(id) {
            if (id === '@compiler-plugins') {
                return id;
            }
            return null;
        },
        load(id) {
            if (id === '@compiler-plugins') {
                return bundleCompilerPlugins(opts, inputDir);
            }
            return null;
        },
    };
}
exports.inlinedCompilerPluginsPlugin = inlinedCompilerPluginsPlugin;
async function bundleCompilerPlugins(opts, inputDir) {
    const cacheFile = path_1.default.join(opts.transpiledDir, 'compiler-plugins-bundle-cache.js');
    if (!opts.isProd) {
        try {
            return await fs_extra_1.default.readFile(cacheFile, 'utf8');
        }
        catch (e) { }
    }
    const build = await rollup_1.rollup({
        input: path_1.default.join(inputDir, 'sys', 'modules', 'compiler-plugins.js'),
        external: ['fs', 'module', 'path', 'util'],
        plugins: [
            {
                name: 'bundleCompilerPlugins',
                resolveId(id) {
                    if (id === 'resolve') {
                        return path_1.default.join(opts.bundleHelpersDir, 'resolve.js');
                    }
                    return null;
                },
            },
            plugin_node_resolve_1.default({
                preferBuiltins: false,
            }),
            plugin_commonjs_1.default(),
            plugin_json_1.default({
                preferConst: true,
            }),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    });
    await build.write({
        format: 'es',
        file: cacheFile,
    });
    return await fs_extra_1.default.readFile(cacheFile, 'utf8');
}
