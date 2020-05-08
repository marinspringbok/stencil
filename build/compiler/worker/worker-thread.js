import { compile } from '../compile-module';
import { initNodeWorkerThread } from '../../sys/node/worker/worker-child';
import { initWebWorkerThread } from '../sys/worker/web-worker-thread';
import { IS_NODE_ENV, IS_WEB_WORKER_ENV } from '@utils';
import { optimizeCss } from '../optimize/optimize-css';
import { prepareModule } from '../optimize/optimize-module';
import { transformCssToEsm } from '../style/css-to-esm';
import { transpileToEs5 } from '../transpile/transpile-to-es5';
export const createWorkerContext = () => {
    return {
        compileModule: compile,
        transformCssToEsm,
        prepareModule,
        optimizeCss,
        transpileToEs5,
    };
};
export const createWorkerMsgHandler = () => {
    const workerCtx = createWorkerContext();
    const handleMsg = async (msgToWorker) => {
        const fnName = msgToWorker.args[0];
        const fnArgs = msgToWorker.args.slice(1);
        const fn = workerCtx[fnName];
        if (typeof fn === 'function') {
            return fn.apply(null, fnArgs);
        }
    };
    return handleMsg;
};
export const initWorkerThread = (glbl) => {
    if (IS_WEB_WORKER_ENV) {
        initWebWorkerThread(glbl, createWorkerMsgHandler());
    }
    else if (IS_NODE_ENV && glbl.process.argv.includes('stencil-compiler-worker')) {
        initNodeWorkerThread(glbl.process, createWorkerMsgHandler());
    }
};
