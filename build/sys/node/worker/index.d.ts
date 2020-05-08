/// <reference types="node" />
import * as d from '../../../declarations';
import { EventEmitter } from 'events';
import { NodeWorkerMain } from './worker-main';
export declare class NodeWorkerController extends EventEmitter implements d.WorkerMainController {
    workerDomain: string;
    forkModulePath: string;
    logger: d.Logger;
    workerIds: number;
    stencilId: number;
    isEnding: boolean;
    taskQueue: d.CompilerWorkerTask[];
    workers: NodeWorkerMain[];
    totalWorkers: number;
    useForkedWorkers: boolean;
    mainThreadRunner: {
        [fnName: string]: (...args: any[]) => Promise<any>;
    };
    constructor(workerDomain: string, forkModulePath: string, maxConcurrentWorkers: number, logger: d.Logger);
    onError(err: NodeJS.ErrnoException, workerId: number): void;
    onExit(workerId: number): void;
    startWorkers(): void;
    startWorker(): void;
    stopWorker(workerId: number): void;
    processTaskQueue(): void;
    send(...args: any[]): any;
    handler(name: string): (...args: any[]) => any;
    cancelTasks(): void;
    destroy(): void;
}
export declare function getNextWorker(workers: NodeWorkerMain[]): NodeWorkerMain;
export declare function setupWorkerController(sys: d.CompilerSystem, logger: d.Logger, workerDomain: string): void;
