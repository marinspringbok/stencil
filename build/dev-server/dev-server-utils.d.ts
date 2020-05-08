/// <reference types="node" />
import * as d from '../declarations';
export declare function sendMsg(prcs: NodeJS.Process, msg: d.DevServerMessage): void;
export declare function sendMsgWithResponse(prcs: NodeJS.Process, msg: d.DevServerMessage): Promise<d.DevServerMessage>;
export declare function createMessageReceiver(prcs: NodeJS.Process, cb: (msg: d.DevServerMessage) => void): void;
export declare function sendError(prcs: NodeJS.Process, e: any): void;
export declare function responseHeaders(headers: d.DevResponseHeaders): any;
export declare function getBrowserUrl(protocol: string, address: string, port: number, basePath: string, pathname: string): string;
export declare function getDevServerClientUrl(devServerConfig: d.DevServerConfig, host: string): string;
export declare function getContentType(devServerConfig: d.DevServerConfig, filePath: string): string;
export declare function isHtmlFile(filePath: string): boolean;
export declare function isCssFile(filePath: string): boolean;
export declare function isSimpleText(filePath: string): boolean;
export declare function isDevClient(pathname: string): boolean;
export declare function isDevModule(pathname: string): boolean;
export declare function isOpenInEditor(pathname: string): boolean;
export declare function isInitialDevServerLoad(pathname: string): boolean;
export declare function isDevServerClient(pathname: string): boolean;
export declare function shouldCompress(devServerConfig: d.DevServerConfig, req: d.HttpRequest): boolean;
