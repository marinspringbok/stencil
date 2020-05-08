import pathBrowserify from 'path-browserify';
import { IS_NODE_ENV, normalizePath, requireFunc } from '@utils';
const path = {};
if (IS_NODE_ENV) {
    const nodePath = requireFunc('path');
    Object.assign(path, nodePath);
    path.join = (...args) => normalizePath(nodePath.join.apply(nodePath, args));
    path.normalize = (...args) => normalizePath(nodePath.normalize.apply(nodePath, args));
    path.relative = (...args) => normalizePath(nodePath.relative.apply(nodePath, args));
    path.resolve = (...args) => normalizePath(nodePath.resolve.apply(nodePath, args));
}
else {
    Object.assign(path, pathBrowserify);
}
export const basename = path.basename;
export const dirname = path.dirname;
export const extname = path.extname;
export const format = path.format;
export const isAbsolute = path.isAbsolute;
export const join = path.join;
export const normalize = path.normalize;
export const relative = path.relative;
export const resolve = path.resolve;
export const sep = path.sep;
export const delimiter = path.delimiter;
export const posix = path.posix;
export default path;
