import * as d from '../../../declarations';
export interface FsObj {
    __sys: d.CompilerSystem;
    [key: string]: any;
}
declare const fs: FsObj;
export declare const exists: (p: string, cb: any) => void;
export declare const existsSync: (p: string) => boolean;
export declare const mkdir: (p: string, opts: any, cb: any) => void;
export declare const mkdirSync: (p: string, opts: any) => void;
export declare const readdirSync: (p: string) => string[];
export declare const readFile: (p: string, opts: any, cb: (err: any, data: string) => void) => Promise<void>;
export declare const readFileSync: (p: string, opts: any) => string;
export declare const realpath: (p: string, opts: any, cb: (err: any, data: string) => void) => void;
export declare const realpathSync: (p: string) => string;
export declare const statSync: (p: string) => d.CompilerFsStats;
export declare const lstatSync: (p: string) => d.CompilerFsStats;
export declare const stat: (p: string, opts: any, cb: any) => void;
export declare const watch: () => never;
export declare const writeFile: (p: string, data: string, opts: any, cb: any) => void;
export default fs;
