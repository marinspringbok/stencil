import * as d from '../../../declarations';
export declare const validateCustomElementBundle: (config: d.Config, userOutputs: d.OutputTarget[]) => {
    dir: string;
    type: "dist-custom-elements-bundle" | "experimental-dist-module";
    empty?: boolean;
    externalRuntime?: boolean;
    copy?: d.CopyTask[];
    inlineDynamicImports?: boolean;
}[];
