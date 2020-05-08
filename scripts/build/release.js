"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const execa_1 = __importDefault(require("execa"));
const inquirer_1 = __importDefault(require("inquirer"));
const options_1 = require("./utils/options");
const release_tasks_1 = require("./release-tasks");
const path_1 = require("path");
const release_utils_1 = require("./utils/release-utils");
async function release(rootDir, args) {
    const buildDir = path_1.join(rootDir, 'build');
    const releaseDataPath = path_1.join(buildDir, 'release-data.json');
    if (args.includes('--prepare')) {
        await fs_extra_1.default.emptyDir(buildDir);
        const opts = options_1.getOptions(rootDir, {
            isPublishRelease: false,
            isProd: true,
        });
        return prepareRelease(opts, args, releaseDataPath);
    }
    if (args.includes('--publish')) {
        const releaseData = await fs_extra_1.default.readJson(releaseDataPath);
        const opts = options_1.getOptions(rootDir, {
            buildId: releaseData.buildId,
            version: releaseData.version,
            vermoji: releaseData.vermoji,
            isCI: releaseData.isCI,
            isPublishRelease: true,
            isProd: true,
        });
        return publishRelease(opts, args);
    }
}
exports.release = release;
async function prepareRelease(opts, args, releaseDataPath) {
    const pkg = opts.packageJson;
    const oldVersion = opts.packageJson.version;
    console.log(`\nPrepare to publish ${opts.vermoji}  ${ansi_colors_1.default.bold.magenta(pkg.name)} ${ansi_colors_1.default.dim(`(currently ${oldVersion})`)}\n`);
    const prompts = [
        {
            type: 'list',
            name: 'version',
            message: 'Select semver increment or specify new version',
            pageSize: release_utils_1.SEMVER_INCREMENTS.length + 2,
            choices: release_utils_1.SEMVER_INCREMENTS.map(inc => ({
                name: `${inc}   ${release_utils_1.prettyVersionDiff(oldVersion, inc)}`,
                value: inc,
            })).concat([
                new inquirer_1.default.Separator(),
                {
                    name: 'Dry Run',
                    value: release_utils_1.getNewVersion(oldVersion, 'patch') + '-dryrun',
                },
                {
                    name: 'Other (specify)',
                    value: null,
                },
            ]),
            filter: (input) => (release_utils_1.isValidVersionInput(input) ? release_utils_1.getNewVersion(oldVersion, input) : input),
        },
        {
            type: 'input',
            name: 'version',
            message: 'Version',
            when: (answers) => !answers.version,
            filter: (input) => (release_utils_1.isValidVersionInput(input) ? release_utils_1.getNewVersion(pkg.version, input) : input),
            validate: (input) => {
                if (!release_utils_1.isValidVersionInput(input)) {
                    return 'Please specify a valid semver, for example, `1.2.3`. See http://semver.org';
                }
                return true;
            },
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => {
                return `Prepare release ${opts.vermoji}  ${ansi_colors_1.default.yellow(answers.version)} from ${oldVersion}. Continue?`;
            },
        },
    ];
    await inquirer_1.default
        .prompt(prompts)
        .then(answers => {
        if (answers.confirm) {
            opts.version = answers.version;
            fs_extra_1.default.writeJsonSync(releaseDataPath, opts, { spaces: 2 });
            release_tasks_1.runReleaseTasks(opts, args);
        }
    })
        .catch(err => {
        console.log('\n', ansi_colors_1.default.red(err), '\n');
        process.exit(0);
    });
}
async function publishRelease(opts, args) {
    const pkg = opts.packageJson;
    if (opts.version !== pkg.version) {
        throw new Error('Prepare release data and package.json versions do not match. Try re-running release prepare.');
    }
    console.log(`\nPublish ${opts.vermoji}  ${ansi_colors_1.default.bold.magenta(pkg.name)} ${ansi_colors_1.default.yellow(`${opts.version}`)}\n`);
    const prompts = [
        {
            type: 'list',
            name: 'tag',
            message: 'How should this pre-release version be tagged in npm?',
            when: () => release_utils_1.isPrereleaseVersion(opts.version),
            choices: () => execa_1.default('npm', ['view', '--json', pkg.name, 'dist-tags']).then(({ stdout }) => {
                const existingPrereleaseTags = Object.keys(JSON.parse(stdout))
                    .filter(tag => tag !== 'latest')
                    .map(tag => {
                    return {
                        name: tag,
                        value: tag,
                    };
                });
                if (existingPrereleaseTags.length === 0) {
                    existingPrereleaseTags.push({
                        name: 'next',
                        value: 'next',
                    });
                }
                return existingPrereleaseTags.concat([
                    new inquirer_1.default.Separator(),
                    {
                        name: 'Other (specify)',
                        value: null,
                    },
                ]);
            }),
        },
        {
            type: 'input',
            name: 'tag',
            message: 'Tag',
            when: (answers) => !pkg.private && release_utils_1.isPrereleaseVersion(opts.version) && !answers.tag,
            validate: (input) => {
                if (input.length === 0) {
                    return 'Please specify a tag, for example, `next`.';
                }
                else if (input.toLowerCase() === 'latest') {
                    return 'It\'s not possible to publish pre-releases under the `latest` tag. Please specify something else, for example, `next`.';
                }
                return true;
            },
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => {
                opts.tag = answers.tag;
                const tagPart = opts.tag ? ` and tag this release in npm as ${ansi_colors_1.default.yellow(opts.tag)}` : '';
                return `Will publish ${opts.vermoji}  ${ansi_colors_1.default.yellow(opts.version)}${tagPart}. Continue?`;
            },
        },
    ];
    await inquirer_1.default
        .prompt(prompts)
        .then(answers => {
        if (answers.confirm) {
            release_tasks_1.runReleaseTasks(opts, args);
        }
    })
        .catch(err => {
        console.log('\n', ansi_colors_1.default.red(err), '\n');
        process.exit(0);
    });
}
