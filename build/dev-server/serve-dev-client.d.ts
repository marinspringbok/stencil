/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function serveDevClient(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse): Promise<void>;
