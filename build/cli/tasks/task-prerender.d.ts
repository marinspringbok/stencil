/// <reference types="node" />
import * as d from '../../declarations';
export declare function taskPrerender(prcs: NodeJS.Process, config: d.Config): Promise<void>;
export declare function runPrerenderTask(prcs: NodeJS.Process, config: d.Config, devServer: d.DevServer, hydrateAppFilePath: string, componentGraph: d.BuildResultsComponentGraph, srcIndexHtmlPath: string): Promise<d.Diagnostic[]>;
