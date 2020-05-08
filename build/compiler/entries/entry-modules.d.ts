import * as d from '../../declarations';
export declare function generateEntryModules(config: d.Config, buildCtx: d.BuildCtx): void;
export declare function createEntryModule(cmps: d.ComponentCompilerMeta[]): d.EntryModule;
export declare function getEntryModes(cmps: d.ComponentCompilerMeta[]): string[];
export declare function getEntryEncapsulations(moduleFiles: d.Module[]): ("none" | "shadow" | "scoped")[];
export declare function getComponentStyleModes(cmpMeta: d.ComponentCompilerMeta): string[];
