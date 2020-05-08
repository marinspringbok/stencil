import * as d from '../../declarations';
import { OutputOptions, RollupBuild } from 'rollup';
export declare const generateRollupOutput: (build: RollupBuild, options: OutputOptions, config: d.Config, entryModules: d.EntryModule[]) => Promise<d.RollupResult[]>;
export declare const DEFAULT_CORE: string;
export declare const DEFAULT_ENTRY = "\nexport * from '@stencil/core';\n";
