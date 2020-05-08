"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function aliasPlugin(opts) {
    const alias = new Map([
        ['@app-data', '@stencil/core/internal/app-data'],
        ['@app-globals', '@stencil/core/internal/app-globals'],
        ['@hydrate-factory', '@stencil/core/hydrate-factory'],
        ['@stencil/core/mock-doc', '@stencil/core/mock-doc'],
        ['@stencil/core/testing', '@stencil/core/testing'],
    ]);
    // ensure we use the same one
    const helperResolvers = new Set(['is-resolvable', 'path-is-absolute']);
    // ensure we use the same one
    const nodeResolvers = new Map([['source-map', path_1.join(opts.nodeModulesDir, 'source-map', 'source-map.js')]]);
    const empty = new Set([
        // we never use chalk, but many projects still pull it in
        'chalk',
    ]);
    return {
        name: 'aliasPlugin',
        resolveId(id) {
            const externalId = alias.get(id);
            if (externalId) {
                return {
                    id: externalId,
                    external: true,
                };
            }
            if (id === '@runtime') {
                return path_1.join(opts.transpiledDir, 'runtime', 'index.js');
            }
            if (id === '@utils') {
                return path_1.join(opts.transpiledDir, 'utils', 'index.js');
            }
            if (helperResolvers.has(id)) {
                return path_1.join(opts.bundleHelpersDir, `${id}.js`);
            }
            if (empty.has(id)) {
                return path_1.join(opts.bundleHelpersDir, 'empty.js');
            }
            if (nodeResolvers.has(id)) {
                return nodeResolvers.get(id);
            }
            return null;
        },
    };
}
exports.aliasPlugin = aliasPlugin;
