"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vermoji_1 = require("./vermoji");
const fs_extra_1 = require("fs-extra");
function getOptions(rootDir, inputOpts = {}) {
    const srcDir = path_1.join(rootDir, 'src');
    const packageJsonPath = path_1.join(rootDir, 'package.json');
    const packageLockJsonPath = path_1.join(rootDir, 'package-lock.json');
    const changelogPath = path_1.join(rootDir, 'CHANGELOG.md');
    const nodeModulesDir = path_1.join(rootDir, 'node_modules');
    const transpiledDir = path_1.join(rootDir, 'build');
    const scriptsDir = path_1.join(rootDir, 'scripts');
    const scriptsBundlesDir = path_1.join(scriptsDir, 'bundles');
    const bundleHelpersDir = path_1.join(scriptsBundlesDir, 'helpers');
    const opts = {
        rootDir,
        srcDir,
        packageJsonPath,
        packageLockJsonPath,
        changelogPath,
        nodeModulesDir,
        transpiledDir,
        scriptsDir,
        scriptsBundlesDir,
        bundleHelpersDir,
        output: {
            cliDir: path_1.join(rootDir, 'cli'),
            compilerDir: path_1.join(rootDir, 'compiler'),
            devServerDir: path_1.join(rootDir, 'dev-server'),
            internalDir: path_1.join(rootDir, 'internal'),
            mockDocDir: path_1.join(rootDir, 'mock-doc'),
            screenshotDir: path_1.join(rootDir, 'screenshot'),
            sysNodeDir: path_1.join(rootDir, 'sys', 'node'),
            testingDir: path_1.join(rootDir, 'testing'),
        },
        packageJson: fs_extra_1.readJSONSync(packageJsonPath),
        version: null,
        buildId: null,
        isProd: false,
        isCI: false,
        isPublishRelease: false,
        vermoji: null,
        tag: 'dev'
    };
    Object.assign(opts, inputOpts);
    if (!opts.buildId) {
        opts.buildId = getBuildId();
    }
    if (!opts.version) {
        opts.version = '0.0.0-dev.' + opts.buildId;
    }
    if (opts.isPublishRelease) {
        if (!opts.isProd) {
            throw new Error('release must also be a prod build');
        }
    }
    if (!opts.vermoji) {
        if (opts.isProd) {
            opts.vermoji = vermoji_1.getVermoji(opts.changelogPath);
        }
        else {
            opts.vermoji = '💎';
        }
    }
    return opts;
}
exports.getOptions = getOptions;
function createReplaceData(opts) {
    const CACHE_BUSTER = 6;
    const typescriptPkg = require(path_1.join(opts.nodeModulesDir, 'typescript', 'package.json'));
    opts.typescriptVersion = typescriptPkg.version;
    const transpileId = typescriptPkg.name + typescriptPkg.version + '_' + CACHE_BUSTER;
    const terserPkg = require(path_1.join(opts.nodeModulesDir, 'terser', 'package.json'));
    opts.terserVersion = terserPkg.version;
    const minifyJsId = terserPkg.name + terserPkg.version + '_' + CACHE_BUSTER;
    const rollupPkg = require(path_1.join(opts.nodeModulesDir, 'rollup', 'package.json'));
    opts.rollupVersion = rollupPkg.version;
    const bundlerId = rollupPkg.name + rollupPkg.version + '_' + CACHE_BUSTER;
    const autoprefixerPkg = require(path_1.join(opts.nodeModulesDir, 'autoprefixer', 'package.json'));
    const postcssPkg = require(path_1.join(opts.nodeModulesDir, 'postcss', 'package.json'));
    const optimizeCssId = autoprefixerPkg.name + autoprefixerPkg.version + '_' + postcssPkg.name + postcssPkg.version + '_' + CACHE_BUSTER;
    return {
        '__BUILDID__': opts.buildId,
        '__BUILDID:BUNDLER__': bundlerId,
        '__BUILDID:MINIFYJS__': minifyJsId,
        '__BUILDID:OPTIMIZECSS__': optimizeCssId,
        '__BUILDID:TRANSPILE__': transpileId,
        '__VERSION:STENCIL__': opts.version,
        '__VERSION:ROLLUP__': rollupPkg.version,
        '__VERSION:TYPESCRIPT__': typescriptPkg.version,
        '__VERSION:TERSER__': terserPkg.version,
        '__VERMOJI__': opts.vermoji,
    };
}
exports.createReplaceData = createReplaceData;
function getBuildId() {
    const d = new Date();
    return [
        d.getUTCFullYear() + '',
        ('0' + (d.getUTCMonth() + 1)).slice(-2),
        ('0' + d.getUTCDate()).slice(-2),
        ('0' + d.getUTCHours()).slice(-2),
        ('0' + d.getUTCMinutes()).slice(-2),
        ('0' + d.getUTCSeconds()).slice(-2)
    ].join('');
}
