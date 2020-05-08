"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const options_1 = require("../../utils/options");
function replacePlugin(opts) {
    const replaceData = options_1.createReplaceData(opts);
    return plugin_replace_1.default(replaceData);
}
exports.replacePlugin = replacePlugin;
