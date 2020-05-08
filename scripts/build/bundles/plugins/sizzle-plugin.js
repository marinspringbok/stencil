"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
function sizzlePlugin(opts) {
    return {
        name: 'sizzlePlugin',
        resolveId(id) {
            if (id === 'sizzle') {
                return id;
            }
            return null;
        },
        async load(id) {
            if (id !== 'sizzle') {
                return null;
            }
            const f = opts.isProd ? 'sizzle.min.js' : 'sizzle.js';
            const sizzlePath = path_1.join(opts.nodeModulesDir, 'sizzle', 'dist', f);
            const sizzleContent = await fs_extra_1.default.readFile(sizzlePath, 'utf8');
            return getSizzleBundle(sizzleContent);
        },
    };
}
exports.sizzlePlugin = sizzlePlugin;
function getSizzleBundle(content) {
    return `export default (function() {

const window = {
  document: {
    createElement() {
      return {};
    },
    nodeType: 9,
    documentElement: {
      nodeType: 1,
      nodeName: 'HTML'
    }
  }
};

const module = { exports: {} };

${content}

return module.exports;
})();
`;
}
