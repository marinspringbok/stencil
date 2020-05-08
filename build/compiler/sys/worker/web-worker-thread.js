import { isNumber, isString } from '@utils';
export const initWebWorkerThread = (selfWorker, msgHandler) => {
    let isQueued = false;
    const tick = Promise.resolve();
    const msgsFromWorkerQueue = [];
    const drainMsgQueueFromWorkerToMain = () => {
        isQueued = false;
        selfWorker.postMessage(msgsFromWorkerQueue);
        msgsFromWorkerQueue.length = 0;
    };
    const queueMsgFromWorkerToMain = (msgFromWorkerToMain) => {
        msgsFromWorkerQueue.push(msgFromWorkerToMain);
        if (!isQueued) {
            isQueued = true;
            tick.then(drainMsgQueueFromWorkerToMain);
        }
    };
    const error = (stencilMsgId, err) => {
        const errMsgFromWorkerToMain = {
            stencilId: stencilMsgId,
            stencilRtnValue: null,
            stencilRtnError: 'Error',
        };
        if (isString(err)) {
            errMsgFromWorkerToMain.stencilRtnError += ': ' + err;
        }
        else if (err) {
            if (err.stack) {
                errMsgFromWorkerToMain.stencilRtnError += ': ' + err.stack;
            }
            else if (err.message) {
                errMsgFromWorkerToMain.stencilRtnError += ': ' + err.message;
            }
        }
        queueMsgFromWorkerToMain(errMsgFromWorkerToMain);
    };
    const receiveMsgFromMainToWorker = async (msgToWorker) => {
        if (msgToWorker && isNumber(msgToWorker.stencilId)) {
            try {
                // run the handler to get the data
                const msgFromWorkerToMain = {
                    stencilId: msgToWorker.stencilId,
                    stencilRtnValue: await msgHandler(msgToWorker),
                    stencilRtnError: null,
                };
                queueMsgFromWorkerToMain(msgFromWorkerToMain);
            }
            catch (e) {
                // error occurred while running the task
                error(msgToWorker.stencilId, e);
            }
        }
    };
    selfWorker.onmessage = ev => {
        // message from the main thread
        const msgsFromMainToWorker = ev.data;
        if (Array.isArray(msgsFromMainToWorker)) {
            for (const msgFromMainToWorker of msgsFromMainToWorker) {
                receiveMsgFromMainToWorker(msgFromMainToWorker);
            }
        }
    };
    selfWorker.onerror = e => {
        // uncaught error occurred on the worker thread
        error(-1, e);
    };
};
