import * as d from '../../declarations';
export declare const getAbsolutePath: (config: d.Config, dir: string) => string;
export declare const setBooleanConfig: (config: any, configName: string, flagName: string, defaultValue: boolean) => void;
export declare const setNumberConfig: (config: any, configName: string, _flagName: string, defaultValue: number) => void;
export declare const setStringConfig: (config: any, configName: string, defaultValue: string) => void;
export declare const setArrayConfig: (config: any, configName: string, defaultValue?: any[]) => void;
