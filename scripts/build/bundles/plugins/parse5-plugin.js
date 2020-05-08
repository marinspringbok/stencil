"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const alias_plugin_1 = require("./alias-plugin");
const path_1 = require("path");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
const rollup_1 = require("rollup");
const terser_1 = __importDefault(require("terser"));
function parse5Plugin(opts) {
    return {
        name: 'parse5Plugin',
        resolveId(id) {
            if (id === 'parse5') {
                return id;
            }
            return null;
        },
        async load(id) {
            if (id === 'parse5') {
                return await bundleParse5(opts);
            }
            return null;
        },
        generateBundle(_, bundle) {
            Object.keys(bundle).forEach(fileName => {
                // not minifying, but we are reducing whitespace
                const chunk = bundle[fileName];
                if (chunk.type === 'chunk') {
                    chunk.code = chunk.code.replace(/    /g, '  ');
                }
            });
        },
    };
}
exports.parse5Plugin = parse5Plugin;
async function bundleParse5(opts) {
    const cacheFile = path_1.join(opts.transpiledDir, 'parse5-bundle-cache.js');
    try {
        return await fs_extra_1.default.readFile(cacheFile, 'utf8');
    }
    catch (e) { }
    const rollupBuild = await rollup_1.rollup({
        input: '@parse5-entry',
        plugins: [
            {
                name: 'parse5EntryPlugin',
                resolveId(id) {
                    if (id === '@parse5-entry') {
                        return id;
                    }
                    return null;
                },
                load(id) {
                    if (id === '@parse5-entry') {
                        return `export { parse, parseFragment } from 'parse5';`;
                    }
                    return null;
                },
            },
            alias_plugin_1.aliasPlugin(opts),
            plugin_node_resolve_1.default(),
            plugin_commonjs_1.default(),
        ],
    });
    const { output } = await rollupBuild.generate({
        format: 'iife',
        name: 'EXPORT_PARSE5',
        footer: `
      export function parse(html, options) {
        return parse5.parse(html, options);
      }
      export function parseFragment(html, options) {
        return parse5.parseFragment(html, options);
      }
    `,
    });
    let code = output[0].code;
    const minify = terser_1.default.minify(code);
    code = minify.code.replace('var EXPORT_PARSE5=function', 'const parse5=/*@__PURE__*/function');
    await fs_extra_1.default.writeFile(cacheFile, code);
    return code;
}
