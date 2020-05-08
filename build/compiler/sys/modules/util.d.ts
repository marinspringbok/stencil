export declare const inherits: (ctor: any, superCtor: any) => void;
export declare const inspect: (...args: any[]) => void;
export declare const promisify: {
    (fn: Function): () => Promise<any>;
    custom: symbol;
};
declare const _default: {
    inherits: (ctor: any, superCtor: any) => void;
    inspect: (...args: any[]) => void;
    promisify: {
        (fn: Function): () => Promise<any>;
        custom: symbol;
    };
};
export default _default;
