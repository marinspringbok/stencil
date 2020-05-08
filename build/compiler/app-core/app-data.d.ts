import { BuildConditionals, BuildFeatures, ComponentCompilerMeta, Config, ModuleMap } from '@stencil/core/internal';
export * from '../../app-data';
export declare const getBuildFeatures: (cmps: ComponentCompilerMeta[]) => BuildFeatures;
export declare const updateComponentBuildConditionals: (moduleMap: ModuleMap, cmps: ComponentCompilerMeta[]) => void;
export declare const updateBuildConditionals: (config: Config, b: BuildConditionals) => void;
