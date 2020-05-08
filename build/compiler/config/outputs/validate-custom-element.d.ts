import * as d from '../../../declarations';
export declare const validateCustomElement: (config: d.Config, userOutputs: d.OutputTarget[]) => {
    dir: string;
    type: "dist-custom-elements";
    empty?: boolean;
    copy?: d.CopyTask[];
}[];
