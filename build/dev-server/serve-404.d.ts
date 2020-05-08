/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function serve404(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse, xSource: string): Promise<void>;
export declare function serve404Content(devServerConfig: d.DevServerConfig, req: d.HttpRequest, res: http.ServerResponse, content: string, xSource: string): void;
