/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function serveCompilerRequest(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse): Promise<void>;
