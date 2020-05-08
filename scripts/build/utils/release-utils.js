"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const semver_1 = __importDefault(require("semver"));
exports.SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
exports.PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];
exports.isValidVersion = (input) => Boolean(semver_1.default.valid(input));
exports.isValidVersionInput = (input) => exports.SEMVER_INCREMENTS.indexOf(input) !== -1 || exports.isValidVersion(input);
exports.isPrereleaseVersion = (version) => exports.PRERELEASE_VERSIONS.indexOf(version) !== -1 || Boolean(semver_1.default.prerelease(version));
function getNewVersion(oldVersion, input) {
    if (!exports.isValidVersionInput(input)) {
        throw new Error(`Version should be either ${exports.SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
    }
    return exports.SEMVER_INCREMENTS.indexOf(input) === -1 ? input : semver_1.default.inc(oldVersion, input);
}
exports.getNewVersion = getNewVersion;
;
exports.isVersionGreater = (oldVersion, newVersion) => {
    if (!exports.isValidVersion(newVersion)) {
        throw new Error('Version should be a valid semver version.');
    }
    return semver_1.default.gt(newVersion, oldVersion);
};
function prettyVersionDiff(oldVersion, inc) {
    const newVersion = getNewVersion(oldVersion, inc).split('.');
    oldVersion = oldVersion.split('.');
    let firstVersionChange = false;
    const output = [];
    for (let i = 0; i < newVersion.length; i++) {
        if ((newVersion[i] !== oldVersion[i] && !firstVersionChange)) {
            output.push(`${ansi_colors_1.default.dim.cyan(newVersion[i])}`);
            firstVersionChange = true;
        }
        else if (newVersion[i].indexOf('-') >= 1) {
            let preVersion = [];
            preVersion = newVersion[i].split('-');
            output.push(`${ansi_colors_1.default.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
        }
        else {
            output.push(ansi_colors_1.default.reset.dim(newVersion[i]));
        }
    }
    return output.join(ansi_colors_1.default.reset.dim('.'));
}
exports.prettyVersionDiff = prettyVersionDiff;
