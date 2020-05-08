"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function urlPlugin(opts) {
    return {
        name: 'urlPlugin',
        resolveId(id) {
            if (id === 'url') {
                return path_1.join(opts.bundleHelpersDir, 'url.js');
            }
            return null;
        },
    };
}
exports.urlPlugin = urlPlugin;
