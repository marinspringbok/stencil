export function buildJestArgv(config) {
    const yargs = require('yargs');
    const args = [...config.flags.unknownArgs.slice(), ...config.flags.knownArgs.slice()];
    if (!args.some(a => a.startsWith('--max-workers') || a.startsWith('--maxWorkers'))) {
        args.push(`--max-workers=${config.maxConcurrentWorkers}`);
    }
    if (config.flags.devtools) {
        args.push('--runInBand');
    }
    config.logger.info(config.logger.magenta(`jest args: ${args.join(' ')}`));
    const { options } = require('jest-cli/build/cli/args');
    const jestArgv = yargs(args).options(options).argv;
    jestArgv.config = buildJestConfig(config);
    if (typeof jestArgv.maxWorkers === 'string') {
        try {
            jestArgv.maxWorkers = parseInt(jestArgv.maxWorkers, 10);
        }
        catch (e) { }
    }
    if (typeof jestArgv.ci === 'string') {
        jestArgv.ci = jestArgv.ci === 'true' || jestArgv.ci === '';
    }
    return jestArgv;
}
export function buildJestConfig(config) {
    const jestDefaults = require('jest-config').defaults;
    const validJestConfigKeys = Object.keys(jestDefaults);
    const jestConfig = {};
    Object.keys(config.testing).forEach(key => {
        if (validJestConfigKeys.includes(key)) {
            jestConfig[key] = config.testing[key];
        }
    });
    jestConfig.rootDir = config.rootDir;
    if (Array.isArray(config.testing.reporters)) {
        jestConfig.reporters = config.testing.reporters;
    }
    return JSON.stringify(jestConfig);
}
export function getProjectListFromCLIArgs(config, argv) {
    const projects = argv.projects ? argv.projects : [];
    projects.push(config.rootDir);
    return projects;
}
