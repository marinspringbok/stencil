import * as d from '../declarations';
export declare const createEvent: (ref: d.RuntimeRef, name: string, flags: number) => {
    emit: (detail: any) => any;
};
export declare const emitEvent: (elm: EventTarget, name: string, opts?: CustomEventInit<any>) => any;
