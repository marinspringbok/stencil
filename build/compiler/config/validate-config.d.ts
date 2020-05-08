import { Config, Diagnostic } from '../../declarations';
export declare const validateConfig: (userConfig?: Config) => {
    config: Config;
    diagnostics: Diagnostic[];
};
