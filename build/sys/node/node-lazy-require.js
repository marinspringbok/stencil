import { dirname } from 'path';
import { readFile } from 'graceful-fs';
import { spawn } from 'child_process';
import semiver from 'semiver';
export class NodeLazyRequire {
    constructor(nodeResolveModule, lazyDependencies) {
        this.nodeResolveModule = nodeResolveModule;
        this.lazyDependencies = lazyDependencies;
        this.moduleData = new Map();
    }
    async ensure(logger, fromDir, ensureModuleIds) {
        const depsToInstall = [];
        let isUpdate = false;
        const promises = ensureModuleIds.map(async (ensureModuleId) => {
            const existingModuleData = this.moduleData.get(ensureModuleId);
            if (existingModuleData && existingModuleData.fromDir && existingModuleData.modulePath) {
                return;
            }
            const [minVersion, maxVersion] = this.lazyDependencies[ensureModuleId];
            try {
                const resolvedPkgJsonPath = this.nodeResolveModule.resolveModule(fromDir, ensureModuleId);
                const installedPkgJson = await readPackageJson(resolvedPkgJsonPath);
                isUpdate = true;
                if (semiver(installedPkgJson.version, minVersion) >= 0) {
                    this.moduleData.set(ensureModuleId, {
                        fromDir: fromDir,
                        modulePath: dirname(resolvedPkgJsonPath),
                    });
                    return;
                }
            }
            catch (e) { }
            depsToInstall.push({
                moduleId: ensureModuleId,
                requiredVersionRange: maxVersion,
            });
        });
        await Promise.all(promises);
        if (depsToInstall.length === 0) {
            return Promise.resolve();
        }
        const msg = `Please wait while required dependencies are ${isUpdate ? `updated` : `installed`}. This may take a few moments and will only be required for the initial run.`;
        logger.info(logger.magenta(msg));
        const moduleIds = depsToInstall.map(dep => dep.moduleId);
        const timeSpan = logger.createTimeSpan(`installing dependenc${moduleIds.length > 1 ? 'ies' : 'y'}: ${moduleIds.join(', ')}`);
        try {
            const installModules = depsToInstall.map(dep => {
                let moduleId = dep.moduleId;
                if (dep.requiredVersionRange) {
                    moduleId += '@' + dep.requiredVersionRange;
                }
                return moduleId;
            });
            await npmInstall(logger, fromDir, installModules);
            depsToInstall.forEach(installedDep => {
                this.moduleData.set(installedDep.moduleId, {
                    fromDir: fromDir,
                    modulePath: null,
                });
            });
            timeSpan.finish(`installing dependencies finished`);
        }
        catch (e) {
            logger.error(`lazy require failed: ${e}`);
        }
    }
    require(moduleId) {
        const moduleData = this.moduleData.get(moduleId);
        if (!moduleData) {
            throw new Error(`lazy required module has not been ensured: ${moduleId}`);
        }
        if (!moduleData.modulePath) {
            const modulePkgJsonPath = this.nodeResolveModule.resolveModule(moduleData.fromDir, moduleId);
            moduleData.modulePath = dirname(modulePkgJsonPath);
            this.moduleData.set(moduleId, moduleData);
        }
        return require(moduleData.modulePath);
    }
    getModulePath(moduleId) {
        const moduleData = this.moduleData.get(moduleId);
        if (!moduleData) {
            throw new Error(`lazy required module has not been ensured: ${moduleId}`);
        }
        if (!moduleData.modulePath) {
            const modulePkgJsonPath = this.nodeResolveModule.resolveModule(moduleData.fromDir, moduleId);
            moduleData.modulePath = dirname(modulePkgJsonPath);
            this.moduleData.set(moduleId, moduleData);
        }
        return moduleData.modulePath;
    }
}
function npmInstall(logger, fromDir, moduleIds) {
    return new Promise((resolve, reject) => {
        const cmd = 'npm';
        const args = ['install', ...moduleIds, '--no-audit', '--save-exact', '--save-dev'];
        const opts = {
            shell: true,
            cwd: fromDir,
            env: Object.assign({}, process.env),
        };
        opts.env.NODE_ENV = 'development';
        if (logger.level === 'debug') {
            args.push('--verbose');
        }
        logger.debug(`${cmd} ${args.join(' ')}`);
        logger.debug(`${cmd}, cwd: ${fromDir}`);
        const childProcess = spawn(cmd, args, opts);
        let output = '';
        if (childProcess.stdout) {
            childProcess.stdout.setEncoding('utf8');
            childProcess.stdout.on('data', data => {
                output += data;
            });
        }
        if (childProcess.stderr) {
            childProcess.stderr.setEncoding('utf8');
            childProcess.stderr.on('data', data => {
                output += data;
            });
        }
        childProcess.once('exit', exitCode => {
            if (logger.level === 'debug') {
                logger.debug(`${cmd}, exit ${exitCode}`);
            }
            if (exitCode === 0) {
                resolve();
            }
            else {
                reject(`failed to install: ${moduleIds.join(', ')}${output ? ', ' + output : ''}`);
            }
        });
    });
}
function readPackageJson(pkgJsonPath) {
    return new Promise((resolve, reject) => {
        readFile(pkgJsonPath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                try {
                    resolve(JSON.parse(data));
                }
                catch (e) {
                    reject(e);
                }
            }
        });
    });
}
