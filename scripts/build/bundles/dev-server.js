"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const pluginutils_1 = require("@rollup/pluginutils");
const alias_plugin_1 = require("./plugins/alias-plugin");
const graceful_fs_plugin_1 = require("./plugins/graceful-fs-plugin");
const replace_plugin_1 = require("./plugins/replace-plugin");
const write_pkg_json_1 = require("../utils/write-pkg-json");
const terser_1 = __importDefault(require("terser"));
const typescript_1 = __importDefault(require("typescript"));
async function devServer(opts) {
    const inputDir = path_1.join(opts.transpiledDir, 'dev-server');
    // create public d.ts
    let dts = await fs_extra_1.default.readFile(path_1.join(inputDir, 'public.d.ts'), 'utf8');
    dts = dts.replace('@stencil/core/internal', '../internal/index');
    await fs_extra_1.default.writeFile(path_1.join(opts.output.devServerDir, 'index.d.ts'), dts);
    // write package.json
    write_pkg_json_1.writePkgJson(opts, opts.output.devServerDir, {
        name: '@stencil/core/dev-server',
        description: 'Stencil Development Server which communicates with the Stencil Compiler.',
        main: 'index.js',
        types: 'index.d.ts',
    });
    // copy static files
    await fs_extra_1.default.copy(path_1.join(opts.srcDir, 'dev-server', 'static'), path_1.join(opts.output.devServerDir, 'static'));
    // copy template files
    await fs_extra_1.default.copy(path_1.join(opts.srcDir, 'dev-server', 'templates'), path_1.join(opts.output.devServerDir, 'templates'));
    // create content-type-db.json
    await createContentTypeData(opts);
    const devServerBundle = {
        input: path_1.join(inputDir, 'index.js'),
        output: {
            format: 'cjs',
            file: path_1.join(opts.output.devServerDir, 'index.js'),
            esModule: false,
            preferConst: true,
        },
        external: ['assert', 'child_process', 'fs', 'os', 'path', 'util'],
        plugins: [
            graceful_fs_plugin_1.gracefulFsPlugin(),
            alias_plugin_1.aliasPlugin(opts),
            plugin_node_resolve_1.default({
                preferBuiltins: true,
            }),
            plugin_commonjs_1.default(),
        ],
    };
    const devServerWorkerBundle = {
        input: path_1.join(inputDir, 'server-worker.js'),
        output: {
            format: 'cjs',
            file: path_1.join(opts.output.devServerDir, 'server-worker.js'),
            esModule: false,
            preferConst: true,
        },
        external: ['assert', 'buffer', 'child_process', 'crypto', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'querystring', 'stream', 'url', 'util', 'zlib'],
        plugins: [
            {
                name: 'devServerWorkerResolverPlugin',
                resolveId(importee) {
                    if (importee.includes('open-in-editor-api')) {
                        return {
                            id: './open-in-editor-api.js',
                            external: true,
                        };
                    }
                    if (importee === 'ws') {
                        return {
                            id: './ws.js',
                            external: true,
                        };
                    }
                    return null;
                },
            },
            graceful_fs_plugin_1.gracefulFsPlugin(),
            alias_plugin_1.aliasPlugin(opts),
            plugin_node_resolve_1.default({
                preferBuiltins: true,
            }),
            plugin_commonjs_1.default(),
            replace_plugin_1.replacePlugin(opts),
        ],
    };
    function appErrorCssPlugin() {
        return {
            name: 'appErrorCss',
            resolveId(id) {
                if (id.endsWith('app-error.css')) {
                    return path_1.join(opts.srcDir, 'dev-server', 'client', 'app-error.css');
                }
                return null;
            },
            transform(code, id) {
                if (id.endsWith('.css')) {
                    code = code.replace(/\n/g, ' ').trim();
                    while (code.includes('  ')) {
                        code = code.replace(/  /g, ' ');
                    }
                    return pluginutils_1.dataToEsm(code, { preferConst: true });
                }
                return null;
            },
        };
    }
    const connectorName = 'connector.html';
    const connectorBundle = {
        input: path_1.join(inputDir, 'dev-server-client', 'index.js'),
        output: {
            format: 'cjs',
            file: path_1.join(opts.output.devServerDir, connectorName),
            strict: false,
            preferConst: true,
        },
        plugins: [
            {
                name: 'connectorPlugin',
                resolveId(id) {
                    if (id === '@stencil/core/dev-server/client') {
                        return path_1.join(inputDir, 'client', 'index.js');
                    }
                },
            },
            appErrorCssPlugin(),
            {
                name: 'clientConnectorPlugin',
                generateBundle(_options, bundle) {
                    if (bundle[connectorName]) {
                        let code = bundle[connectorName].code;
                        const tsResults = typescript_1.default.transpileModule(code, {
                            compilerOptions: {
                                target: typescript_1.default.ScriptTarget.ES5,
                            },
                        });
                        if (tsResults.diagnostics.length > 0) {
                            throw new Error(tsResults.diagnostics);
                        }
                        code = tsResults.outputText;
                        code = intro + code + outro;
                        if (opts.isProd) {
                            const minifyResults = terser_1.default.minify(code, {
                                compress: { hoist_vars: true, hoist_funs: true, ecma: 5 },
                                output: { ecma: 5 },
                            });
                            if (minifyResults.error) {
                                throw minifyResults.error;
                            }
                            code = minifyResults.code;
                        }
                        code = banner + code + footer;
                        code = code.replace(/__VERSION:STENCIL__/g, opts.version);
                        bundle[connectorName].code = code;
                    }
                },
            },
            replace_plugin_1.replacePlugin(opts),
            plugin_node_resolve_1.default(),
        ],
    };
    await fs_extra_1.default.ensureDir(path_1.join(opts.output.devServerDir, 'client'));
    // copy dev server client dts files
    await fs_extra_1.default.copy(path_1.join(opts.transpiledDir, 'dev-server', 'client'), path_1.join(opts.output.devServerDir, 'client'), {
        filter: src => {
            if (src.endsWith('.d.ts')) {
                return true;
            }
            const stats = fs_extra_1.default.statSync(src);
            if (stats.isDirectory()) {
                return true;
            }
            return false;
        },
    });
    // write package.json
    write_pkg_json_1.writePkgJson(opts, path_1.join(opts.output.devServerDir, 'client'), {
        name: '@stencil/core/dev-server/client',
        description: 'Stencil Dev Server Client.',
        main: 'index.mjs',
        types: 'index.d.ts',
    });
    const devServerClientBundle = {
        input: path_1.join(opts.transpiledDir, 'dev-server', 'client', 'index.js'),
        output: {
            format: 'esm',
            file: path_1.join(opts.output.devServerDir, 'client', 'index.mjs'),
        },
        plugins: [appErrorCssPlugin(), replace_plugin_1.replacePlugin(opts), plugin_node_resolve_1.default()],
    };
    return [devServerBundle, devServerWorkerBundle, connectorBundle, devServerClientBundle];
}
exports.devServer = devServer;
async function createContentTypeData(opts) {
    // create a focused content-type lookup object from
    // the mime db json file
    const mimeDbSrcPath = path_1.join(opts.nodeModulesDir, 'mime-db', 'db.json');
    const mimeDbJson = await fs_extra_1.default.readJson(mimeDbSrcPath);
    const contentTypeDestPath = path_1.join(opts.output.devServerDir, 'content-type-db.json');
    const exts = {};
    Object.keys(mimeDbJson).forEach(mimeType => {
        const mimeTypeData = mimeDbJson[mimeType];
        if (Array.isArray(mimeTypeData.extensions)) {
            mimeTypeData.extensions.forEach(ext => {
                exts[ext] = mimeType;
            });
        }
    });
    await fs_extra_1.default.writeJson(contentTypeDestPath, exts);
}
const banner = `<!doctype html><html><head><meta charset="utf-8"><style>body{background:black;color:white;font:18px monospace;text-align:center}</style></head><body>

Stencil Dev Server Connector __VERSION:STENCIL__ &#9889;

<script>`;
const intro = `(function(iframeWindow, appWindow, config, exports) {
"use strict";
`;
const outro = `
document.title = document.body.innerText;
})(window, window.parent, window.__DEV_CLIENT_CONFIG__, {});
`;
const footer = `\n</script></body></html>`;
