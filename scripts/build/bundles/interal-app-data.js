"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const write_pkg_json_1 = require("../utils/write-pkg-json");
async function internalAppData(opts) {
    const inputAppDataDir = path_1.join(opts.transpiledDir, 'app-data');
    const outputInternalAppDataDir = path_1.join(opts.output.internalDir, 'app-data');
    await fs_extra_1.default.emptyDir(outputInternalAppDataDir);
    // copy @stencil/core/internal/app-data/index.d.ts
    await fs_extra_1.default.copyFile(path_1.join(inputAppDataDir, 'index.d.ts'), path_1.join(outputInternalAppDataDir, 'index.d.ts'));
    // write @stencil/core/internal/app-data/package.json
    write_pkg_json_1.writePkgJson(opts, outputInternalAppDataDir, {
        name: '@stencil/core/internal/app-data',
        description: 'Used for default app data and build conditionals within builds.',
        main: 'index.js',
        module: 'index.mjs',
        types: 'index.d.ts',
    });
    const internalAppDataBundle = {
        input: {
            index: path_1.join(inputAppDataDir, 'index.js'),
        },
        output: [
            {
                format: 'esm',
                dir: outputInternalAppDataDir,
                entryFileNames: '[name].mjs',
            },
            {
                format: 'cjs',
                dir: outputInternalAppDataDir,
                entryFileNames: '[name].js',
                esModule: false,
            },
        ],
    };
    return internalAppDataBundle;
}
exports.internalAppData = internalAppData;
