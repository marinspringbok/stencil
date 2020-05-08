import * as d from '../../declarations';
export declare const validateBuildPackageJson: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<void>;
export declare const validatePackageFiles: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => Promise<void>;
export declare const validateMain: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => void;
export declare const validateModule: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => void;
export declare const validateTypes: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistTypes) => Promise<void>;
export declare const validateCollection: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDistCollection) => void;
export declare const validateBrowser: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => void;
