export const inherits = (ctor, superCtor) => {
    if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true,
            },
        });
    }
};
export const inspect = (...args) => args.forEach(arg => console.log(arg));
export const promisify = (fn) => {
    if (typeof fn[promisify.custom] === 'function') {
        // https://nodejs.org/api/util.html#util_custom_promisified_functions
        return function (...args) {
            return fn[promisify.custom].apply(this, args);
        };
    }
    return function (...args) {
        return new Promise((resolve, reject) => {
            args.push((err, result) => {
                if (err != null) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
            fn.apply(this, args);
        });
    };
};
promisify.custom = Symbol('promisify.custom');
export default {
    inherits,
    inspect,
    promisify,
};
