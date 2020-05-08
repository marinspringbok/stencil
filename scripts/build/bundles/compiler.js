"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_json_1 = __importDefault(require("@rollup/plugin-json"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const alias_plugin_1 = require("./plugins/alias-plugin");
const banner_1 = require("../utils/banner");
const inlined_compiler_plugins_plugin_1 = require("./plugins/inlined-compiler-plugins-plugin");
const module_debug_plugin_1 = require("./plugins/module-debug-plugin");
const parse5_plugin_1 = require("./plugins/parse5-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
const sizzle_plugin_1 = require("./plugins/sizzle-plugin");
const sys_modules_plugin_1 = require("./plugins/sys-modules-plugin");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const terser_1 = __importDefault(require("terser"));
async function compiler(opts) {
    const inputDir = path_1.join(opts.transpiledDir, 'compiler');
    const compilerFileName = 'stencil.js';
    const compilerDtsName = compilerFileName.replace('.js', '.d.ts');
    // create public d.ts
    let dts = await fs_extra_1.default.readFile(path_1.join(inputDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../internal/index');
    await fs_extra_1.default.writeFile(path_1.join(opts.output.compilerDir, compilerDtsName), dts);
    // write @stencil/core/compiler/package.json
    write_pkg_json_1.writePkgJson(opts, opts.output.compilerDir, {
        name: '@stencil/core/compiler',
        description: 'Stencil Compiler.',
        main: compilerFileName,
        types: compilerDtsName,
    });
    const cjsIntro = fs_extra_1.default.readFileSync(path_1.join(opts.bundleHelpersDir, 'compiler-cjs-intro.js'), 'utf8');
    const cjsOutro = fs_extra_1.default.readFileSync(path_1.join(opts.bundleHelpersDir, 'compiler-cjs-outro.js'), 'utf8');
    const compilerBundle = {
        input: path_1.join(inputDir, 'index.js'),
        output: {
            format: 'cjs',
            file: path_1.join(opts.output.compilerDir, compilerFileName),
            intro: cjsIntro,
            outro: cjsOutro,
            strict: false,
            banner: banner_1.getBanner(opts, 'Stencil Compiler', true),
            esModule: false,
            preferConst: true,
        },
        plugins: [
            {
                name: 'compilerMockDocResolvePlugin',
                resolveId(id) {
                    if (id === '@stencil/core/mock-doc') {
                        return path_1.join(opts.transpiledDir, 'mock-doc', 'index.js');
                    }
                    return null;
                },
            },
            inlined_compiler_plugins_plugin_1.inlinedCompilerPluginsPlugin(opts, inputDir),
            parse5_plugin_1.parse5Plugin(opts),
            sizzle_plugin_1.sizzlePlugin(opts),
            alias_plugin_1.aliasPlugin(opts),
            sys_modules_plugin_1.sysModulesPlugin(inputDir),
            plugin_node_resolve_1.default({
                preferBuiltins: false,
            }),
            plugin_commonjs_1.default(),
            replace_plugin_1.replacePlugin(opts),
            plugin_json_1.default({
                preferConst: true,
            }),
            module_debug_plugin_1.moduleDebugPlugin(opts),
            {
                name: 'compilerMinify',
                async generateBundle(_, bundleFiles) {
                    if (opts.isProd) {
                        const compilerFilename = Object.keys(bundleFiles).find(f => f.includes('stencil'));
                        const compilerBundle = bundleFiles[compilerFilename];
                        const minified = minifyStencilCompiler(compilerBundle.code);
                        await fs_extra_1.default.writeFile(path_1.join(opts.output.compilerDir, compilerFilename.replace('.js', '.min.js')), minified);
                    }
                },
            },
        ],
        treeshake: {
            moduleSideEffects: false,
        },
    };
    return [compilerBundle];
}
exports.compiler = compiler;
function minifyStencilCompiler(code) {
    const opts = {
        ecma: 7,
        compress: {
            passes: 2,
            ecma: 7,
        },
        output: {
            ecma: 7,
        },
    };
    const minifyResults = terser_1.default.minify(code, opts);
    if (minifyResults.error) {
        throw minifyResults.error;
    }
    return minifyResults.code;
}
