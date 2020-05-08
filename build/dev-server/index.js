import { fork } from 'child_process';
import path from 'path';
import open from 'open';
export async function startServer(stencilDevServerConfig, logger, watcher) {
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
        const serverProcess = fork(workerPath, [], forkOpts);
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
export async function openInBrowser(opts) {
    await open(opts.url);
}
