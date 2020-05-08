/// <reference types="node" />
import * as d from '../declarations';
import * as http from 'http';
export declare function createWebSocket(prcs: NodeJS.Process, httpServer: http.Server, destroys: d.DevServerDestroy[]): void;
