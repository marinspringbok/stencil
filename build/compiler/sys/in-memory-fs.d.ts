import * as d from '../../declarations';
export declare const createInMemoryFs: (sys: d.CompilerSystem) => d.InMemoryFileSystem;
export declare const getCommitInstructions: (items: d.FsItems) => {
    filesToDelete: string[];
    filesToWrite: string[];
    filesToCopy: string[][];
    dirsToDelete: string[];
    dirsToEnsure: string[];
};
export declare const shouldIgnore: (filePath: string) => boolean;
