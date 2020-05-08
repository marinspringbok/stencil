/// <reference types="node" />
import * as d from '../../../declarations';
import * as cp from 'child_process';
import { EventEmitter } from 'events';
export declare class NodeWorkerMain extends EventEmitter {
    workerDomain: string;
    id: number;
    childProcess: cp.ChildProcess;
    tasks: Map<number, d.CompilerWorkerTask>;
    exitCode: number;
    processQueue: boolean;
    sendQueue: d.MsgToWorker[];
    stopped: boolean;
    successfulMessage: boolean;
    totalTasksAssigned: number;
    constructor(workerDomain: string, id: number, forkModulePath: string);
    fork(forkModulePath: string): void;
    run(task: d.CompilerWorkerTask): void;
    sendToWorker(msg: d.MsgToWorker): void;
    receiveFromWorker(msgFromWorker: d.MsgFromWorker): void;
    stop(): void;
}
