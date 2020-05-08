/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function serveOpenInEditor(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse): Promise<void>;
export declare function getEditors(): Promise<d.DevServerEditor[]>;
