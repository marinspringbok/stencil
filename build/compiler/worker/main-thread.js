export const createWorkerMainContext = (workerCtrl) => {
    return {
        compileModule: workerCtrl.handler('compileModule'),
        optimizeCss: workerCtrl.handler('optimizeCss'),
        transformCssToEsm: workerCtrl.handler('transformCssToEsm'),
        transpileToEs5: workerCtrl.handler('transpileToEs5'),
        prepareModule: workerCtrl.handler('prepareModule'),
    };
};
