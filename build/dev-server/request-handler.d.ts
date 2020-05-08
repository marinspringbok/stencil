/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function createRequestHandler(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem): (incomingReq: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;
export declare function isValidHistoryApi(devServerConfig: d.DevServerConfig, req: d.HttpRequest): boolean;
