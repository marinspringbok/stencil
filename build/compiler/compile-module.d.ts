import { CompileOptions, CompileResults } from '../declarations';
export declare const compile: (code: string, opts?: CompileOptions) => Promise<CompileResults>;
export declare const compileSync: (code: string, opts?: CompileOptions) => CompileResults;
