/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
import * as https from 'https';
export declare function createHttpServer(devServerConfig: d.DevServerConfig, sys: d.CompilerSystem, destroys: d.DevServerDestroy[]): Promise<http.Server | https.Server>;
