'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const child_process = require('child_process');
const child_process__default = _interopDefault(child_process);
const path = _interopDefault(require('path'));
const util = _interopDefault(require('util'));
const fs = _interopDefault(require('fs'));
const os = _interopDefault(require('os'));

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isWsl_1 = createCommonjsModule(function (module) {



const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().toLowerCase().includes('microsoft')) {
		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
	} catch (_) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}
});

let isDocker;

function hasDockerEnv() {
	try {
		fs.statSync('/.dockerenv');
		return true;
	} catch (_) {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch (_) {
		return false;
	}
}

var isDocker_1 = () => {
	if (isDocker === undefined) {
		isDocker = hasDockerEnv() || hasDockerCGroup();
	}

	return isDocker;
};

const {promisify} = util;






const pAccess = promisify(fs.access);
const pExecFile = promisify(child_process__default.execFile);

// Path to included `xdg-open`.
const localXdgOpenPath = path.join(__dirname, 'xdg-open');

// Convert a path from WSL format to Windows format:
// `/mnt/c/Program Files/Example/MyApp.exe` → `C:\Program Files\Example\MyApp.exe`
const wslToWindowsPath = async path => {
	const {stdout} = await pExecFile('wslpath', ['-w', path]);
	return stdout.trim();
};

var open = async (target, options) => {
	if (typeof target !== 'string') {
		throw new TypeError('Expected a `target`');
	}

	options = {
		wait: false,
		background: false,
		url: false,
		...options
	};

	let command;
	let appArguments = [];
	const cliArguments = [];
	const childProcessOptions = {};

	if (Array.isArray(options.app)) {
		appArguments = options.app.slice(1);
		options.app = options.app[0];
	}

	// Encodes the target as if it were an URL. Especially useful to get
	// double-quotes through the “double-quotes on Windows caveat”, but it
	// can be used on any platform.
	if (options.url) {
		target = encodeURI(target);

		if (isWsl_1) {
			target = target.replace(/&/g, '^&');
		}
	}

	if (process.platform === 'darwin') {
		command = 'open';

		if (options.wait) {
			cliArguments.push('--wait-apps');
		}

		if (options.background) {
			cliArguments.push('--background');
		}

		if (options.app) {
			cliArguments.push('-a', options.app);
		}
	} else if (process.platform === 'win32' || (isWsl_1 && !isDocker_1())) {
		command = 'cmd' + (isWsl_1 ? '.exe' : '');
		cliArguments.push('/s', '/c', 'start', '""', '/b');

		if (!isWsl_1) {
			// Always quoting target allows for URLs/paths to have spaces and unmarked characters, as `cmd.exe` will
			// interpret them as plain text to be forwarded as one unique argument. Enabling `windowsVerbatimArguments`
			// disables Node.js's default quotes and escapes handling (https://git.io/fjdem).
			// References:
			// - Issues #17, #44, #55, #77, #101, #115
			// - Pull requests: #74, #98
			//
			// As a result, all double-quotes are stripped from the `target` and do not get to your desired destination.
			target = `"${target}"`;
			childProcessOptions.windowsVerbatimArguments = true;

			if (options.app) {
				options.app = `"${options.app}"`;
			}
		}

		if (options.wait) {
			cliArguments.push('/wait');
		}

		if (options.app) {
			if (isWsl_1 && options.app.startsWith('/mnt/')) {
				const windowsPath = await wslToWindowsPath(options.app);
				options.app = windowsPath;
			}

			cliArguments.push(options.app);
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}
	} else {
		if (options.app) {
			command = options.app;
		} else {
			// When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
			const isBundled = !__dirname || __dirname === '/';

			// Check if local `xdg-open` exists and is executable.
			let exeLocalXdgOpen = false;
			try {
				await pAccess(localXdgOpenPath, fs.constants.X_OK);
				exeLocalXdgOpen = true;
			} catch (_) {}

			const useSystemXdgOpen = process.versions.electron ||
				process.platform === 'android' || isBundled || !exeLocalXdgOpen;
			command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}

		if (!options.wait) {
			// `xdg-open` will block the process unless stdio is ignored
			// and it's detached from the parent even if it's unref'd.
			childProcessOptions.stdio = 'ignore';
			childProcessOptions.detached = true;
		}
	}

	cliArguments.push(target);

	if (process.platform === 'darwin' && appArguments.length > 0) {
		cliArguments.push('--args', ...appArguments);
	}

	const subprocess = child_process__default.spawn(command, cliArguments, childProcessOptions);

	if (options.wait) {
		return new Promise((resolve, reject) => {
			subprocess.once('error', reject);

			subprocess.once('close', exitCode => {
				if (exitCode > 0) {
					reject(new Error(`Exited with code ${exitCode}`));
					return;
				}

				resolve(subprocess);
			});
		});
	}

	subprocess.unref();

	return subprocess;
};

async function startServer(stencilDevServerConfig, logger, watcher) {
    let devServer = null;
    const devServerConfig = Object.assign({}, stencilDevServerConfig);
    const timespan = logger.createTimeSpan(`starting dev server`, true);
    try {
        // using the path stuff below because after the the bundles are created
        // then these files are no longer relative to how they are in the src directory
        devServerConfig.devServerDir = __dirname;
        // get the path of the dev server module
        const workerPath = require.resolve(path.join(devServerConfig.devServerDir, 'server-worker.js'));
        const filteredExecArgs = process.execArgv.filter(v => !/^--(debug|inspect)/.test(v));
        const forkOpts = {
            execArgv: filteredExecArgs,
            env: process.env,
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        };
        // start a new child process of the CLI process
        // for the http and web socket server
        const serverProcess = child_process.fork(workerPath, [], forkOpts);
        const devServerContext = {
            isActivelyBuilding: false,
            lastBuildResults: null,
        };
        const starupDevServerConfig = await startWorkerServer(devServerConfig, logger, watcher, serverProcess, devServerContext);
        let removeWatcher = null;
        if (watcher) {
            removeWatcher = watcher.on((eventName, data) => {
                emitMessageToClient(serverProcess, devServerContext, eventName, data);
            });
        }
        devServer = {
            address: starupDevServerConfig.address,
            basePath: starupDevServerConfig.basePath,
            browserUrl: starupDevServerConfig.browserUrl,
            port: starupDevServerConfig.port,
            protocol: starupDevServerConfig.protocol,
            root: starupDevServerConfig.root,
            close() {
                try {
                    if (serverProcess) {
                        serverProcess.kill('SIGINT');
                    }
                    if (removeWatcher) {
                        removeWatcher();
                        removeWatcher = null;
                    }
                }
                catch (e) { }
                logger.debug(`dev server closed, port ${starupDevServerConfig.port}`);
                return Promise.resolve();
            },
            emit(eventName, data) {
                emitMessageToClient(serverProcess, devServerContext, eventName, data);
            },
        };
        timespan.finish(`dev server started: ${starupDevServerConfig.browserUrl}`);
    }
    catch (e) {
        console.error(`dev server error: ${e}`);
    }
    return devServer;
}
function startWorkerServer(devServerConfig, logger, watcher, serverProcess, devServerContext) {
    let hasStarted = false;
    return new Promise((resolve, reject) => {
        serverProcess.stdout.on('data', (data) => {
            // the child server process has console logged data
            logger.debug(`dev server: ${data}`);
        });
        serverProcess.stderr.on('data', (data) => {
            // the child server process has console logged an error
            logger.error(`dev server error: ${data}, hasStarted: ${hasStarted}`);
            if (!hasStarted) {
                reject(`dev server error: ${data}`);
            }
        });
        serverProcess.on('message', async (msg) => {
            // main process has received a message from the child server process
            if (msg.serverStarted) {
                if (msg.serverStarted.error) {
                    // error!
                    reject(msg.serverStarted.error);
                }
                else {
                    hasStarted = true;
                    // received a message from the child process that the server has successfully started
                    if (devServerConfig.openBrowser && msg.serverStarted.initialLoadUrl) {
                        openInBrowser({ url: msg.serverStarted.initialLoadUrl });
                    }
                    // resolve that everything is good to go
                    resolve(msg.serverStarted);
                }
                return;
            }
            if (msg.requestBuildResults) {
                // we received a request to send up the latest build results
                if (devServerContext.lastBuildResults != null) {
                    // we do have build results, so let's send them to the child process
                    // but don't send any previous live reload data
                    const msg = {
                        buildResults: Object.assign({}, devServerContext.lastBuildResults),
                        isActivelyBuilding: devServerContext.isActivelyBuilding,
                    };
                    delete msg.buildResults.hmr;
                    serverProcess.send(msg);
                }
                else {
                    const msg = {
                        isActivelyBuilding: true,
                    };
                    serverProcess.send(msg);
                }
                return;
            }
            if (msg.compilerRequestPath && watcher && watcher.request) {
                const rspMsg = {
                    resolveId: msg.resolveId,
                    compilerRequestResults: await watcher.request({
                        path: msg.compilerRequestPath,
                    }),
                };
                serverProcess.send(rspMsg);
                return;
            }
            if (msg.error) {
                // received a message from the child process that is an error
                if (msg.error.message) {
                    if (typeof msg.error.message === 'string') {
                        logger.error(msg.error.message);
                    }
                    else {
                        try {
                            logger.error(JSON.stringify(msg.error.message));
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                }
                logger.debug(msg.error);
                return;
            }
            if (msg.requestLog) {
                const req = msg.requestLog;
                let status;
                if (req.status >= 400) {
                    status = logger.red(req.method);
                }
                else if (req.status >= 300) {
                    status = logger.magenta(req.method);
                }
                else {
                    status = logger.cyan(req.method);
                }
                logger.info(logger.dim(`${status} ${req.url}`));
                return;
            }
        });
        // have the main process send a message to the child server process
        // to start the http and web socket server
        serverProcess.send({
            startServer: devServerConfig,
        });
        return devServerConfig;
    });
}
function emitMessageToClient(serverProcess, devServerContext, eventName, data) {
    if (eventName === 'buildFinish') {
        // a compiler build has finished
        // send the build results to the child server process
        devServerContext.isActivelyBuilding = false;
        const msg = {
            buildResults: Object.assign({}, data),
        };
        serverProcess.send(msg);
    }
    else if (eventName === 'buildStart') {
        devServerContext.isActivelyBuilding = true;
    }
    else if (eventName === 'buildLog') {
        const msg = {
            buildLog: Object.assign({}, data),
        };
        serverProcess.send(msg);
    }
}
async function openInBrowser(opts) {
    await open(opts.url);
}

exports.openInBrowser = openInBrowser;
exports.startServer = startServer;
