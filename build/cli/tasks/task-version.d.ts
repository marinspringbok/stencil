import * as d from '../../declarations';
export declare function taskVersion(): Promise<void>;
export declare function checkVersion(config: d.Config, currentVersion: string): Promise<() => any>;
