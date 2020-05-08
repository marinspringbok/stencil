import * as d from '../declarations';
export declare const getConnect: (_ref: d.HostRef, tagName: string) => {
    create: (...args: any[]) => Promise<any>;
    componentOnReady: () => Promise<any>;
};
