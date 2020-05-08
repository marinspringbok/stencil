/// <reference types="node" />
import { Config, TaskCommand } from '../../declarations';
export declare function runTask(prcs: NodeJS.Process, config: Config, task: TaskCommand): Promise<void>;
