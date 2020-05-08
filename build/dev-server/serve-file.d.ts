/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function serveFile(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, req: d.HttpRequest, res: http.ServerResponse): Promise<void>;
export declare function appendDevServerClientIframe(content: string, iframe: string): string;
