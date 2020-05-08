import { caughtErrors, moduleLoaded, queuedLoadModules, queuedReadTasks, queuedTicks, queuedWriteTasks } from './testing-constants';
export function resetTaskQueue() {
    queuedTicks.length = 0;
    queuedWriteTasks.length = 0;
    queuedReadTasks.length = 0;
    moduleLoaded.clear();
    queuedLoadModules.length = 0;
    caughtErrors.length = 0;
}
export const nextTick = (cb) => {
    queuedTicks.push(cb);
};
export function flushTicks() {
    return new Promise((resolve, reject) => {
        function drain() {
            try {
                if (queuedTicks.length > 0) {
                    const writeTasks = queuedTicks.slice();
                    queuedTicks.length = 0;
                    let cb;
                    while ((cb = writeTasks.shift())) {
                        cb(Date.now());
                    }
                }
                if (queuedTicks.length > 0) {
                    process.nextTick(drain);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(`flushTicks: ${e}`);
            }
        }
        process.nextTick(drain);
    });
}
export function writeTask(cb) {
    queuedWriteTasks.push(cb);
}
export function readTask(cb) {
    queuedReadTasks.push(cb);
}
export function flushQueue() {
    return new Promise((resolve, reject) => {
        async function drain() {
            try {
                if (queuedReadTasks.length > 0) {
                    const readTasks = queuedReadTasks.slice();
                    queuedReadTasks.length = 0;
                    let cb;
                    while ((cb = readTasks.shift())) {
                        const result = cb(Date.now());
                        if (result != null && typeof result.then === 'function') {
                            await result;
                        }
                    }
                }
                if (queuedWriteTasks.length > 0) {
                    const writeTasks = queuedWriteTasks.slice();
                    queuedWriteTasks.length = 0;
                    let cb;
                    while ((cb = writeTasks.shift())) {
                        const result = cb(Date.now());
                        if (result != null && typeof result.then === 'function') {
                            await result;
                        }
                    }
                }
                if (queuedReadTasks.length + queuedWriteTasks.length > 0) {
                    process.nextTick(drain);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(`flushQueue: ${e}`);
            }
        }
        process.nextTick(drain);
    });
}
export async function flushAll() {
    while (queuedTicks.length + queuedLoadModules.length + queuedWriteTasks.length + queuedReadTasks.length > 0) {
        await flushTicks();
        await flushLoadModule();
        await flushQueue();
    }
    if (caughtErrors.length > 0) {
        const err = caughtErrors[0];
        if (err == null) {
            throw new Error('Error!');
        }
        if (typeof err === 'string') {
            throw new Error(err);
        }
        throw err;
    }
    return new Promise(resolve => process.nextTick(resolve));
}
export function loadModule(cmpMeta, _hostRef, _hmrVersionId) {
    return new Promise(resolve => {
        queuedLoadModules.push({
            bundleId: cmpMeta.$lazyBundleIds$,
            resolve: () => resolve(moduleLoaded.get(cmpMeta.$lazyBundleIds$)),
        });
    });
}
export function flushLoadModule(bundleId) {
    return new Promise((resolve, reject) => {
        try {
            process.nextTick(() => {
                if (bundleId != null) {
                    for (let i = 0; i < queuedLoadModules.length; i++) {
                        if (queuedLoadModules[i].bundleId === bundleId) {
                            queuedLoadModules[i].resolve();
                            queuedLoadModules.splice(i, 1);
                            i--;
                        }
                    }
                }
                else {
                    let queuedLoadModule;
                    while ((queuedLoadModule = queuedLoadModules.shift())) {
                        queuedLoadModule.resolve();
                    }
                }
                resolve();
            });
        }
        catch (e) {
            reject(`flushLoadModule: ${e}`);
        }
    });
}
