"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const glob_1 = __importDefault(require("glob"));
const webpack_1 = __importDefault(require("webpack"));
const terser_1 = __importDefault(require("terser"));
async function sysNode(opts) {
    const cachedDir = path_1.join(opts.transpiledDir, 'sys-node-bundle-cache');
    fs_extra_1.default.ensureDirSync(cachedDir);
    await Promise.all([
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'autoprefixer.js'),
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'graceful-fs.js'),
        bundleExternal(opts, opts.output.sysNodeDir, cachedDir, 'node-fetch.js'),
        bundleExternal(opts, opts.output.devServerDir, cachedDir, 'open-in-editor-api.js'),
        bundleExternal(opts, opts.output.devServerDir, cachedDir, 'ws.js'),
    ]);
    // open-in-editor's visualstudio.vbs file
    const visualstudioVbsSrc = path_1.join(opts.nodeModulesDir, 'open-in-editor', 'lib', 'editors', 'visualstudio.vbs');
    const visualstudioVbsDesc = path_1.join(opts.output.devServerDir, 'visualstudio.vbs');
    await fs_extra_1.default.copy(visualstudioVbsSrc, visualstudioVbsDesc);
    // copy open's xdg-open file
    const xdgOpenSrcPath = glob_1.default.sync('xdg-open', {
        cwd: path_1.join(opts.nodeModulesDir, 'open'),
        absolute: true,
    });
    if (xdgOpenSrcPath.length !== 1) {
        throw new Error(`cannot find xdg-open`);
    }
    const xdgOpenDestPath = path_1.join(opts.output.devServerDir, 'xdg-open');
    await fs_extra_1.default.copy(xdgOpenSrcPath[0], xdgOpenDestPath);
}
exports.sysNode = sysNode;
function bundleExternal(opts, outputDir, cachedDir, entryFileName) {
    return new Promise(async (resolveBundle, rejectBundle) => {
        const outputFile = path_1.join(outputDir, entryFileName);
        const cachedFile = path_1.join(cachedDir, entryFileName);
        if (!opts.isProd) {
            const cachedExists = fs_extra_1.default.existsSync(cachedFile);
            if (cachedExists) {
                await fs_extra_1.default.copyFile(cachedFile, outputFile);
                resolveBundle();
                return;
            }
        }
        const whitelist = new Set(['child_process', 'os', 'typescript']);
        webpack_1.default({
            entry: path_1.join(opts.srcDir, 'sys', 'node', 'bundles', entryFileName),
            output: {
                path: outputDir,
                filename: entryFileName,
                libraryTarget: 'commonjs',
            },
            target: 'node',
            node: {
                __dirname: false,
                __filename: false,
                process: false,
                Buffer: false,
            },
            externals(_context, request, callback) {
                if (request.match(/^(\.{0,2})\//)) {
                    // absolute and relative paths are not externals
                    return callback(null, undefined);
                }
                if (request === '@stencil/core/mock-doc') {
                    return callback(null, '../../mock-doc');
                }
                if (whitelist.has(request)) {
                    // we specifically do not want to bundle these imports
                    require.resolve(request);
                    return callback(null, request);
                }
                // bundle this import
                callback(undefined, undefined);
            },
            resolve: {
                alias: {
                    '@utils': path_1.join(opts.transpiledDir, 'utils', 'index.js'),
                    'postcss': path_1.join(opts.nodeModulesDir, 'postcss'),
                    'source-map': path_1.join(opts.nodeModulesDir, 'source-map'),
                    'chalk': path_1.join(opts.bundleHelpersDir, 'empty.js'),
                },
            },
            optimization: {
                minimize: false,
            },
            mode: 'production',
        }, async (err, stats) => {
            if (err && err.message) {
                rejectBundle(err);
            }
            else {
                const info = stats.toJson({ errors: true });
                if (stats.hasErrors()) {
                    const webpackError = info.errors.join('\n');
                    rejectBundle(webpackError);
                }
                else {
                    if (opts.isProd) {
                        let code = await fs_extra_1.default.readFile(outputFile, 'utf8');
                        const minifyResults = terser_1.default.minify(code);
                        if (minifyResults.error) {
                            rejectBundle(minifyResults.error);
                            return;
                        }
                        code = minifyResults.code;
                        await fs_extra_1.default.writeFile(outputFile, code);
                    }
                    else {
                        await fs_extra_1.default.copyFile(outputFile, cachedFile);
                    }
                    resolveBundle();
                }
            }
        });
    });
}
