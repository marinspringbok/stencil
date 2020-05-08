import { isOutputTargetDistTypes } from '../output-targets/output-utils';
import ts from 'typescript';
export const getTsOptionsToExtend = (config) => {
    const tsOptions = {
        experimentalDecorators: true,
        declaration: config.outputTargets.some(isOutputTargetDistTypes),
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        noEmitOnError: false,
        outDir: config.cacheDir,
        sourceMap: config.sourceMap,
    };
    return tsOptions;
};
