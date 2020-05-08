/// <reference types="node" />
import * as d from '../declarations';
export declare function runPrerender(prcs: NodeJS.Process, cliRootDir: string, config: d.Config, devServer: d.DevServer, hydrateAppFilePath: string, componentGraph: d.BuildResultsComponentGraph, srcIndexHtmlPath: string): Promise<d.Diagnostic[]>;
