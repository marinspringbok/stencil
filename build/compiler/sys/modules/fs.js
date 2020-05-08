import { basename } from 'path';
import { promisify } from './util';
class FsError extends Error {
    constructor(syscall, path, code = 'ENOENT', errno = -2) {
        super(`ENOENT: no such file or directory, ${syscall} '${path}'`);
        this.syscall = syscall;
        this.path = path;
        this.code = code;
        this.errno = errno;
    }
}
const fs = {
    __sys: {},
};
export const exists = (fs.exists = (p, cb) => {
    fs.__sys.access(p).then(hasAccess => {
        cb(hasAccess);
    });
});
// https://nodejs.org/api/util.html#util_custom_promisified_functions
exists[promisify.custom] = (p) => fs.__sys.access(p);
export const existsSync = (fs.existsSync = (p) => {
    // https://nodejs.org/api/fs.html#fs_fs_existssync_path
    return fs.__sys.accessSync(p);
});
export const mkdir = (fs.mkdir = (p, opts, cb) => {
    cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
    opts = typeof opts === 'function' ? undefined : opts;
    fs.__sys.mkdir(p, opts).then(results => {
        if (cb) {
            if (results.error) {
                cb(new FsError('mkdir', p));
            }
            else {
                cb(null);
            }
        }
    });
});
export const mkdirSync = (fs.mkdirSync = (p, opts) => {
    const results = fs.__sys.mkdirSync(p, opts);
    if (results.error) {
        throw new FsError('mkdir', p);
    }
});
export const readdirSync = (fs.readdirSync = (p) => {
    // sys.readdirSync includes full paths
    // but if fs.readdirSync was called, the expected
    // nodejs results are of just the basename for each dir item
    const dirItems = fs.__sys.readdirSync(p);
    return dirItems.map(dirItem => basename(dirItem));
});
export const readFile = (fs.readFile = async (p, opts, cb) => {
    const encoding = typeof opts === 'object' ? opts.encoding : typeof opts === 'string' ? opts : 'utf-8';
    cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
    fs.__sys.readFile(p, encoding).then(data => {
        if (cb) {
            if (typeof data === 'string') {
                cb(null, data);
            }
            else {
                cb(new FsError('open', p), data);
            }
        }
    });
});
export const readFileSync = (fs.readFileSync = (p, opts) => {
    const encoding = typeof opts === 'object' ? opts.encoding : typeof opts === 'string' ? opts : 'utf-8';
    const data = fs.__sys.readFileSync(p, encoding);
    if (typeof data !== 'string') {
        throw new FsError('open', p);
    }
    return data;
});
export const realpath = (fs.realpath = (p, opts, cb) => {
    cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
    fs.__sys.realpath(p).then(data => {
        if (cb) {
            if (typeof data === 'string') {
                cb(null, data);
            }
            else {
                cb(new FsError('realpath', p), data);
            }
        }
    });
});
export const realpathSync = (fs.realpathSync = (p) => {
    const data = fs.__sys.realpathSync(p);
    if (typeof data !== 'string') {
        throw new FsError('realpathSync', p);
    }
    return data;
});
export const statSync = (fs.statSync = (p) => {
    const fsStats = fs.__sys.statSync(p);
    if (!fsStats) {
        throw new FsError('statSync', p);
    }
    return fsStats;
});
export const lstatSync = (fs.lstatSync = statSync);
export const stat = (fs.stat = (p, opts, cb) => {
    cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
    fs.__sys.stat(p).then(fsStats => {
        if (cb) {
            if (fsStats) {
                cb(null);
            }
            else {
                cb(new FsError('stat', p));
            }
        }
    });
});
export const watch = (fs.watch = () => {
    throw new Error(`fs.watch() not implemented`);
});
export const writeFile = (fs.writeFile = (p, data, opts, cb) => {
    cb = typeof cb === 'function' ? cb : typeof opts === 'function' ? opts : null;
    fs.__sys.writeFile(p, data).then(writeResults => {
        if (cb) {
            if (writeResults.error) {
                cb(new FsError('writeFile', p));
            }
            else {
                cb(null);
            }
        }
    });
});
export default fs;
