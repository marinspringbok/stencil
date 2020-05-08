"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function moduleDebugPlugin(opts) {
    return {
        name: 'moduleDebugPlugin',
        transform(code, id) {
            let debugPath = path_1.default.relative(opts.transpiledDir, id);
            debugPath = debugPath.replace(/\\/g, '/');
            const comment = `// MODULE: ${debugPath}\n`;
            return comment + code;
        },
    };
}
exports.moduleDebugPlugin = moduleDebugPlugin;
