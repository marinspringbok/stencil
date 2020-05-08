export const isDef = (v) => v != null;
export const toLowerCase = (str) => str.toLowerCase();
export const toDashCase = (str) => toLowerCase(str
    .replace(/([A-Z0-9])/g, g => ' ' + g[0])
    .trim()
    .replace(/ /g, '-'));
export const dashToPascalCase = (str) => toLowerCase(str)
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
export const toTitleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
export const noop = () => {
    /* noop*/
};
export const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};
export const sortBy = (array, prop) => {
    return array.slice().sort((a, b) => {
        const nameA = prop(a);
        const nameB = prop(b);
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });
};
export const flatOne = (array) => {
    if (array.flat) {
        return array.flat(1);
    }
    return array.reduce((result, item) => {
        result.push(...item);
        return result;
    }, []);
};
export const unique = (array, predicate = i => i) => {
    const set = new Set();
    return array.filter(item => {
        const key = predicate(item);
        if (key == null) {
            return true;
        }
        if (set.has(key)) {
            return false;
        }
        set.add(key);
        return true;
    });
};
export const fromEntries = (entries) => {
    const object = {};
    for (const [key, value] of entries) {
        object[key] = value;
    }
    return object;
};
export const pluck = (obj, keys) => {
    return keys.reduce((final, key) => {
        if (obj[key]) {
            final[key] = obj[key];
        }
        return final;
    }, {});
};
export const isBoolean = (v) => typeof v === 'boolean';
export const isDefined = (v) => v !== null && v !== undefined;
export const isUndefined = (v) => v === null || v === undefined;
export const isFunction = (v) => typeof v === 'function';
export const isNumber = (v) => typeof v === 'number';
export const isObject = (val) => val != null && typeof val === 'object' && Array.isArray(val) === false;
export const isString = (v) => typeof v === 'string';
export const isIterable = (v) => isDefined(v) && isFunction(v[Symbol.iterator]);
