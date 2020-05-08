import * as d from '../../../declarations';
export declare const validateAngular: (userConfig: d.Config, userOutputs: d.OutputTarget[]) => {
    type: string;
    componentCorePackage: string;
    directivesProxyFile: string;
    directivesArrayFile: string;
    directivesUtilsFile: string;
    excludeComponents: string[];
}[];
