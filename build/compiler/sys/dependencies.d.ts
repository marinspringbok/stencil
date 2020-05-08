import { CompilerSystem } from '../../declarations';
export declare const getRemoteTypeScriptUrl: (sys: CompilerSystem) => string;
export declare const dependencies: CompilerDependency[];
export interface CompilerDependency {
    name: string;
    version: string;
    main: string;
    resources?: string[];
}
