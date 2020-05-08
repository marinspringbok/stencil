import { getTsOptionsToExtend } from './ts-config';
import ts from 'typescript';
export const createTsWatchProgram = async (config, buildCallback) => {
    let isRunning = false;
    let lastTsBuilder;
    let timeoutId;
    let rebuildTimer;
    const optionsToExtend = getTsOptionsToExtend(config);
    const tsWatchSys = Object.assign(Object.assign({}, ts.sys), { setTimeout(callback, time) {
            clearInterval(rebuildTimer);
            const t = (timeoutId = setInterval(() => {
                if (!isRunning) {
                    callback();
                    clearInterval(t);
                    timeoutId = rebuildTimer = null;
                }
            }, config.sys.watchTimeout || time));
            return t;
        },
        clearTimeout(id) {
            return clearInterval(id);
        } });
    config.sys.addDestory(() => tsWatchSys.clearTimeout(timeoutId));
    const tsWatchHost = ts.createWatchCompilerHost(config.tsconfig, optionsToExtend, tsWatchSys, ts.createEmitAndSemanticDiagnosticsBuilderProgram, reportDiagnostic => {
        config.logger.debug('watch reportDiagnostic:' + reportDiagnostic.messageText);
    }, reportWatchStatus => {
        config.logger.debug(reportWatchStatus.messageText);
    });
    tsWatchHost.afterProgramCreate = async (tsBuilder) => {
        lastTsBuilder = tsBuilder;
        isRunning = true;
        await buildCallback(tsBuilder);
        isRunning = false;
    };
    return {
        program: ts.createWatchProgram(tsWatchHost),
        rebuild: () => {
            if (lastTsBuilder && !timeoutId) {
                rebuildTimer = tsWatchSys.setTimeout(() => tsWatchHost.afterProgramCreate(lastTsBuilder), 300);
            }
        },
    };
};
