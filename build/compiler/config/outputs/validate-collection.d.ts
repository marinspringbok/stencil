import * as d from '../../../declarations';
export declare const validateCollection: (config: d.Config, userOutputs: d.OutputTarget[]) => {
    dir: string;
    type: "dist-collection";
    collectionDir: string;
}[];
export declare const getCollectionDistDir: (config: d.Config) => string;
