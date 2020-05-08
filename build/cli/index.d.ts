/// <reference types="node" />
import { CompilerSystem, Logger } from '../declarations';
import { createNodeLogger } from '../sys/node/node-logger';
import { createNodeSysWithWatch } from '../sys/node/node-sys-watch';
import { parseFlags } from './parse-flags';
import { runTask } from './tasks/run-task';
export declare function run(init: CliInitOptions): Promise<void>;
export interface CliInitOptions {
    process?: NodeJS.Process;
    logger?: Logger;
    sys?: CompilerSystem;
}
export { createNodeLogger, createNodeSysWithWatch as createNodeSystem, parseFlags, runTask };
