"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const modules = new Set(['crypto', 'events', 'fs', 'module', 'os', 'path', 'stream', 'typescript', 'url', 'util']);
function sysModulesPlugin(inputDir) {
    return {
        name: 'sysModulesPlugin',
        resolveId(importee) {
            if (modules.has(importee)) {
                return path_1.default.join(inputDir, 'sys', 'modules', `${importee}.js`);
            }
            return null;
        },
    };
}
exports.sysModulesPlugin = sysModulesPlugin;
