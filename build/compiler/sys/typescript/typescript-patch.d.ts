import * as d from '../../../declarations';
export declare const patchTypescript: (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => Promise<void>;
export declare const patchTypescriptSync: (config: d.Config, diagnostics: d.Diagnostic[], inMemoryFs: d.InMemoryFileSystem) => void;
