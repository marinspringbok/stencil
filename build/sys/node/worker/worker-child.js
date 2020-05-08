import { isNumber, isString } from '@utils';
export const initNodeWorkerThread = (prcs, msgHandler) => {
    const sendHandle = (err) => {
        if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
            prcs.exit(0);
        }
    };
    const errorHandler = (stencilMsgId, err) => {
        const errMsgBackToMain = {
            stencilId: stencilMsgId,
            stencilRtnValue: null,
            stencilRtnError: 'Error',
        };
        if (isString(err)) {
            errMsgBackToMain.stencilRtnError += ': ' + err;
        }
        else if (err) {
            if (err.stack) {
                errMsgBackToMain.stencilRtnError += ': ' + err.stack;
            }
            else if (err.message) {
                errMsgBackToMain.stencilRtnError += ':' + err.message;
            }
        }
        prcs.send(errMsgBackToMain, sendHandle);
    };
    prcs.on('message', async (msgToWorker) => {
        // message from the main thread
        if (msgToWorker && isNumber(msgToWorker.stencilId)) {
            try {
                // run the handler to get the data
                const msgFromWorker = {
                    stencilId: msgToWorker.stencilId,
                    stencilRtnValue: await msgHandler(msgToWorker),
                    stencilRtnError: null,
                };
                // send response data from the worker to the main thread
                prcs.send(msgFromWorker, sendHandle);
            }
            catch (e) {
                // error occurred while running the task
                errorHandler(msgToWorker.stencilId, e);
            }
        }
    });
    prcs.on(`unhandledRejection`, (e) => {
        errorHandler(-1, e);
    });
};
