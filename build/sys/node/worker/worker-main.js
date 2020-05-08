import * as cp from 'child_process';
import { EventEmitter } from 'events';
import { TASK_CANCELED_MSG } from '@utils';
export class NodeWorkerMain extends EventEmitter {
    constructor(workerDomain, id, forkModulePath) {
        super();
        this.workerDomain = workerDomain;
        this.id = id;
        this.tasks = new Map();
        this.exitCode = null;
        this.processQueue = true;
        this.sendQueue = [];
        this.stopped = false;
        this.successfulMessage = false;
        this.totalTasksAssigned = 0;
        this.fork(forkModulePath);
    }
    fork(forkModulePath) {
        const filteredArgs = process.execArgv.filter(v => !/^--(debug|inspect)/.test(v));
        const args = [this.workerDomain];
        const options = {
            execArgv: filteredArgs,
            env: process.env,
            cwd: process.cwd(),
            silent: true,
        };
        this.childProcess = cp.fork(forkModulePath, args, options);
        this.childProcess.stdout.setEncoding('utf8');
        this.childProcess.stdout.on('data', data => {
            console.log(data);
        });
        this.childProcess.stderr.setEncoding('utf8');
        this.childProcess.stderr.on('data', data => {
            console.log(data);
        });
        this.childProcess.on('message', this.receiveFromWorker.bind(this));
        this.childProcess.on('error', err => {
            this.emit('error', err);
        });
        this.childProcess.once('exit', code => {
            this.exitCode = code;
            this.emit('exit', code);
        });
    }
    run(task) {
        this.totalTasksAssigned++;
        this.tasks.set(task.stencilId, task);
        this.sendToWorker({
            stencilId: task.stencilId,
            args: task.inputArgs,
        });
    }
    sendToWorker(msg) {
        if (!this.processQueue) {
            this.sendQueue.push(msg);
            return;
        }
        const success = this.childProcess.send(msg, error => {
            if (error && error instanceof Error) {
                return;
            }
            this.processQueue = true;
            if (this.sendQueue.length > 0) {
                const queueCopy = this.sendQueue.slice();
                this.sendQueue = [];
                queueCopy.forEach(d => this.sendToWorker(d));
            }
        });
        if (!success || /^win/.test(process.platform)) {
            this.processQueue = false;
        }
    }
    receiveFromWorker(msgFromWorker) {
        this.successfulMessage = true;
        if (this.stopped) {
            return;
        }
        const task = this.tasks.get(msgFromWorker.stencilId);
        if (!task) {
            if (msgFromWorker.stencilRtnError != null) {
                this.emit('error', msgFromWorker.stencilRtnError);
            }
            return;
        }
        if (msgFromWorker.stencilRtnError != null) {
            task.reject(msgFromWorker.stencilRtnError);
        }
        else {
            task.resolve(msgFromWorker.stencilRtnValue);
        }
        this.tasks.delete(msgFromWorker.stencilId);
        this.emit('response', msgFromWorker);
    }
    stop() {
        this.stopped = true;
        this.tasks.forEach(t => t.reject(TASK_CANCELED_MSG));
        this.tasks.clear();
        if (this.successfulMessage) {
            // we know we've had a successful startup
            // so let's close it down all nice like
            this.childProcess.send({
                exit: true,
            });
            setTimeout(() => {
                if (this.exitCode === null) {
                    // fallback if we weren't able to gracefully exit
                    this.childProcess.kill('SIGKILL');
                }
            }, 100);
        }
        else {
            // never had a successful message
            // so something may be hosed up
            // let's just kill it now
            this.childProcess.kill('SIGKILL');
        }
    }
}
