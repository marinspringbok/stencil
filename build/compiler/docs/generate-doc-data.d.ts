import * as d from '../../declarations';
export declare const generateDocData: (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx) => Promise<d.JsonDocs>;
export declare const getNameText: (name: string, tags: d.JsonDocsTag[]) => string[][];
