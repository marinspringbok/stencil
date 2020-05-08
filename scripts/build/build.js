"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./bundles/cli");
const compiler_1 = require("./bundles/compiler");
const license_1 = require("./license");
const dev_server_1 = require("./bundles/dev-server");
const fs_extra_1 = require("fs-extra");
const internal_1 = require("./bundles/internal");
const mock_doc_1 = require("./bundles/mock-doc");
const release_1 = require("./release");
const screenshot_1 = require("./bundles/screenshot");
const sys_node_1 = require("./bundles/sys-node");
const testing_1 = require("./bundles/testing");
const validate_build_1 = require("./test/validate-build");
const rollup_1 = require("rollup");
async function run(rootDir, args) {
    try {
        if (args.includes('--release')) {
            await release_1.release(rootDir, args);
        }
        if (args.includes('--license')) {
            license_1.createLicense(rootDir);
        }
        if (args.includes('--validate-build')) {
            validate_build_1.validateBuild(rootDir);
        }
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
exports.run = run;
async function createBuild(opts) {
    await Promise.all([
        fs_extra_1.emptyDir(opts.output.cliDir),
        fs_extra_1.emptyDir(opts.output.compilerDir),
        fs_extra_1.emptyDir(opts.output.devServerDir),
        fs_extra_1.emptyDir(opts.output.internalDir),
        fs_extra_1.emptyDir(opts.output.mockDocDir),
        fs_extra_1.emptyDir(opts.output.sysNodeDir),
        fs_extra_1.emptyDir(opts.output.testingDir),
    ]);
    await sys_node_1.sysNode(opts);
    const bundles = await Promise.all([
        //
        cli_1.cli(opts),
        compiler_1.compiler(opts),
        dev_server_1.devServer(opts),
        internal_1.internal(opts),
        mock_doc_1.mockDoc(opts),
        screenshot_1.screenshot(opts),
        testing_1.testing(opts),
    ]);
    return bundles.reduce((b, bundle) => {
        b.push(...bundle);
        return b;
    }, []);
}
exports.createBuild = createBuild;
async function bundleBuild(opts) {
    const bundles = await createBuild(opts);
    await Promise.all(bundles.map(async (rollupOption) => {
        rollupOption.onwarn = () => { };
        const bundle = await rollup_1.rollup(rollupOption);
        if (Array.isArray(rollupOption.output)) {
            await Promise.all(rollupOption.output.map(async (output) => {
                await bundle.write(output);
            }));
        }
        else {
            await bundle.write(rollupOption.output);
        }
    }));
}
exports.bundleBuild = bundleBuild;
