"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function writePkgJson(opts, pkgDir, pkgData) {
    pkgData.version = opts.version;
    pkgData.private = true;
    // idk, i just like a nice pretty standardized order of package.json properties
    const formatedPkg = {};
    PROPS_ORDER.forEach(pkgProp => {
        if (pkgProp in pkgData) {
            formatedPkg[pkgProp] = pkgData[pkgProp];
        }
    });
    fs_extra_1.default.writeFileSync(path_1.default.join(pkgDir, 'package.json'), JSON.stringify(formatedPkg, null, 2) + '\n');
}
exports.writePkgJson = writePkgJson;
const PROPS_ORDER = [
    'name', 'version', 'description', 'main', 'module', 'browser', 'types', 'private'
];
