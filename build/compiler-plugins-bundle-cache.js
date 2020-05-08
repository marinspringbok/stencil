import fs$1, { existsSync, realpathSync, statSync } from 'fs';
import path$1, { sep, extname, resolve as resolve$1, posix, basename, dirname, normalize } from 'path';
import util$1, { promisify } from 'util';
import module$1 from 'module';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

const assert = true;
const async_hooks = ">= 8";
const buffer_ieee754 = "< 0.9.7";
const buffer = true;
const child_process = true;
const cluster = true;
const console$1 = true;
const constants = true;
const crypto = true;
const _debug_agent = ">= 1 && < 8";
const _debugger = "< 8";
const dgram = true;
const dns = true;
const domain = true;
const events = true;
const freelist = "< 6";
const fs = true;
const _http_agent = ">= 0.11.1";
const _http_client = ">= 0.11.1";
const _http_common = ">= 0.11.1";
const _http_incoming = ">= 0.11.1";
const _http_outgoing = ">= 0.11.1";
const _http_server = ">= 0.11.1";
const http = true;
const http2 = ">= 8.8";
const https = true;
const inspector = ">= 8.0.0";
const _linklist = "< 8";
const module = true;
const net = true;
const os = true;
const path = true;
const perf_hooks = ">= 8.5";
const process$1 = ">= 1";
const punycode = true;
const querystring = true;
const readline = true;
const repl = true;
const smalloc = ">= 0.11.5 && < 3";
const _stream_duplex = ">= 0.9.4";
const _stream_transform = ">= 0.9.4";
const _stream_wrap = ">= 1.4.1";
const _stream_passthrough = ">= 0.9.4";
const _stream_readable = ">= 0.9.4";
const _stream_writable = ">= 0.9.4";
const stream = true;
const string_decoder = true;
const sys = true;
const timers = true;
const _tls_common = ">= 0.11.13";
const _tls_legacy = ">= 0.11.3 && < 10";
const _tls_wrap = ">= 0.11.3";
const tls = true;
const trace_events = ">= 10";
const tty = true;
const url = true;
const util = true;
const v8 = ">= 1";
const vm = true;
const worker_threads = ">= 11.7";
const zlib = true;
var core = {
	assert: assert,
	async_hooks: async_hooks,
	buffer_ieee754: buffer_ieee754,
	buffer: buffer,
	child_process: child_process,
	cluster: cluster,
	console: console$1,
	constants: constants,
	crypto: crypto,
	_debug_agent: _debug_agent,
	_debugger: _debugger,
	dgram: dgram,
	dns: dns,
	domain: domain,
	events: events,
	freelist: freelist,
	fs: fs,
	"fs/promises": ">= 10 && < 10.1",
	_http_agent: _http_agent,
	_http_client: _http_client,
	_http_common: _http_common,
	_http_incoming: _http_incoming,
	_http_outgoing: _http_outgoing,
	_http_server: _http_server,
	http: http,
	http2: http2,
	https: https,
	inspector: inspector,
	_linklist: _linklist,
	module: module,
	net: net,
	"node-inspect/lib/_inspect": ">= 7.6.0 && < 12",
	"node-inspect/lib/internal/inspect_client": ">= 7.6.0 && < 12",
	"node-inspect/lib/internal/inspect_repl": ">= 7.6.0 && < 12",
	os: os,
	path: path,
	perf_hooks: perf_hooks,
	process: process$1,
	punycode: punycode,
	querystring: querystring,
	readline: readline,
	repl: repl,
	smalloc: smalloc,
	_stream_duplex: _stream_duplex,
	_stream_transform: _stream_transform,
	_stream_wrap: _stream_wrap,
	_stream_passthrough: _stream_passthrough,
	_stream_readable: _stream_readable,
	_stream_writable: _stream_writable,
	stream: stream,
	string_decoder: string_decoder,
	sys: sys,
	timers: timers,
	_tls_common: _tls_common,
	_tls_legacy: _tls_legacy,
	_tls_wrap: _tls_wrap,
	tls: tls,
	trace_events: trace_events,
	tty: tty,
	url: url,
	util: util,
	"v8/tools/arguments": ">= 10 && < 12",
	"v8/tools/codemap": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/consarray": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/csvparser": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/logreader": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/profile_view": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	"v8/tools/splaytree": [
	">= 4.4.0 && < 5",
	">= 5.2.0 && < 12"
],
	v8: v8,
	vm: vm,
	worker_threads: worker_threads,
	zlib: zlib
};

var core$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	assert: assert,
	async_hooks: async_hooks,
	buffer_ieee754: buffer_ieee754,
	buffer: buffer,
	child_process: child_process,
	cluster: cluster,
	console: console$1,
	constants: constants,
	crypto: crypto,
	_debug_agent: _debug_agent,
	_debugger: _debugger,
	dgram: dgram,
	dns: dns,
	domain: domain,
	events: events,
	freelist: freelist,
	fs: fs,
	_http_agent: _http_agent,
	_http_client: _http_client,
	_http_common: _http_common,
	_http_incoming: _http_incoming,
	_http_outgoing: _http_outgoing,
	_http_server: _http_server,
	http: http,
	http2: http2,
	https: https,
	inspector: inspector,
	_linklist: _linklist,
	module: module,
	net: net,
	os: os,
	path: path,
	perf_hooks: perf_hooks,
	process: process$1,
	punycode: punycode,
	querystring: querystring,
	readline: readline,
	repl: repl,
	smalloc: smalloc,
	_stream_duplex: _stream_duplex,
	_stream_transform: _stream_transform,
	_stream_wrap: _stream_wrap,
	_stream_passthrough: _stream_passthrough,
	_stream_readable: _stream_readable,
	_stream_writable: _stream_writable,
	stream: stream,
	string_decoder: string_decoder,
	sys: sys,
	timers: timers,
	_tls_common: _tls_common,
	_tls_legacy: _tls_legacy,
	_tls_wrap: _tls_wrap,
	tls: tls,
	trace_events: trace_events,
	tty: tty,
	url: url,
	util: util,
	v8: v8,
	vm: vm,
	worker_threads: worker_threads,
	zlib: zlib,
	'default': core
});

var data = getCjsExportFromNamespace(core$1);

var current = (process.versions && process.versions.node && process.versions.node.split('.')) || [];

function specifierIncluded(specifier) {
    var parts = specifier.split(' ');
    var op = parts.length > 1 ? parts[0] : '=';
    var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

    for (var i = 0; i < 3; ++i) {
        var cur = Number(current[i] || 0);
        var ver = Number(versionParts[i] || 0);
        if (cur === ver) {
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        }
        if (op === '<') {
            return cur < ver;
        } else if (op === '>=') {
            return cur >= ver;
        } else {
            return false;
        }
    }
    return op === '>=';
}

function matchesRange(range) {
    var specifiers = range.split(/ ?&& ?/);
    if (specifiers.length === 0) { return false; }
    for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(specifiers[i])) { return false; }
    }
    return true;
}

function versionIncluded(specifierValue) {
    if (typeof specifierValue === 'boolean') { return specifierValue; }
    if (specifierValue && typeof specifierValue === 'object') {
        for (var i = 0; i < specifierValue.length; ++i) {
            if (matchesRange(specifierValue[i])) { return true; }
        }
        return false;
    }
    return matchesRange(specifierValue);
}



var core$2 = {};
for (var mod in data) { // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core$2[mod] = versionIncluded(data[mod]);
    }
}
var core_1 = core$2;

var caller = function () {
    // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    var origPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) { return stack; };
    var stack = (new Error()).stack;
    Error.prepareStackTrace = origPrepareStackTrace;
    return stack[2].getFileName();
};

var pathParse = createCommonjsModule(function (module) {

var isWindows = process.platform === 'win32';

// Regex to split a windows path into three parts: [*, device, slash,
// tail] windows-only
var splitDeviceRe =
    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

// Regex to split the tail part of the above into [*, dir, basename, ext]
var splitTailRe =
    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

var win32 = {};

// Function to split a filename into [root, dir, basename, ext]
function win32SplitPath(filename) {
  // Separate device+slash from tail
  var result = splitDeviceRe.exec(filename),
      device = (result[1] || '') + (result[2] || ''),
      tail = result[3] || '';
  // Split the tail into dir, basename and extension
  var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3];
  return [device, dir, basename, ext];
}

win32.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = win32SplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};



// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var posix = {};


function posixSplitPath(filename) {
  return splitPathRe.exec(filename).slice(1);
}


posix.parse = function(pathString) {
  if (typeof pathString !== 'string') {
    throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString
    );
  }
  var allParts = posixSplitPath(pathString);
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + pathString + "'");
  }
  allParts[1] = allParts[1] || '';
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  };
};


if (isWindows)
  module.exports = win32.parse;
else /* posix */
  module.exports = posix.parse;

module.exports.posix = posix.parse;
module.exports.win32 = win32.parse;
});
var pathParse_1 = pathParse.posix;
var pathParse_2 = pathParse.win32;

var parse = path$1.parse || pathParse;

var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
    var prefix = '/';
    if ((/^([A-Za-z]:)/).test(absoluteStart)) {
        prefix = '';
    } else if ((/^\\\\/).test(absoluteStart)) {
        prefix = '\\\\';
    }

    var paths = [absoluteStart];
    var parsed = parse(absoluteStart);
    while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse(parsed.dir);
    }

    return paths.reduce(function (dirs, aPath) {
        return dirs.concat(modules.map(function (moduleDir) {
            return path$1.resolve(prefix, aPath, moduleDir);
        }));
    }, []);
};

var nodeModulesPaths = function nodeModulesPaths(start, opts, request) {
    var modules = opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ['node_modules'];

    if (opts && typeof opts.paths === 'function') {
        return opts.paths(
            request,
            start,
            function () { return getNodeModulesDirs(start, modules); },
            opts
        );
    }

    var dirs = getNodeModulesDirs(start, modules);
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
};

var normalizeOptions = function (x, opts) {
    /**
     * This file is purposefully a passthrough. It's expected that third-party
     * environments will override it at runtime in order to inject special logic
     * into `resolve` (by manipulating the options). One such example is the PnP
     * code path in Yarn.
     */

    return opts || {};
};

var isCore = function isCore(x) {
    return Object.prototype.hasOwnProperty.call(core_1, x);
};

var defaultIsFile = function isFile(file, cb) {
    fs$1.stat(file, function (err, stat) {
        if (!err) {
            return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

var defaultIsDir = function isDirectory(dir, cb) {
    fs$1.stat(dir, function (err, stat) {
        if (!err) {
            return cb(null, stat.isDirectory());
        }
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
        return cb(err);
    });
};

var maybeUnwrapSymlink = function maybeUnwrapSymlink(x, opts, cb) {
    if (opts && opts.preserveSymlinks === false) {
        fs$1.realpath(x, function (realPathErr, realPath) {
            if (realPathErr && realPathErr.code !== 'ENOENT') cb(realPathErr);
            else cb(null, realPathErr ? x : realPath);
        });
    } else {
        cb(null, x);
    }
};

var async = function resolve(x, options, callback) {
    var cb = callback;
    var opts = options;
    if (typeof options === 'function') {
        cb = opts;
        opts = {};
    }
    if (typeof x !== 'string') {
        var err = new TypeError('Path must be a string.');
        return process.nextTick(function () {
            cb(err);
        });
    }

    opts = normalizeOptions(x, opts);

    var isFile = opts.isFile || defaultIsFile;
    var isDirectory = opts.isDirectory || defaultIsDir;
    var readFile = opts.readFile || fs$1.readFile;

    var extensions = opts.extensions || ['.js'];
    var basedir = opts.basedir || path$1.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = path$1.resolve(basedir);

    maybeUnwrapSymlink(
        absoluteStart,
        opts,
        function (err, realStart) {
            if (err) cb(err);
            else init(realStart);
        }
    );

    var res;
    function init(basedir) {
        if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
            res = path$1.resolve(basedir, x);
            if (x === '..' || x.slice(-1) === '/') res += '/';
            if ((/\/$/).test(x) && res === basedir) {
                loadAsDirectory(res, opts.package, onfile);
            } else loadAsFile(res, opts.package, onfile);
        } else loadNodeModules(x, basedir, function (err, n, pkg) {
            if (err) cb(err);
            else if (isCore(x)) return cb(null, x);
            else if (n) {
                return maybeUnwrapSymlink(n, opts, function (err, realN) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, realN, pkg);
                    }
                });
            } else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function onfile(err, m, pkg) {
        if (err) cb(err);
        else if (m) cb(null, m, pkg);
        else loadAsDirectory(res, function (err, d, pkg) {
            if (err) cb(err);
            else if (d) {
                maybeUnwrapSymlink(d, opts, function (err, realD) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, realD, pkg);
                    }
                });
            } else {
                var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                moduleError.code = 'MODULE_NOT_FOUND';
                cb(moduleError);
            }
        });
    }

    function loadAsFile(x, thePackage, callback) {
        var loadAsFilePackage = thePackage;
        var cb = callback;
        if (typeof loadAsFilePackage === 'function') {
            cb = loadAsFilePackage;
            loadAsFilePackage = undefined;
        }

        var exts = [''].concat(extensions);
        load(exts, x, loadAsFilePackage);

        function load(exts, x, loadPackage) {
            if (exts.length === 0) return cb(null, undefined, loadPackage);
            var file = x + exts[0];

            var pkg = loadPackage;
            if (pkg) onpkg(null, pkg);
            else loadpkg(path$1.dirname(file), onpkg);

            function onpkg(err, pkg_, dir) {
                pkg = pkg_;
                if (err) return cb(err);
                if (dir && pkg && opts.pathFilter) {
                    var rfile = path$1.relative(dir, file);
                    var rel = rfile.slice(0, rfile.length - exts[0].length);
                    var r = opts.pathFilter(pkg, x, rel);
                    if (r) return load(
                        [''].concat(extensions.slice()),
                        path$1.resolve(dir, r),
                        pkg
                    );
                }
                isFile(file, onex);
            }
            function onex(err, ex) {
                if (err) return cb(err);
                if (ex) return cb(null, file, pkg);
                load(exts.slice(1), x, pkg);
            }
        }
    }

    function loadpkg(dir, cb) {
        if (dir === '' || dir === '/') return cb(null);
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return cb(null);
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return cb(null);

        maybeUnwrapSymlink(dir, opts, function (unwrapErr, pkgdir) {
            if (unwrapErr) return loadpkg(path$1.dirname(dir), cb);
            var pkgfile = path$1.join(pkgdir, 'package.json');
            isFile(pkgfile, function (err, ex) {
                // on err, ex is false
                if (!ex) return loadpkg(path$1.dirname(dir), cb);

                readFile(pkgfile, function (err, body) {
                    if (err) cb(err);
                    try { var pkg = JSON.parse(body); } catch (jsonErr) {}

                    if (pkg && opts.packageFilter) {
                        pkg = opts.packageFilter(pkg, pkgfile);
                    }
                    cb(null, pkg, dir);
                });
            });
        });
    }

    function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
        var cb = callback;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === 'function') {
            cb = fpkg;
            fpkg = opts.package;
        }

        maybeUnwrapSymlink(x, opts, function (unwrapErr, pkgdir) {
            if (unwrapErr) return cb(unwrapErr);
            var pkgfile = path$1.join(pkgdir, 'package.json');
            isFile(pkgfile, function (err, ex) {
                if (err) return cb(err);
                if (!ex) return loadAsFile(path$1.join(x, 'index'), fpkg, cb);

                readFile(pkgfile, function (err, body) {
                    if (err) return cb(err);
                    try {
                        var pkg = JSON.parse(body);
                    } catch (jsonErr) {}

                    if (pkg && opts.packageFilter) {
                        pkg = opts.packageFilter(pkg, pkgfile);
                    }

                    if (pkg && pkg.main) {
                        if (typeof pkg.main !== 'string') {
                            var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                            mainError.code = 'INVALID_PACKAGE_MAIN';
                            return cb(mainError);
                        }
                        if (pkg.main === '.' || pkg.main === './') {
                            pkg.main = 'index';
                        }
                        loadAsFile(path$1.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                            if (err) return cb(err);
                            if (m) return cb(null, m, pkg);
                            if (!pkg) return loadAsFile(path$1.join(x, 'index'), pkg, cb);

                            var dir = path$1.resolve(x, pkg.main);
                            loadAsDirectory(dir, pkg, function (err, n, pkg) {
                                if (err) return cb(err);
                                if (n) return cb(null, n, pkg);
                                loadAsFile(path$1.join(x, 'index'), pkg, cb);
                            });
                        });
                        return;
                    }

                    loadAsFile(path$1.join(x, '/index'), pkg, cb);
                });
            });
        });
    }

    function processDirs(cb, dirs) {
        if (dirs.length === 0) return cb(null, undefined);
        var dir = dirs[0];

        isDirectory(dir, isdir);

        function isdir(err, isdir) {
            if (err) return cb(err);
            if (!isdir) return processDirs(cb, dirs.slice(1));
            var file = path$1.join(dir, x);
            loadAsFile(file, opts.package, onfile);
        }

        function onfile(err, m, pkg) {
            if (err) return cb(err);
            if (m) return cb(null, m, pkg);
            loadAsDirectory(path$1.join(dir, x), opts.package, ondir);
        }

        function ondir(err, n, pkg) {
            if (err) return cb(err);
            if (n) return cb(null, n, pkg);
            processDirs(cb, dirs.slice(1));
        }
    }
    function loadNodeModules(x, start, cb) {
        processDirs(cb, nodeModulesPaths(start, opts, x));
    }
};

var defaultIsFile$1 = function isFile(file) {
    try {
        var stat = fs$1.statSync(file);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isFile() || stat.isFIFO();
};

var defaultIsDir$1 = function isDirectory(dir) {
    try {
        var stat = fs$1.statSync(dir);
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
    return stat.isDirectory();
};

var maybeUnwrapSymlink$1 = function maybeUnwrapSymlink(x, opts) {
    if (opts && opts.preserveSymlinks === false) {
        try {
            return fs$1.realpathSync(x);
        } catch (realPathErr) {
            if (realPathErr.code !== 'ENOENT') {
                throw realPathErr;
            }
        }
    }
    return x;
};

var sync = function (x, options) {
    if (typeof x !== 'string') {
        throw new TypeError('Path must be a string.');
    }
    var opts = normalizeOptions(x, options);

    var isFile = opts.isFile || defaultIsFile$1;
    var readFileSync = opts.readFileSync || fs$1.readFileSync;
    var isDirectory = opts.isDirectory || defaultIsDir$1;

    var extensions = opts.extensions || ['.js'];
    var basedir = opts.basedir || path$1.dirname(caller());
    var parent = opts.filename || basedir;

    opts.paths = opts.paths || [];

    // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
    var absoluteStart = maybeUnwrapSymlink$1(path$1.resolve(basedir), opts);

    if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
        var res = path$1.resolve(absoluteStart, x);
        if (x === '..' || x.slice(-1) === '/') res += '/';
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m) return maybeUnwrapSymlink$1(m, opts);
    } else if (isCore(x)) {
        return x;
    } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n) return maybeUnwrapSymlink$1(n, opts);
    }

    if (isCore(x)) return x;

    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;

    function loadAsFileSync(x) {
        var pkg = loadpkg(path$1.dirname(x));

        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
            var rfile = path$1.relative(pkg.dir, x);
            var r = opts.pathFilter(pkg.pkg, x, rfile);
            if (r) {
                x = path$1.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
            }
        }

        if (isFile(x)) {
            return x;
        }

        for (var i = 0; i < extensions.length; i++) {
            var file = x + extensions[i];
            if (isFile(file)) {
                return file;
            }
        }
    }

    function loadpkg(dir) {
        if (dir === '' || dir === '/') return;
        if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
            return;
        }
        if ((/[/\\]node_modules[/\\]*$/).test(dir)) return;

        var pkgfile = path$1.join(maybeUnwrapSymlink$1(dir, opts), 'package.json');

        if (!isFile(pkgfile)) {
            return loadpkg(path$1.dirname(dir));
        }

        var body = readFileSync(pkgfile);

        try {
            var pkg = JSON.parse(body);
        } catch (jsonErr) {}

        if (pkg && opts.packageFilter) {
            // v2 will pass pkgfile
            pkg = opts.packageFilter(pkg, /*pkgfile,*/ dir); // eslint-disable-line spaced-comment
        }

        return { pkg: pkg, dir: dir };
    }

    function loadAsDirectorySync(x) {
        var pkgfile = path$1.join(maybeUnwrapSymlink$1(x, opts), '/package.json');
        if (isFile(pkgfile)) {
            try {
                var body = readFileSync(pkgfile, 'UTF8');
                var pkg = JSON.parse(body);
            } catch (e) {}

            if (pkg && opts.packageFilter) {
                // v2 will pass pkgfile
                pkg = opts.packageFilter(pkg, /*pkgfile,*/ x); // eslint-disable-line spaced-comment
            }

            if (pkg && pkg.main) {
                if (typeof pkg.main !== 'string') {
                    var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                    mainError.code = 'INVALID_PACKAGE_MAIN';
                    throw mainError;
                }
                if (pkg.main === '.' || pkg.main === './') {
                    pkg.main = 'index';
                }
                try {
                    var m = loadAsFileSync(path$1.resolve(x, pkg.main));
                    if (m) return m;
                    var n = loadAsDirectorySync(path$1.resolve(x, pkg.main));
                    if (n) return n;
                } catch (e) {}
            }
        }

        return loadAsFileSync(path$1.join(x, '/index'));
    }

    function loadNodeModulesSync(x, start) {
        var dirs = nodeModulesPaths(start, opts, x);
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            if (isDirectory(dir)) {
                var m = loadAsFileSync(path$1.join(dir, '/', x));
                if (m) return m;
                var n = loadAsDirectorySync(path$1.join(dir, '/', x));
                if (n) return n;
            }
        }
    }
};

var resolve = createCommonjsModule(function (module, exports) {
// rollup has troubles figuring out the exports
// even with a namedExports option in the commonjs plugin
// idk, this should fix it :)

exports = module.exports = async;
exports.core = core_1;
exports.isCore = function(x) {
  return core_1[x];
};
exports.sync = sync;
});
var resolve_1 = resolve.core;
var resolve_2 = resolve.isCore;
var resolve_3 = resolve.sync;

function walk(ast, { enter, leave }) {
	return visit(ast, null, enter, leave);
}

let should_skip = false;
let should_remove = false;
let replacement = null;
const context = {
	skip: () => should_skip = true,
	remove: () => should_remove = true,
	replace: (node) => replacement = node
};

function replace(parent, prop, index, node) {
	if (parent) {
		if (index !== null) {
			parent[prop][index] = node;
		} else {
			parent[prop] = node;
		}
	}
}

function remove(parent, prop, index) {
	if (parent) {
		if (index !== null) {
			parent[prop].splice(index, 1);
		} else {
			delete parent[prop];
		}
	}
}

function visit(
	node,
	parent,
	enter,
	leave,
	prop,
	index
) {
	if (node) {
		if (enter) {
			const _should_skip = should_skip;
			const _should_remove = should_remove;
			const _replacement = replacement;
			should_skip = false;
			should_remove = false;
			replacement = null;

			enter.call(context, node, parent, prop, index);

			if (replacement) {
				node = replacement;
				replace(parent, prop, index, node);
			}

			if (should_remove) {
				remove(parent, prop, index);
			}

			const skipped = should_skip;
			const removed = should_remove;

			should_skip = _should_skip;
			should_remove = _should_remove;
			replacement = _replacement;

			if (skipped) return node;
			if (removed) return null;
		}

		for (const key in node) {
			const value = (node )[key];

			if (typeof value !== 'object') {
				continue;
			}

			else if (Array.isArray(value)) {
				for (let j = 0, k = 0; j < value.length; j += 1, k += 1) {
					if (value[j] !== null && typeof value[j].type === 'string') {
						if (!visit(value[j], node, enter, leave, key, k)) {
							// removed
							j--;
						}
					}
				}
			}

			else if (value !== null && typeof value.type === 'string') {
				visit(value, node, enter, leave, key, null);
			}
		}

		if (leave) {
			const _replacement = replacement;
			const _should_remove = should_remove;
			replacement = null;
			should_remove = false;

			leave.call(context, node, parent, prop, index);

			if (replacement) {
				node = replacement;
				replace(parent, prop, index, node);
			}

			if (should_remove) {
				remove(parent, prop, index);
			}

			const removed = should_remove;

			replacement = _replacement;
			should_remove = _should_remove;

			if (removed) return null;
		}
	}

	return node;
}

const addExtension = function addExtension(filename, ext = '.js') {
    let result = `${filename}`;
    if (!extname(filename))
        result += ext;
    return result;
};

const extractors = {
    ArrayPattern(names, param) {
        for (const element of param.elements) {
            if (element)
                extractors[element.type](names, element);
        }
    },
    AssignmentPattern(names, param) {
        extractors[param.left.type](names, param.left);
    },
    Identifier(names, param) {
        names.push(param.name);
    },
    MemberExpression() { },
    ObjectPattern(names, param) {
        for (const prop of param.properties) {
            // @ts-ignore Typescript reports that this is not a valid type
            if (prop.type === 'RestElement') {
                extractors.RestElement(names, prop);
            }
            else {
                extractors[prop.value.type](names, prop.value);
            }
        }
    },
    RestElement(names, param) {
        extractors[param.argument.type](names, param.argument);
    }
};
const extractAssignedNames = function extractAssignedNames(param) {
    const names = [];
    extractors[param.type](names, param);
    return names;
};

const blockDeclarations = {
    const: true,
    let: true
};
class Scope {
    constructor(options = {}) {
        this.parent = options.parent;
        this.isBlockScope = !!options.block;
        this.declarations = Object.create(null);
        if (options.params) {
            options.params.forEach((param) => {
                extractAssignedNames(param).forEach((name) => {
                    this.declarations[name] = true;
                });
            });
        }
    }
    addDeclaration(node, isBlockDeclaration, isVar) {
        if (!isBlockDeclaration && this.isBlockScope) {
            // it's a `var` or function node, and this
            // is a block scope, so we need to go up
            this.parent.addDeclaration(node, isBlockDeclaration, isVar);
        }
        else if (node.id) {
            extractAssignedNames(node.id).forEach((name) => {
                this.declarations[name] = true;
            });
        }
    }
    contains(name) {
        return this.declarations[name] || (this.parent ? this.parent.contains(name) : false);
    }
}
const attachScopes = function attachScopes(ast, propertyName = 'scope') {
    let scope = new Scope();
    walk(ast, {
        enter(n, parent) {
            const node = n;
            // function foo () {...}
            // class Foo {...}
            if (/(Function|Class)Declaration/.test(node.type)) {
                scope.addDeclaration(node, false, false);
            }
            // var foo = 1
            if (node.type === 'VariableDeclaration') {
                const { kind } = node;
                const isBlockDeclaration = blockDeclarations[kind];
                // don't add const/let declarations in the body of a for loop #113
                const parentType = parent ? parent.type : '';
                if (!(isBlockDeclaration && /ForOfStatement/.test(parentType))) {
                    node.declarations.forEach((declaration) => {
                        scope.addDeclaration(declaration, isBlockDeclaration, true);
                    });
                }
            }
            let newScope;
            // create new function scope
            if (/Function/.test(node.type)) {
                const func = node;
                newScope = new Scope({
                    parent: scope,
                    block: false,
                    params: func.params
                });
                // named function expressions - the name is considered
                // part of the function's scope
                if (func.type === 'FunctionExpression' && func.id) {
                    newScope.addDeclaration(func, false, false);
                }
            }
            // create new block scope
            if (node.type === 'BlockStatement' && !/Function/.test(parent.type)) {
                newScope = new Scope({
                    parent: scope,
                    block: true
                });
            }
            // catch clause has its own block scope
            if (node.type === 'CatchClause') {
                newScope = new Scope({
                    parent: scope,
                    params: node.param ? [node.param] : [],
                    block: true
                });
            }
            if (newScope) {
                Object.defineProperty(node, propertyName, {
                    value: newScope,
                    configurable: true
                });
                scope = newScope;
            }
        },
        leave(n) {
            const node = n;
            if (node[propertyName])
                scope = scope.parent;
        }
    });
    return scope;
};

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var utils = createCommonjsModule$1(function (module, exports) {

exports.isInteger = num => {
  if (typeof num === 'number') {
    return Number.isInteger(num);
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isInteger(Number(num));
  }
  return false;
};

/**
 * Find a node of the given type
 */

exports.find = (node, type) => node.nodes.find(node => node.type === type);

/**
 * Find a node of the given type
 */

exports.exceedsLimit = (min, max, step = 1, limit) => {
  if (limit === false) return false;
  if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
  return ((Number(max) - Number(min)) / Number(step)) >= limit;
};

/**
 * Escape the given node with '\\' before node.value
 */

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (!node) return;

  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
    if (node.escaped !== true) {
      node.value = '\\' + node.value;
      node.escaped = true;
    }
  }
};

/**
 * Returns true if the given brace node should be enclosed in literal braces
 */

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a brace node is invalid.
 */

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
    block.invalid = true;
    return true;
  }
  if (block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

/**
 * Returns true if a node is an open or close node
 */

exports.isOpenOrClose = node => {
  if (node.type === 'open' || node.type === 'close') {
    return true;
  }
  return node.open === true || node.close === true;
};

/**
 * Reduce an array of text nodes.
 */

exports.reduce = nodes => nodes.reduce((acc, node) => {
  if (node.type === 'text') acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

/**
 * Flatten an array
 */

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele) : ele !== void 0 && result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};
});
var utils_1 = utils.isInteger;
var utils_2 = utils.find;
var utils_3 = utils.exceedsLimit;
var utils_4 = utils.escapeNode;
var utils_5 = utils.encloseBrace;
var utils_6 = utils.isInvalidBrace;
var utils_7 = utils.isOpenOrClose;
var utils_8 = utils.reduce;
var utils_9 = utils.flatten;

var stringify = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let output = '';

    if (node.value) {
      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
        return '\\' + node.value;
      }
      return node.value;
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += stringify(child);
      }
    }
    return output;
  };

  return stringify(ast);
};

/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var isNumber = function(num) {
  if (typeof num === 'number') {
    return num - num === 0;
  }
  if (typeof num === 'string' && num.trim() !== '') {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false) {
    throw new TypeError('toRegexRange: expected the first argument to be a number');
  }

  if (max === void 0 || min === max) {
    return String(min);
  }

  if (isNumber(max) === false) {
    throw new TypeError('toRegexRange: expected the second argument to be a number.');
  }

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros === 'boolean') {
    opts.relaxZeros = opts.strictZeros === false;
  }

  let relax = String(opts.relaxZeros);
  let shorthand = String(opts.shorthand);
  let capture = String(opts.capture);
  let wrap = String(opts.wrap);
  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
    return toRegexRange.cache[cacheKey].result;
  }

  let a = Math.min(min, max);
  let b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    if (opts.capture) {
      return `(${result})`;
    }
    if (opts.wrap === false) {
      return result;
    }
    return `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max);
  let state = { min, max, a, b };
  let positives = [];
  let negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    let newMin = b < 0 ? Math.abs(b) : 1;
    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) {
    positives = splitToPatterns(a, b, state, opts);
  }

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives);

  if (opts.capture === true) {
    state.result = `(${state.result})`;
  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
    state.result = `(?:${state.result})`;
  }

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false) || [];
  let onlyPositive = filterPatterns(pos, neg, '', false) || [];
  let intersected = filterPatterns(neg, pos, '-?', true) || [];
  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
  return subpatterns.join('|');
}

function splitToRanges(min, max) {
  let nines = 1;
  let zeros = 1;

  let stop = countNines(min, nines);
  let stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */

function rangeToPattern(start, stop, options) {
  if (start === stop) {
    return { pattern: start, count: [], digits: 0 };
  }

  let zipped = zip(start, stop);
  let digits = zipped.length;
  let pattern = '';
  let count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    if (startDigit === stopDigit) {
      pattern += startDigit;

    } else if (startDigit !== '0' || stopDigit !== '9') {
      pattern += toCharacterClass(startDigit, stopDigit);

    } else {
      count++;
    }
  }

  if (count) {
    pattern += options.shorthand === true ? '\\d' : '[0-9]';
  }

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max);
  let tokens = [];
  let start = min;
  let prev;

  for (let i = 0; i < ranges.length; i++) {
    let max = ranges[i];
    let obj = rangeToPattern(String(start), String(max), options);
    let zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      if (prev.count.length > 1) {
        prev.count.pop();
      }

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) {
      zeros = padZeros(max, tok, options);
    }

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    // only push if _both_ are negative...
    if (!intersection && !contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }

    // or _both_ are positive
    if (intersection && contains(comparison, 'string', string)) {
      result.push(prefix + string);
    }
  }
  return result;
}

/**
 * Zip strings
 */

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  if (stop || start > 1) {
    return `{${start + (stop ? ',' + stop : '')}}`;
  }
  return '';
}

function toCharacterClass(a, b, options) {
  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) {
    return value;
  }

  let diff = Math.abs(tok.maxLen - String(value).length);
  let relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default: {
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
}

/**
 * Cache
 */

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

/**
 * Expose `toRegexRange`
 */

var toRegexRange_1 = toRegexRange;

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

const transform = toNumber => {
  return value => toNumber === true ? Number(value) : String(value);
};

const isValidValue = value => {
  return typeof value === 'number' || (typeof value === 'string' && value !== '');
};

const isNumber$1 = num => Number.isInteger(+num);

const zeros = input => {
  let value = `${input}`;
  let index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify$1 = (start, end, options) => {
  if (typeof start === 'string' || typeof end === 'string') {
    return true;
  }
  return options.stringify === true;
};

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
  }
  if (toNumber === false) {
    return String(input);
  }
  return input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? ('-' + input) : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

  let prefix = options.capture ? '' : '?:';
  let positives = '';
  let negatives = '';
  let result;

  if (parts.positives.length) {
    positives = parts.positives.join('|');
  }

  if (parts.negatives.length) {
    negatives = `-(${prefix}${parts.negatives.join('|')})`;
  }

  if (positives && negatives) {
    result = `${positives}|${negatives}`;
  } else {
    result = positives || negatives;
  }

  if (options.wrap) {
    return `(${prefix}${result})`;
  }

  return result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) {
    return toRegexRange_1(a, b, { wrap: false, ...options });
  }

  let start = String.fromCharCode(a);
  if (a === b) return start;

  let stop = String.fromCharCode(b);
  return `[${start}-${stop}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true;
    let prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange_1(start, end, options);
};

const rangeError = (...args) => {
  return new RangeError('Invalid range arguments: ' + util$1.inspect(...args));
};

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true) {
    throw new TypeError(`Expected step "${step}" to be a number`);
  }
  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start);
  let b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  // fix negative zero
  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b;
  let startString = String(start);
  let endString = String(end);
  let stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
  let toNumber = padded === false && stringify$1(start, end, options) === false;
  let format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1) {
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
  }

  let parts = { negatives: [], positives: [] };
  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    if (options.toRegex === true && step > 1) {
      push(a);
    } else {
      range.push(pad(format(a, index), maxLen, toNumber));
    }
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options });
  }

  return range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber$1(start) && start.length > 1) || (!isNumber$1(end) && end.length > 1)) {
    return invalidRange(start, end, options);
  }


  let format = options.transform || (val => String.fromCharCode(val));
  let a = `${start}`.charCodeAt(0);
  let b = `${end}`.charCodeAt(0);

  let descending = a > b;
  let min = Math.min(a, b);
  let max = Math.max(a, b);

  if (options.toRegex && step === 1) {
    return toRange(min, max, false, options);
  }

  let range = [];
  let index = 0;

  while (descending ? a >= b : a <= b) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  if (options.toRegex === true) {
    return toRegex(range, null, { wrap: false, options });
  }

  return range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) {
    return [start];
  }

  if (!isValidValue(start) || !isValidValue(end)) {
    return invalidRange(start, end, options);
  }

  if (typeof step === 'function') {
    return fill(start, end, 1, { transform: step });
  }

  if (isObject(step)) {
    return fill(start, end, 0, step);
  }

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  if (!isNumber$1(step)) {
    if (step != null && !isObject(step)) return invalidStep(step, opts);
    return fill(start, end, 1, step);
  }

  if (isNumber$1(start) && isNumber$1(end)) {
    return fillNumbers(start, end, step, opts);
  }

  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

var fillRange = fill;

const compile = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent);
    let invalidNode = node.invalid === true && options.escapeInvalid === true;
    let invalid = invalidBlock === true || invalidNode === true;
    let prefix = options.escapeInvalid === true ? '\\' : '';
    let output = '';

    if (node.isOpen === true) {
      return prefix + node.value;
    }
    if (node.isClose === true) {
      return prefix + node.value;
    }

    if (node.type === 'open') {
      return invalid ? (prefix + node.value) : '(';
    }

    if (node.type === 'close') {
      return invalid ? (prefix + node.value) : ')';
    }

    if (node.type === 'comma') {
      return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
    }

    if (node.value) {
      return node.value;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);
      let range = fillRange(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0) {
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
    }

    if (node.nodes) {
      for (let child of node.nodes) {
        output += walk(child, node);
      }
    }
    return output;
  };

  return walk(ast);
};

var compile_1 = compile;

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);
  stash = [].concat(stash);

  if (!stash.length) return queue;
  if (!queue.length) {
    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
  }

  for (let item of queue) {
    if (Array.isArray(item)) {
      for (let value of item) {
        result.push(append(value, stash, enclose));
      }
    } else {
      for (let ele of stash) {
        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
      }
    }
  }
  return utils.flatten(result);
};

const expand = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent;
    let q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
      }

      let range = fillRange(...args, options);
      if (range.length === 0) {
        range = stringify(node, options);
      }

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node);
    let queue = node.queue;
    let block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        if (i === 1) queue.push('');
        queue.push('');
        continue;
      }

      if (child.type === 'close') {
        q.push(append(q.pop(), queue, enclose));
        continue;
      }

      if (child.value && child.type !== 'open') {
        queue.push(append(queue.pop(), child.value));
        continue;
      }

      if (child.nodes) {
        walk(child, node);
      }
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

var expand_1 = expand;

var constants$1 = {
  MAX_LENGTH: 1024 * 64,

  // Digits
  CHAR_0: '0', /* 0 */
  CHAR_9: '9', /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 'A', /* A */
  CHAR_LOWERCASE_A: 'a', /* a */
  CHAR_UPPERCASE_Z: 'Z', /* Z */
  CHAR_LOWERCASE_Z: 'z', /* z */

  CHAR_LEFT_PARENTHESES: '(', /* ( */
  CHAR_RIGHT_PARENTHESES: ')', /* ) */

  CHAR_ASTERISK: '*', /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: '&', /* & */
  CHAR_AT: '@', /* @ */
  CHAR_BACKSLASH: '\\', /* \ */
  CHAR_BACKTICK: '`', /* ` */
  CHAR_CARRIAGE_RETURN: '\r', /* \r */
  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
  CHAR_COLON: ':', /* : */
  CHAR_COMMA: ',', /* , */
  CHAR_DOLLAR: '$', /* . */
  CHAR_DOT: '.', /* . */
  CHAR_DOUBLE_QUOTE: '"', /* " */
  CHAR_EQUAL: '=', /* = */
  CHAR_EXCLAMATION_MARK: '!', /* ! */
  CHAR_FORM_FEED: '\f', /* \f */
  CHAR_FORWARD_SLASH: '/', /* / */
  CHAR_HASH: '#', /* # */
  CHAR_HYPHEN_MINUS: '-', /* - */
  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
  CHAR_LEFT_CURLY_BRACE: '{', /* { */
  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
  CHAR_LINE_FEED: '\n', /* \n */
  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
  CHAR_PERCENT: '%', /* % */
  CHAR_PLUS: '+', /* + */
  CHAR_QUESTION_MARK: '?', /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
  CHAR_SEMICOLON: ';', /* ; */
  CHAR_SINGLE_QUOTE: '\'', /* ' */
  CHAR_SPACE: ' ', /*   */
  CHAR_TAB: '\t', /* \t */
  CHAR_UNDERSCORE: '_', /* _ */
  CHAR_VERTICAL_LINE: '|', /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
};

/**
 * Constants
 */

const {
  MAX_LENGTH,
  CHAR_BACKSLASH, /* \ */
  CHAR_BACKTICK, /* ` */
  CHAR_COMMA, /* , */
  CHAR_DOT, /* . */
  CHAR_LEFT_PARENTHESES, /* ( */
  CHAR_RIGHT_PARENTHESES, /* ) */
  CHAR_LEFT_CURLY_BRACE, /* { */
  CHAR_RIGHT_CURLY_BRACE, /* } */
  CHAR_LEFT_SQUARE_BRACKET, /* [ */
  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
  CHAR_DOUBLE_QUOTE, /* " */
  CHAR_SINGLE_QUOTE, /* ' */
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = constants$1;

/**
 * parse
 */

const parse$1 = (input, options = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  let opts = options || {};
  let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max) {
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
  }

  let ast = { type: 'root', input, nodes: [] };
  let stack = [ast];
  let block = ast;
  let prev = ast;
  let brackets = 0;
  let length = input.length;
  let index = 0;
  let depth = 0;
  let value;

  /**
   * Helpers
   */

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') {
      prev.type = 'text';
    }

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    /**
     * Invalid chars
     */

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
      continue;
    }

    /**
     * Escaped chars
     */

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    /**
     * Right square bracket (literal): ']'
     */

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    /**
     * Left square bracket: '['
     */

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;
      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) {
          brackets++;
          continue;
        }

        if (next === CHAR_BACKSLASH) {
          value += advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) {
            break;
          }
        }
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Parentheses
     */

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Quotes: '|"|`
     */

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let open = value;
      let next;

      if (options.keepQuotes !== true) {
        value = '';
      }

      while (index < length && (next = advance())) {
        if (next === CHAR_BACKSLASH) {
          value += next + advance();
          continue;
        }

        if (next === open) {
          if (options.keepQuotes === true) value += next;
          break;
        }

        value += next;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Left curly brace: '{'
     */

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
      let brace = {
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      };

      block = push(brace);
      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    /**
     * Right curly brace: '}'
     */

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    /**
     * Comma: ','
     */

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    /**
     * Dot: '.'
     */

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    /**
     * Text
     */

    push({ type: 'text', value });
  }

  // Mark imbalanced braces and brackets as invalid
  do {
    block = stack.pop();

    if (block.type !== 'root') {
      block.nodes.forEach(node => {
        if (!node.nodes) {
          if (node.type === 'open') node.isOpen = true;
          if (node.type === 'close') node.isClose = true;
          if (!node.nodes) node.type = 'text';
          node.invalid = true;
        }
      });

      // get the location of the block on parent.nodes (block's siblings)
      let parent = stack[stack.length - 1];
      let index = parent.nodes.indexOf(block);
      // replace the (invalid) block with it's nodes
      parent.nodes.splice(index, 1, ...block.nodes);
    }
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

var parse_1 = parse$1;

/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input)) {
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      if (Array.isArray(result)) {
        output.push(...result);
      } else {
        output.push(result);
      }
    }
  } else {
    output = [].concat(braces.create(input, options));
  }

  if (options && options.expand === true && options.nodupes === true) {
    output = [...new Set(output)];
  }
  return output;
};

/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */

braces.parse = (input, options = {}) => parse_1(input, options);

/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.stringify = (input, options = {}) => {
  if (typeof input === 'string') {
    return stringify(braces.parse(input, options), options);
  }
  return stringify(input, options);
};

/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.compile = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }
  return compile_1(input, options);
};

/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.expand = (input, options = {}) => {
  if (typeof input === 'string') {
    input = braces.parse(input, options);
  }

  let result = expand_1(input, options);

  // filter out empty strings if specified
  if (options.noempty === true) {
    result = result.filter(Boolean);
  }

  // filter out duplicates if specified
  if (options.nodupes === true) {
    result = [...new Set(result)];
  }

  return result;
};

/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */

braces.create = (input, options = {}) => {
  if (input === '' || input.length < 3) {
    return [input];
  }

 return options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);
};

/**
 * Expose "braces"
 */

var braces_1 = braces;

const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

var constants$1$1 = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path$1.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};

var utils$1 = createCommonjsModule$1(function (module, exports) {


const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = constants$1$1;

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path$1.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};
});
var utils_1$1 = utils$1.isObject;
var utils_2$1 = utils$1.hasRegexChars;
var utils_3$1 = utils$1.isRegexChar;
var utils_4$1 = utils$1.escapeRegex;
var utils_5$1 = utils$1.toPosixSlashes;
var utils_6$1 = utils$1.removeBackslashes;
var utils_7$1 = utils$1.supportsLookbehinds;
var utils_8$1 = utils$1.isWindows;
var utils_9$1 = utils$1.escapeLast;
var utils_10 = utils$1.removePrefix;
var utils_11 = utils$1.wrapOutput;

const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA: CHAR_COMMA$1,                /* , */
  CHAR_DOT: CHAR_DOT$1,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1,     /* { */
  CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1,    /* } */
  CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1  /* ] */
} = constants$1$1;

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE$1) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE$1) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE$1) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT$1 && (code = advance()) === CHAR_DOT$1) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA$1) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE$1) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT$1 && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES$1) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES$1) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET$1) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES$1) {
      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          continue;
        }

        if (code === CHAR_RIGHT_PARENTHESES$1) {
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils$1.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils$1.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

var scan_1 = scan;

/**
 * Constants
 */

const {
  MAX_LENGTH: MAX_LENGTH$1,
  POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants$1$1;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils$1.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse$1$1 = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils$1.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants$1$1.globChars(win32);
  const EXTGLOB_CHARS = constants$1$1.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils$1.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');


    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils$1.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE$1[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils$1.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils$1.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils$1.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = `\\}`;
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils$1.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils$1.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils$1.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils$1.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse$1$1.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils$1.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants$1$1.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils$1.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

var parse_1$1 = parse$1$1;

const isObject$1 = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject$1(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils$1.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils$1.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils$1.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path$1.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse_1$1(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan_1(input, options);

/**
 * Create a regular expression from a glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.makeRe(input[, options]);
 *
 * console.log(picomatch.makeRe('*.js'));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `input` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse_1$1.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse_1$1(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants$1$1;

/**
 * Expose "picomatch"
 */

var picomatch_1 = picomatch;

var picomatch$1 = picomatch_1;

const isEmptyString = val => typeof val === 'string' && (val === '' || val === './');

/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} list List of strings to match.
 * @param {String|Array<string>} patterns One or more glob patterns to use for matching.
 * @param {Object} options See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */

const micromatch = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);

  let omit = new Set();
  let keep = new Set();
  let items = new Set();
  let negatives = 0;

  let onResult = state => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };

  for (let i = 0; i < patterns.length; i++) {
    let isMatch = picomatch$1(String(patterns[i]), { ...options, onResult }, true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated) negatives++;

    for (let item of list) {
      let matched = isMatch(item, true);

      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match) continue;

      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }

  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter(item => !omit.has(item));

  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(', ')}"`);
    }

    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
    }
  }

  return matches;
};

/**
 * Backwards compatibility
 */

micromatch.match = micromatch;

/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = (pattern, options) => picomatch$1(pattern, options);

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.isMatch = (str, patterns, options) => picomatch$1(patterns, options)(str);

/**
 * Backwards compatibility
 */

micromatch.any = micromatch.isMatch;

/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */

micromatch.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = new Set();
  let items = [];

  let onResult = state => {
    if (options.onResult) options.onResult(state);
    items.push(state.output);
  };

  let matches = micromatch(list, patterns, { ...options, onResult });

  for (let item of items) {
    if (!matches.includes(item)) {
      result.add(item);
    }
  }
  return [...result];
};

/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = (str, pattern, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util$1.inspect(str)}"`);
  }

  if (Array.isArray(pattern)) {
    return pattern.some(p => micromatch.contains(str, p, options));
  }

  if (typeof pattern === 'string') {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }

    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
      return true;
    }
  }

  return micromatch.isMatch(str, pattern, { ...options, contains: true });
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = (obj, patterns, options) => {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('Expected the first argument to be an object');
  }
  let keys = micromatch(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys) res[key] = obj[key];
  return res;
};

/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.some = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch$1(String(pattern), options);
    if (items.some(item => isMatch(item))) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);

  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch$1(String(pattern), options);
    if (!items.every(item => isMatch(item))) {
      return false;
    }
  }
  return true;
};

/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.all = (str, patterns, options) => {
  if (typeof str !== 'string') {
    throw new TypeError(`Expected a string: "${util$1.inspect(str)}"`);
  }

  return [].concat(patterns).every(p => picomatch$1(p, options)(str));
};

/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */

micromatch.capture = (glob, input, options) => {
  let posix = utils$1.isWindows(options);
  let regex = picomatch$1.makeRe(String(glob), { ...options, capture: true });
  let match = regex.exec(posix ? utils$1.toPosixSlashes(input) : input);

  if (match) {
    return match.slice(1).map(v => v === void 0 ? '' : v);
  }
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = (...args) => picomatch$1.makeRe(...args);

/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

micromatch.scan = (...args) => picomatch$1.scan(...args);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */

micromatch.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces_1(String(pattern), options)) {
      res.push(picomatch$1.parse(str, options));
    }
  }
  return res;
};

/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */

micromatch.braces = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return braces_1(pattern, options);
};

/**
 * Expand braces
 */

micromatch.braceExpand = (pattern, options) => {
  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
  return micromatch.braces(pattern, { ...options, expand: true });
};

/**
 * Expose micromatch
 */

var micromatch_1 = micromatch;

// Helper since Typescript can't detect readonly arrays with Array.isArray
function isArray(arg) {
    return Array.isArray(arg);
}
function ensureArray(thing) {
    if (isArray(thing))
        return thing;
    if (thing == null)
        return [];
    return [thing];
}

function getMatcherString(id, resolutionBase) {
    if (resolutionBase === false) {
        return id;
    }
    // resolve('') is valid and will default to process.cwd()
    const basePath = resolve$1(resolutionBase || '')
        .split(sep)
        .join('/')
        // escape all possible (posix + win) path characters that might interfere with regex
        .replace(/[-^$*+?.()|[\]{}]/g, '\\$&');
    // Note that we use posix.join because:
    // 1. the basePath has been normalized to use /
    // 2. the incoming glob (id) matcher, also uses /
    // otherwise Node will force backslash (\) on windows
    return posix.join(basePath, id);
}
const createFilter = function createFilter(include, exclude, options) {
    const resolutionBase = options && options.resolve;
    const getMatcher = (id) => id instanceof RegExp
        ? id
        : {
            test: (what) => {
                // this refactor is a tad overly verbose but makes for easy debugging
                const pattern = getMatcherString(id, resolutionBase);
                const fn = micromatch_1.matcher(pattern, { dot: true });
                const result = fn(what);
                return result;
            }
        };
    const includeMatchers = ensureArray(include).map(getMatcher);
    const excludeMatchers = ensureArray(exclude).map(getMatcher);
    return function result(id) {
        if (typeof id !== 'string')
            return false;
        if (/\0/.test(id))
            return false;
        const pathId = id.split(sep).join('/');
        for (let i = 0; i < excludeMatchers.length; ++i) {
            const matcher = excludeMatchers[i];
            if (matcher.test(pathId))
                return false;
        }
        for (let i = 0; i < includeMatchers.length; ++i) {
            const matcher = includeMatchers[i];
            if (matcher.test(pathId))
                return true;
        }
        return !includeMatchers.length;
    };
};

const reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public';
const builtins = 'arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl';
const forbiddenIdentifiers = new Set(`${reservedWords} ${builtins}`.split(' '));
forbiddenIdentifiers.add('');
const makeLegalIdentifier = function makeLegalIdentifier(str) {
    let identifier = str
        .replace(/-(\w)/g, (_, letter) => letter.toUpperCase())
        .replace(/[^$_a-zA-Z0-9]/g, '_');
    if (/\d/.test(identifier[0]) || forbiddenIdentifiers.has(identifier)) {
        identifier = `_${identifier}`;
    }
    return identifier || '_';
};

function stringify$2(obj) {
    return (JSON.stringify(obj) || 'undefined').replace(/[\u2028\u2029]/g, (char) => `\\u${`000${char.charCodeAt(0).toString(16)}`.slice(-4)}`);
}
function serializeArray(arr, indent, baseIndent) {
    let output = '[';
    const separator = indent ? `\n${baseIndent}${indent}` : '';
    for (let i = 0; i < arr.length; i++) {
        const key = arr[i];
        output += `${i > 0 ? ',' : ''}${separator}${serialize(key, indent, baseIndent + indent)}`;
    }
    return `${output}${indent ? `\n${baseIndent}` : ''}]`;
}
function serializeObject(obj, indent, baseIndent) {
    let output = '{';
    const separator = indent ? `\n${baseIndent}${indent}` : '';
    const entries = Object.entries(obj);
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        const stringKey = makeLegalIdentifier(key) === key ? key : stringify$2(key);
        output += `${i > 0 ? ',' : ''}${separator}${stringKey}:${indent ? ' ' : ''}${serialize(value, indent, baseIndent + indent)}`;
    }
    return `${output}${indent ? `\n${baseIndent}` : ''}}`;
}
function serialize(obj, indent, baseIndent) {
    if (obj === Infinity)
        return 'Infinity';
    if (obj === -Infinity)
        return '-Infinity';
    if (obj === 0 && 1 / obj === -Infinity)
        return '-0';
    if (obj instanceof Date)
        return `new Date(${obj.getTime()})`;
    if (obj instanceof RegExp)
        return obj.toString();
    if (obj !== obj)
        return 'NaN'; // eslint-disable-line no-self-compare
    if (Array.isArray(obj))
        return serializeArray(obj, indent, baseIndent);
    if (obj === null)
        return 'null';
    if (typeof obj === 'object')
        return serializeObject(obj, indent, baseIndent);
    return stringify$2(obj);
}
const dataToEsm = function dataToEsm(data, options = {}) {
    const t = options.compact ? '' : 'indent' in options ? options.indent : '\t';
    const _ = options.compact ? '' : ' ';
    const n = options.compact ? '' : '\n';
    const declarationType = options.preferConst ? 'const' : 'var';
    if (options.namedExports === false ||
        typeof data !== 'object' ||
        Array.isArray(data) ||
        data instanceof Date ||
        data instanceof RegExp ||
        data === null) {
        const code = serialize(data, options.compact ? null : t, '');
        const magic = _ || (/^[{[\-\/]/.test(code) ? '' : ' '); // eslint-disable-line no-useless-escape
        return `export default${magic}${code};`;
    }
    let namedExportCode = '';
    const defaultExportRows = [];
    for (const [key, value] of Object.entries(data)) {
        if (key === makeLegalIdentifier(key)) {
            if (options.objectShorthand)
                defaultExportRows.push(key);
            else
                defaultExportRows.push(`${key}:${_}${key}`);
            namedExportCode += `export ${declarationType} ${key}${_}=${_}${serialize(value, options.compact ? null : t, '')};${n}`;
        }
        else {
            defaultExportRows.push(`${stringify$2(key)}:${_}${serialize(value, options.compact ? null : t, '')}`);
        }
    }
    return `${namedExportCode}export default${_}{${n}${t}${defaultExportRows.join(`,${n}${t}`)}${n}};${n}`;
};

// TODO: remove this in next major
var index = {
    addExtension,
    attachScopes,
    createFilter,
    dataToEsm,
    extractAssignedNames,
    makeLegalIdentifier
};

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function encode(decoded) {
    var sourceFileIndex = 0; // second field
    var sourceCodeLine = 0; // third field
    var sourceCodeColumn = 0; // fourth field
    var nameIndex = 0; // fifth field
    var mappings = '';
    for (var i = 0; i < decoded.length; i++) {
        var line = decoded[i];
        if (i > 0)
            mappings += ';';
        if (line.length === 0)
            continue;
        var generatedCodeColumn = 0; // first field
        var lineMappings = [];
        for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
            var segment = line_1[_i];
            var segmentMappings = encodeInteger(segment[0] - generatedCodeColumn);
            generatedCodeColumn = segment[0];
            if (segment.length > 1) {
                segmentMappings +=
                    encodeInteger(segment[1] - sourceFileIndex) +
                        encodeInteger(segment[2] - sourceCodeLine) +
                        encodeInteger(segment[3] - sourceCodeColumn);
                sourceFileIndex = segment[1];
                sourceCodeLine = segment[2];
                sourceCodeColumn = segment[3];
            }
            if (segment.length === 5) {
                segmentMappings += encodeInteger(segment[4] - nameIndex);
                nameIndex = segment[4];
            }
            lineMappings.push(segmentMappings);
        }
        mappings += lineMappings.join(',');
    }
    return mappings;
}
function encodeInteger(num) {
    var result = '';
    num = num < 0 ? (-num << 1) | 1 : num << 1;
    do {
        var clamped = num & 31;
        num >>>= 5;
        if (num > 0) {
            clamped |= 32;
        }
        result += chars[clamped];
    } while (num > 0);
    return result;
}

var BitSet = function BitSet(arg) {
	this.bits = arg instanceof BitSet ? arg.bits.slice() : [];
};

BitSet.prototype.add = function add (n) {
	this.bits[n >> 5] |= 1 << (n & 31);
};

BitSet.prototype.has = function has (n) {
	return !!(this.bits[n >> 5] & (1 << (n & 31)));
};

var Chunk = function Chunk(start, end, content) {
	this.start = start;
	this.end = end;
	this.original = content;

	this.intro = '';
	this.outro = '';

	this.content = content;
	this.storeName = false;
	this.edited = false;

	// we make these non-enumerable, for sanity while debugging
	Object.defineProperties(this, {
		previous: { writable: true, value: null },
		next:     { writable: true, value: null }
	});
};

Chunk.prototype.appendLeft = function appendLeft (content) {
	this.outro += content;
};

Chunk.prototype.appendRight = function appendRight (content) {
	this.intro = this.intro + content;
};

Chunk.prototype.clone = function clone () {
	var chunk = new Chunk(this.start, this.end, this.original);

	chunk.intro = this.intro;
	chunk.outro = this.outro;
	chunk.content = this.content;
	chunk.storeName = this.storeName;
	chunk.edited = this.edited;

	return chunk;
};

Chunk.prototype.contains = function contains (index) {
	return this.start < index && index < this.end;
};

Chunk.prototype.eachNext = function eachNext (fn) {
	var chunk = this;
	while (chunk) {
		fn(chunk);
		chunk = chunk.next;
	}
};

Chunk.prototype.eachPrevious = function eachPrevious (fn) {
	var chunk = this;
	while (chunk) {
		fn(chunk);
		chunk = chunk.previous;
	}
};

Chunk.prototype.edit = function edit (content, storeName, contentOnly) {
	this.content = content;
	if (!contentOnly) {
		this.intro = '';
		this.outro = '';
	}
	this.storeName = storeName;

	this.edited = true;

	return this;
};

Chunk.prototype.prependLeft = function prependLeft (content) {
	this.outro = content + this.outro;
};

Chunk.prototype.prependRight = function prependRight (content) {
	this.intro = content + this.intro;
};

Chunk.prototype.split = function split (index) {
	var sliceIndex = index - this.start;

	var originalBefore = this.original.slice(0, sliceIndex);
	var originalAfter = this.original.slice(sliceIndex);

	this.original = originalBefore;

	var newChunk = new Chunk(index, this.end, originalAfter);
	newChunk.outro = this.outro;
	this.outro = '';

	this.end = index;

	if (this.edited) {
		// TODO is this block necessary?...
		newChunk.edit('', false);
		this.content = '';
	} else {
		this.content = originalBefore;
	}

	newChunk.next = this.next;
	if (newChunk.next) { newChunk.next.previous = newChunk; }
	newChunk.previous = this;
	this.next = newChunk;

	return newChunk;
};

Chunk.prototype.toString = function toString () {
	return this.intro + this.content + this.outro;
};

Chunk.prototype.trimEnd = function trimEnd (rx) {
	this.outro = this.outro.replace(rx, '');
	if (this.outro.length) { return true; }

	var trimmed = this.content.replace(rx, '');

	if (trimmed.length) {
		if (trimmed !== this.content) {
			this.split(this.start + trimmed.length).edit('', undefined, true);
		}
		return true;

	} else {
		this.edit('', undefined, true);

		this.intro = this.intro.replace(rx, '');
		if (this.intro.length) { return true; }
	}
};

Chunk.prototype.trimStart = function trimStart (rx) {
	this.intro = this.intro.replace(rx, '');
	if (this.intro.length) { return true; }

	var trimmed = this.content.replace(rx, '');

	if (trimmed.length) {
		if (trimmed !== this.content) {
			this.split(this.end - trimmed.length);
			this.edit('', undefined, true);
		}
		return true;

	} else {
		this.edit('', undefined, true);

		this.outro = this.outro.replace(rx, '');
		if (this.outro.length) { return true; }
	}
};

var btoa = function () {
	throw new Error('Unsupported environment: `window.btoa` or `Buffer` should be supported.');
};
if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
	btoa = function (str) { return window.btoa(unescape(encodeURIComponent(str))); };
} else if (typeof Buffer === 'function') {
	btoa = function (str) { return Buffer.from(str, 'utf-8').toString('base64'); };
}

var SourceMap = function SourceMap(properties) {
	this.version = 3;
	this.file = properties.file;
	this.sources = properties.sources;
	this.sourcesContent = properties.sourcesContent;
	this.names = properties.names;
	this.mappings = encode(properties.mappings);
};

SourceMap.prototype.toString = function toString () {
	return JSON.stringify(this);
};

SourceMap.prototype.toUrl = function toUrl () {
	return 'data:application/json;charset=utf-8;base64,' + btoa(this.toString());
};

function guessIndent(code) {
	var lines = code.split('\n');

	var tabbed = lines.filter(function (line) { return /^\t+/.test(line); });
	var spaced = lines.filter(function (line) { return /^ {2,}/.test(line); });

	if (tabbed.length === 0 && spaced.length === 0) {
		return null;
	}

	// More lines tabbed than spaced? Assume tabs, and
	// default to tabs in the case of a tie (or nothing
	// to go on)
	if (tabbed.length >= spaced.length) {
		return '\t';
	}

	// Otherwise, we need to guess the multiple
	var min = spaced.reduce(function (previous, current) {
		var numSpaces = /^ +/.exec(current)[0].length;
		return Math.min(numSpaces, previous);
	}, Infinity);

	return new Array(min + 1).join(' ');
}

function getRelativePath(from, to) {
	var fromParts = from.split(/[/\\]/);
	var toParts = to.split(/[/\\]/);

	fromParts.pop(); // get dirname

	while (fromParts[0] === toParts[0]) {
		fromParts.shift();
		toParts.shift();
	}

	if (fromParts.length) {
		var i = fromParts.length;
		while (i--) { fromParts[i] = '..'; }
	}

	return fromParts.concat(toParts).join('/');
}

var toString = Object.prototype.toString;

function isObject$2(thing) {
	return toString.call(thing) === '[object Object]';
}

function getLocator(source) {
	var originalLines = source.split('\n');
	var lineOffsets = [];

	for (var i = 0, pos = 0; i < originalLines.length; i++) {
		lineOffsets.push(pos);
		pos += originalLines[i].length + 1;
	}

	return function locate(index) {
		var i = 0;
		var j = lineOffsets.length;
		while (i < j) {
			var m = (i + j) >> 1;
			if (index < lineOffsets[m]) {
				j = m;
			} else {
				i = m + 1;
			}
		}
		var line = i - 1;
		var column = index - lineOffsets[line];
		return { line: line, column: column };
	};
}

var Mappings = function Mappings(hires) {
	this.hires = hires;
	this.generatedCodeLine = 0;
	this.generatedCodeColumn = 0;
	this.raw = [];
	this.rawSegments = this.raw[this.generatedCodeLine] = [];
	this.pending = null;
};

Mappings.prototype.addEdit = function addEdit (sourceIndex, content, loc, nameIndex) {
	if (content.length) {
		var segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
		if (nameIndex >= 0) {
			segment.push(nameIndex);
		}
		this.rawSegments.push(segment);
	} else if (this.pending) {
		this.rawSegments.push(this.pending);
	}

	this.advance(content);
	this.pending = null;
};

Mappings.prototype.addUneditedChunk = function addUneditedChunk (sourceIndex, chunk, original, loc, sourcemapLocations) {
	var originalCharIndex = chunk.start;
	var first = true;

	while (originalCharIndex < chunk.end) {
		if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
			this.rawSegments.push([this.generatedCodeColumn, sourceIndex, loc.line, loc.column]);
		}

		if (original[originalCharIndex] === '\n') {
			loc.line += 1;
			loc.column = 0;
			this.generatedCodeLine += 1;
			this.raw[this.generatedCodeLine] = this.rawSegments = [];
			this.generatedCodeColumn = 0;
			first = true;
		} else {
			loc.column += 1;
			this.generatedCodeColumn += 1;
			first = false;
		}

		originalCharIndex += 1;
	}

	this.pending = null;
};

Mappings.prototype.advance = function advance (str) {
	if (!str) { return; }

	var lines = str.split('\n');

	if (lines.length > 1) {
		for (var i = 0; i < lines.length - 1; i++) {
			this.generatedCodeLine++;
			this.raw[this.generatedCodeLine] = this.rawSegments = [];
		}
		this.generatedCodeColumn = 0;
	}

	this.generatedCodeColumn += lines[lines.length - 1].length;
};

var n = '\n';

var warned = {
	insertLeft: false,
	insertRight: false,
	storeName: false
};

var MagicString = function MagicString(string, options) {
	if ( options === void 0 ) options = {};

	var chunk = new Chunk(0, string.length, string);

	Object.defineProperties(this, {
		original:              { writable: true, value: string },
		outro:                 { writable: true, value: '' },
		intro:                 { writable: true, value: '' },
		firstChunk:            { writable: true, value: chunk },
		lastChunk:             { writable: true, value: chunk },
		lastSearchedChunk:     { writable: true, value: chunk },
		byStart:               { writable: true, value: {} },
		byEnd:                 { writable: true, value: {} },
		filename:              { writable: true, value: options.filename },
		indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
		sourcemapLocations:    { writable: true, value: new BitSet() },
		storedNames:           { writable: true, value: {} },
		indentStr:             { writable: true, value: guessIndent(string) }
	});

	this.byStart[0] = chunk;
	this.byEnd[string.length] = chunk;
};

MagicString.prototype.addSourcemapLocation = function addSourcemapLocation (char) {
	this.sourcemapLocations.add(char);
};

MagicString.prototype.append = function append (content) {
	if (typeof content !== 'string') { throw new TypeError('outro content must be a string'); }

	this.outro += content;
	return this;
};

MagicString.prototype.appendLeft = function appendLeft (index, content) {
	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

	this._split(index);

	var chunk = this.byEnd[index];

	if (chunk) {
		chunk.appendLeft(content);
	} else {
		this.intro += content;
	}
	return this;
};

MagicString.prototype.appendRight = function appendRight (index, content) {
	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

	this._split(index);

	var chunk = this.byStart[index];

	if (chunk) {
		chunk.appendRight(content);
	} else {
		this.outro += content;
	}
	return this;
};

MagicString.prototype.clone = function clone () {
	var cloned = new MagicString(this.original, { filename: this.filename });

	var originalChunk = this.firstChunk;
	var clonedChunk = (cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone());

	while (originalChunk) {
		cloned.byStart[clonedChunk.start] = clonedChunk;
		cloned.byEnd[clonedChunk.end] = clonedChunk;

		var nextOriginalChunk = originalChunk.next;
		var nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();

		if (nextClonedChunk) {
			clonedChunk.next = nextClonedChunk;
			nextClonedChunk.previous = clonedChunk;

			clonedChunk = nextClonedChunk;
		}

		originalChunk = nextOriginalChunk;
	}

	cloned.lastChunk = clonedChunk;

	if (this.indentExclusionRanges) {
		cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
	}

	cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);

	cloned.intro = this.intro;
	cloned.outro = this.outro;

	return cloned;
};

MagicString.prototype.generateDecodedMap = function generateDecodedMap (options) {
		var this$1 = this;

	options = options || {};

	var sourceIndex = 0;
	var names = Object.keys(this.storedNames);
	var mappings = new Mappings(options.hires);

	var locate = getLocator(this.original);

	if (this.intro) {
		mappings.advance(this.intro);
	}

	this.firstChunk.eachNext(function (chunk) {
		var loc = locate(chunk.start);

		if (chunk.intro.length) { mappings.advance(chunk.intro); }

		if (chunk.edited) {
			mappings.addEdit(
				sourceIndex,
				chunk.content,
				loc,
				chunk.storeName ? names.indexOf(chunk.original) : -1
			);
		} else {
			mappings.addUneditedChunk(sourceIndex, chunk, this$1.original, loc, this$1.sourcemapLocations);
		}

		if (chunk.outro.length) { mappings.advance(chunk.outro); }
	});

	return {
		file: options.file ? options.file.split(/[/\\]/).pop() : null,
		sources: [options.source ? getRelativePath(options.file || '', options.source) : null],
		sourcesContent: options.includeContent ? [this.original] : [null],
		names: names,
		mappings: mappings.raw
	};
};

MagicString.prototype.generateMap = function generateMap (options) {
	return new SourceMap(this.generateDecodedMap(options));
};

MagicString.prototype.getIndentString = function getIndentString () {
	return this.indentStr === null ? '\t' : this.indentStr;
};

MagicString.prototype.indent = function indent (indentStr, options) {
	var pattern = /^[^\r\n]/gm;

	if (isObject$2(indentStr)) {
		options = indentStr;
		indentStr = undefined;
	}

	indentStr = indentStr !== undefined ? indentStr : this.indentStr || '\t';

	if (indentStr === '') { return this; } // noop

	options = options || {};

	// Process exclusion ranges
	var isExcluded = {};

	if (options.exclude) {
		var exclusions =
			typeof options.exclude[0] === 'number' ? [options.exclude] : options.exclude;
		exclusions.forEach(function (exclusion) {
			for (var i = exclusion[0]; i < exclusion[1]; i += 1) {
				isExcluded[i] = true;
			}
		});
	}

	var shouldIndentNextCharacter = options.indentStart !== false;
	var replacer = function (match) {
		if (shouldIndentNextCharacter) { return ("" + indentStr + match); }
		shouldIndentNextCharacter = true;
		return match;
	};

	this.intro = this.intro.replace(pattern, replacer);

	var charIndex = 0;
	var chunk = this.firstChunk;

	while (chunk) {
		var end = chunk.end;

		if (chunk.edited) {
			if (!isExcluded[charIndex]) {
				chunk.content = chunk.content.replace(pattern, replacer);

				if (chunk.content.length) {
					shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === '\n';
				}
			}
		} else {
			charIndex = chunk.start;

			while (charIndex < end) {
				if (!isExcluded[charIndex]) {
					var char = this.original[charIndex];

					if (char === '\n') {
						shouldIndentNextCharacter = true;
					} else if (char !== '\r' && shouldIndentNextCharacter) {
						shouldIndentNextCharacter = false;

						if (charIndex === chunk.start) {
							chunk.prependRight(indentStr);
						} else {
							this._splitChunk(chunk, charIndex);
							chunk = chunk.next;
							chunk.prependRight(indentStr);
						}
					}
				}

				charIndex += 1;
			}
		}

		charIndex = chunk.end;
		chunk = chunk.next;
	}

	this.outro = this.outro.replace(pattern, replacer);

	return this;
};

MagicString.prototype.insert = function insert () {
	throw new Error('magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)');
};

MagicString.prototype.insertLeft = function insertLeft (index, content) {
	if (!warned.insertLeft) {
		console.warn('magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead'); // eslint-disable-line no-console
		warned.insertLeft = true;
	}

	return this.appendLeft(index, content);
};

MagicString.prototype.insertRight = function insertRight (index, content) {
	if (!warned.insertRight) {
		console.warn('magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead'); // eslint-disable-line no-console
		warned.insertRight = true;
	}

	return this.prependRight(index, content);
};

MagicString.prototype.move = function move (start, end, index) {
	if (index >= start && index <= end) { throw new Error('Cannot move a selection inside itself'); }

	this._split(start);
	this._split(end);
	this._split(index);

	var first = this.byStart[start];
	var last = this.byEnd[end];

	var oldLeft = first.previous;
	var oldRight = last.next;

	var newRight = this.byStart[index];
	if (!newRight && last === this.lastChunk) { return this; }
	var newLeft = newRight ? newRight.previous : this.lastChunk;

	if (oldLeft) { oldLeft.next = oldRight; }
	if (oldRight) { oldRight.previous = oldLeft; }

	if (newLeft) { newLeft.next = first; }
	if (newRight) { newRight.previous = last; }

	if (!first.previous) { this.firstChunk = last.next; }
	if (!last.next) {
		this.lastChunk = first.previous;
		this.lastChunk.next = null;
	}

	first.previous = newLeft;
	last.next = newRight || null;

	if (!newLeft) { this.firstChunk = first; }
	if (!newRight) { this.lastChunk = last; }
	return this;
};

MagicString.prototype.overwrite = function overwrite (start, end, content, options) {
	if (typeof content !== 'string') { throw new TypeError('replacement content must be a string'); }

	while (start < 0) { start += this.original.length; }
	while (end < 0) { end += this.original.length; }

	if (end > this.original.length) { throw new Error('end is out of bounds'); }
	if (start === end)
		{ throw new Error('Cannot overwrite a zero-length range – use appendLeft or prependRight instead'); }

	this._split(start);
	this._split(end);

	if (options === true) {
		if (!warned.storeName) {
			console.warn('The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string'); // eslint-disable-line no-console
			warned.storeName = true;
		}

		options = { storeName: true };
	}
	var storeName = options !== undefined ? options.storeName : false;
	var contentOnly = options !== undefined ? options.contentOnly : false;

	if (storeName) {
		var original = this.original.slice(start, end);
		this.storedNames[original] = true;
	}

	var first = this.byStart[start];
	var last = this.byEnd[end];

	if (first) {
		if (end > first.end && first.next !== this.byStart[first.end]) {
			throw new Error('Cannot overwrite across a split point');
		}

		first.edit(content, storeName, contentOnly);

		if (first !== last) {
			var chunk = first.next;
			while (chunk !== last) {
				chunk.edit('', false);
				chunk = chunk.next;
			}

			chunk.edit('', false);
		}
	} else {
		// must be inserting at the end
		var newChunk = new Chunk(start, end, '').edit(content, storeName);

		// TODO last chunk in the array may not be the last chunk, if it's moved...
		last.next = newChunk;
		newChunk.previous = last;
	}
	return this;
};

MagicString.prototype.prepend = function prepend (content) {
	if (typeof content !== 'string') { throw new TypeError('outro content must be a string'); }

	this.intro = content + this.intro;
	return this;
};

MagicString.prototype.prependLeft = function prependLeft (index, content) {
	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

	this._split(index);

	var chunk = this.byEnd[index];

	if (chunk) {
		chunk.prependLeft(content);
	} else {
		this.intro = content + this.intro;
	}
	return this;
};

MagicString.prototype.prependRight = function prependRight (index, content) {
	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

	this._split(index);

	var chunk = this.byStart[index];

	if (chunk) {
		chunk.prependRight(content);
	} else {
		this.outro = content + this.outro;
	}
	return this;
};

MagicString.prototype.remove = function remove (start, end) {
	while (start < 0) { start += this.original.length; }
	while (end < 0) { end += this.original.length; }

	if (start === end) { return this; }

	if (start < 0 || end > this.original.length) { throw new Error('Character is out of bounds'); }
	if (start > end) { throw new Error('end must be greater than start'); }

	this._split(start);
	this._split(end);

	var chunk = this.byStart[start];

	while (chunk) {
		chunk.intro = '';
		chunk.outro = '';
		chunk.edit('');

		chunk = end > chunk.end ? this.byStart[chunk.end] : null;
	}
	return this;
};

MagicString.prototype.lastChar = function lastChar () {
	if (this.outro.length)
		{ return this.outro[this.outro.length - 1]; }
	var chunk = this.lastChunk;
	do {
		if (chunk.outro.length)
			{ return chunk.outro[chunk.outro.length - 1]; }
		if (chunk.content.length)
			{ return chunk.content[chunk.content.length - 1]; }
		if (chunk.intro.length)
			{ return chunk.intro[chunk.intro.length - 1]; }
	} while (chunk = chunk.previous);
	if (this.intro.length)
		{ return this.intro[this.intro.length - 1]; }
	return '';
};

MagicString.prototype.lastLine = function lastLine () {
	var lineIndex = this.outro.lastIndexOf(n);
	if (lineIndex !== -1)
		{ return this.outro.substr(lineIndex + 1); }
	var lineStr = this.outro;
	var chunk = this.lastChunk;
	do {
		if (chunk.outro.length > 0) {
			lineIndex = chunk.outro.lastIndexOf(n);
			if (lineIndex !== -1)
				{ return chunk.outro.substr(lineIndex + 1) + lineStr; }
			lineStr = chunk.outro + lineStr;
		}

		if (chunk.content.length > 0) {
			lineIndex = chunk.content.lastIndexOf(n);
			if (lineIndex !== -1)
				{ return chunk.content.substr(lineIndex + 1) + lineStr; }
			lineStr = chunk.content + lineStr;
		}

		if (chunk.intro.length > 0) {
			lineIndex = chunk.intro.lastIndexOf(n);
			if (lineIndex !== -1)
				{ return chunk.intro.substr(lineIndex + 1) + lineStr; }
			lineStr = chunk.intro + lineStr;
		}
	} while (chunk = chunk.previous);
	lineIndex = this.intro.lastIndexOf(n);
	if (lineIndex !== -1)
		{ return this.intro.substr(lineIndex + 1) + lineStr; }
	return this.intro + lineStr;
};

MagicString.prototype.slice = function slice (start, end) {
		if ( start === void 0 ) start = 0;
		if ( end === void 0 ) end = this.original.length;

	while (start < 0) { start += this.original.length; }
	while (end < 0) { end += this.original.length; }

	var result = '';

	// find start chunk
	var chunk = this.firstChunk;
	while (chunk && (chunk.start > start || chunk.end <= start)) {
		// found end chunk before start
		if (chunk.start < end && chunk.end >= end) {
			return result;
		}

		chunk = chunk.next;
	}

	if (chunk && chunk.edited && chunk.start !== start)
		{ throw new Error(("Cannot use replaced character " + start + " as slice start anchor.")); }

	var startChunk = chunk;
	while (chunk) {
		if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
			result += chunk.intro;
		}

		var containsEnd = chunk.start < end && chunk.end >= end;
		if (containsEnd && chunk.edited && chunk.end !== end)
			{ throw new Error(("Cannot use replaced character " + end + " as slice end anchor.")); }

		var sliceStart = startChunk === chunk ? start - chunk.start : 0;
		var sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;

		result += chunk.content.slice(sliceStart, sliceEnd);

		if (chunk.outro && (!containsEnd || chunk.end === end)) {
			result += chunk.outro;
		}

		if (containsEnd) {
			break;
		}

		chunk = chunk.next;
	}

	return result;
};

// TODO deprecate this? not really very useful
MagicString.prototype.snip = function snip (start, end) {
	var clone = this.clone();
	clone.remove(0, start);
	clone.remove(end, clone.original.length);

	return clone;
};

MagicString.prototype._split = function _split (index) {
	if (this.byStart[index] || this.byEnd[index]) { return; }

	var chunk = this.lastSearchedChunk;
	var searchForward = index > chunk.end;

	while (chunk) {
		if (chunk.contains(index)) { return this._splitChunk(chunk, index); }

		chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
	}
};

MagicString.prototype._splitChunk = function _splitChunk (chunk, index) {
	if (chunk.edited && chunk.content.length) {
		// zero-length edited chunks are a special case (overlapping replacements)
		var loc = getLocator(this.original)(index);
		throw new Error(
			("Cannot split a chunk that has already been edited (" + (loc.line) + ":" + (loc.column) + " – \"" + (chunk.original) + "\")")
		);
	}

	var newChunk = chunk.split(index);

	this.byEnd[index] = chunk;
	this.byStart[index] = newChunk;
	this.byEnd[newChunk.end] = newChunk;

	if (chunk === this.lastChunk) { this.lastChunk = newChunk; }

	this.lastSearchedChunk = chunk;
	return true;
};

MagicString.prototype.toString = function toString () {
	var str = this.intro;

	var chunk = this.firstChunk;
	while (chunk) {
		str += chunk.toString();
		chunk = chunk.next;
	}

	return str + this.outro;
};

MagicString.prototype.isEmpty = function isEmpty () {
	var chunk = this.firstChunk;
	do {
		if (chunk.intro.length && chunk.intro.trim() ||
				chunk.content.length && chunk.content.trim() ||
				chunk.outro.length && chunk.outro.trim())
			{ return false; }
	} while (chunk = chunk.next);
	return true;
};

MagicString.prototype.length = function length () {
	var chunk = this.firstChunk;
	var length = 0;
	do {
		length += chunk.intro.length + chunk.content.length + chunk.outro.length;
	} while (chunk = chunk.next);
	return length;
};

MagicString.prototype.trimLines = function trimLines () {
	return this.trim('[\\r\\n]');
};

MagicString.prototype.trim = function trim (charType) {
	return this.trimStart(charType).trimEnd(charType);
};

MagicString.prototype.trimEndAborted = function trimEndAborted (charType) {
	var rx = new RegExp((charType || '\\s') + '+$');

	this.outro = this.outro.replace(rx, '');
	if (this.outro.length) { return true; }

	var chunk = this.lastChunk;

	do {
		var end = chunk.end;
		var aborted = chunk.trimEnd(rx);

		// if chunk was trimmed, we have a new lastChunk
		if (chunk.end !== end) {
			if (this.lastChunk === chunk) {
				this.lastChunk = chunk.next;
			}

			this.byEnd[chunk.end] = chunk;
			this.byStart[chunk.next.start] = chunk.next;
			this.byEnd[chunk.next.end] = chunk.next;
		}

		if (aborted) { return true; }
		chunk = chunk.previous;
	} while (chunk);

	return false;
};

MagicString.prototype.trimEnd = function trimEnd (charType) {
	this.trimEndAborted(charType);
	return this;
};
MagicString.prototype.trimStartAborted = function trimStartAborted (charType) {
	var rx = new RegExp('^' + (charType || '\\s') + '+');

	this.intro = this.intro.replace(rx, '');
	if (this.intro.length) { return true; }

	var chunk = this.firstChunk;

	do {
		var end = chunk.end;
		var aborted = chunk.trimStart(rx);

		if (chunk.end !== end) {
			// special case...
			if (chunk === this.lastChunk) { this.lastChunk = chunk.next; }

			this.byEnd[chunk.end] = chunk;
			this.byStart[chunk.next.start] = chunk.next;
			this.byEnd[chunk.next.end] = chunk.next;
		}

		if (aborted) { return true; }
		chunk = chunk.next;
	} while (chunk);

	return false;
};

MagicString.prototype.trimStart = function trimStart (charType) {
	this.trimStartAborted(charType);
	return this;
};

function isReference(node, parent) {
    if (node.type === 'MemberExpression') {
        return !node.computed && isReference(node.object, node);
    }
    if (node.type === 'Identifier') {
        if (!parent)
            return true;
        switch (parent.type) {
            // disregard `bar` in `foo.bar`
            case 'MemberExpression': return parent.computed || node === parent.object;
            // disregard the `foo` in `class {foo(){}}` but keep it in `class {[foo](){}}`
            case 'MethodDefinition': return parent.computed;
            // disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
            case 'Property': return parent.computed || node === parent.value;
            // disregard the `bar` in `export { foo as bar }` or
            // the foo in `import { foo as bar }`
            case 'ExportSpecifier':
            case 'ImportSpecifier': return node === parent.local;
            // disregard the `foo` in `foo: while (...) { ... break foo; ... continue foo;}`
            case 'LabeledStatement':
            case 'BreakStatement':
            case 'ContinueStatement': return false;
            default: return true;
        }
    }
    return false;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var peerDependencies = {
	rollup: "^1.20.0"
};

const PROXY_SUFFIX = '?commonjs-proxy';
const getProxyId = id => `\0${id}${PROXY_SUFFIX}`;
const getIdFromProxyId = proxyId => proxyId.slice(1, -PROXY_SUFFIX.length);
const EXTERNAL_SUFFIX = '?commonjs-external';
const getExternalProxyId = id => `\0${id}${EXTERNAL_SUFFIX}`;
const getIdFromExternalProxyId = proxyId => proxyId.slice(1, -EXTERNAL_SUFFIX.length);
const HELPERS_ID = '\0commonjsHelpers.js'; // `x['default']` is used instead of `x.default` for backward compatibility with ES3 browsers.
// Minifiers like uglify will usually transpile it back if compatibility with ES3 is not enabled.

const HELPERS = `
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

export function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

export function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}`;

/* eslint-disable no-undefined */
const isCjsPromises = new Map();
function getIsCjsPromise(id) {
  let isCjsPromise = isCjsPromises.get(id);
  if (isCjsPromise) return isCjsPromise.promise;
  const promise = new Promise(resolve => {
    isCjsPromise = {
      resolve,
      promise: undefined
    };
    isCjsPromises.set(id, isCjsPromise);
  });
  isCjsPromise.promise = promise;
  return promise;
}
function setIsCjsPromise(id, resolution) {
  const isCjsPromise = isCjsPromises.get(id);

  if (isCjsPromise) {
    if (isCjsPromise.resolve) {
      isCjsPromise.resolve(resolution);
      isCjsPromise.resolve = undefined;
    }
  } else {
    isCjsPromises.set(id, {
      promise: Promise.resolve(resolution),
      resolve: undefined
    });
  }
}

/* eslint-disable no-param-reassign, no-undefined */

function getCandidatesForExtension(resolved, extension) {
  return [resolved + extension, `${resolved}${sep}index${extension}`];
}

function getCandidates(resolved, extensions) {
  return extensions.reduce((paths, extension) => paths.concat(getCandidatesForExtension(resolved, extension)), [resolved]);
}

function getResolveId(extensions) {
  function resolveExtensions(importee, importer) {
    // not our problem
    if (importee[0] !== '.' || !importer) return undefined;
    const resolved = resolve$1(dirname(importer), importee);
    const candidates = getCandidates(resolved, extensions);

    for (let i = 0; i < candidates.length; i += 1) {
      try {
        const stats = statSync(candidates[i]);
        if (stats.isFile()) return {
          id: candidates[i]
        };
      } catch (err) {
        /* noop */
      }
    }

    return undefined;
  }

  function resolveId(importee, importer) {
    const isProxyModule = importee.endsWith(PROXY_SUFFIX);

    if (isProxyModule) {
      importee = getIdFromProxyId(importee);
    } else if (importee.startsWith('\0')) {
      if (importee === HELPERS_ID) {
        return importee;
      }

      return null;
    }

    if (importer && importer.endsWith(PROXY_SUFFIX)) {
      importer = getIdFromProxyId(importer);
    }

    return this.resolve(importee, importer, {
      skipSelf: true
    }).then(resolved => {
      if (!resolved) {
        resolved = resolveExtensions(importee, importer);
      }

      if (isProxyModule) {
        if (!resolved) {
          return {
            id: getExternalProxyId(importee),
            external: false
          };
        }

        resolved.id = (resolved.external ? getExternalProxyId : getProxyId)(resolved.id);
        resolved.external = false;
        return resolved;
      }

      return resolved;
    });
  }

  return resolveId;
}

/* eslint-disable no-undefined */
const operators = {
  '==': x => equals(x.left, x.right, false),
  '!=': x => not(operators['=='](x)),
  '===': x => equals(x.left, x.right, true),
  '!==': x => not(operators['==='](x)),
  '!': x => isFalsy(x.argument),
  '&&': x => isTruthy(x.left) && isTruthy(x.right),
  '||': x => isTruthy(x.left) || isTruthy(x.right)
};
function flatten(node) {
  const parts = [];

  while (node.type === 'MemberExpression') {
    if (node.computed) return null;
    parts.unshift(node.property.name); // eslint-disable-next-line no-param-reassign

    node = node.object;
  }

  if (node.type !== 'Identifier') return null;
  const _node = node,
        name = _node.name;
  parts.unshift(name);
  return {
    name,
    keypath: parts.join('.')
  };
}

function isTruthy(node) {
  if (node.type === 'Literal') return !!node.value;
  if (node.type === 'ParenthesizedExpression') return isTruthy(node.expression);
  if (node.operator in operators) return operators[node.operator](node);
  return undefined;
}
function isFalsy(node) {
  return not(isTruthy(node));
}

function not(value) {
  return value === undefined ? value : !value;
}

function equals(a, b, strict) {
  if (a.type !== b.type) return undefined; // eslint-disable-next-line eqeqeq

  if (a.type === 'Literal') return strict ? a.value === b.value : a.value == b.value;
  return undefined;
}

/* eslint-disable import/prefer-default-export */
function getName(id) {
  const name = makeLegalIdentifier(basename(id, extname(id)));

  if (name !== 'index') {
    return name;
  }

  const segments = dirname(id).split(sep);
  return makeLegalIdentifier(segments[segments.length - 1]);
}

const reserved = 'process location abstract arguments boolean break byte case catch char class const continue debugger default delete do double else enum eval export extends false final finally float for from function goto if implements import in instanceof int interface let long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof var void volatile while with yield'.split(' ');
const blacklist = {
  __esModule: true
};
reserved.forEach(word => blacklist[word] = true);
const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/;
const firstpassGlobal = /\b(?:require|module|exports|global)\b/;
const firstpassNoGlobal = /\b(?:require|module|exports)\b/;
const importExportDeclaration = /^(?:Import|Export(?:Named|Default))Declaration/;
const functionType = /^(?:FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;

function deconflict(scope, globals, identifier) {
  let i = 1;
  let deconflicted = identifier;

  while (scope.contains(deconflicted) || globals.has(deconflicted) || deconflicted in blacklist) {
    deconflicted = `${identifier}_${i}`;
    i += 1;
  }

  scope.declarations[deconflicted] = true;
  return deconflicted;
}

function tryParse(parse, code, id) {
  try {
    return parse(code, {
      allowReturnOutsideFunction: true
    });
  } catch (err) {
    err.message += ` in ${id}`;
    throw err;
  }
}

function hasCjsKeywords(code, ignoreGlobal) {
  const firstpass = ignoreGlobal ? firstpassNoGlobal : firstpassGlobal;
  return firstpass.test(code);
}
function checkEsModule(parse, code, id) {
  const ast = tryParse(parse, code, id);
  let isEsModule = false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ast.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      const node = _step.value;
      if (node.type === 'ExportDefaultDeclaration') return {
        isEsModule: true,
        hasDefaultExport: true,
        ast
      };

      if (node.type === 'ExportNamedDeclaration') {
        isEsModule = true;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = node.specifiers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            const specifier = _step2.value;

            if (specifier.exported.name === 'default') {
              return {
                isEsModule: true,
                hasDefaultExport: true,
                ast
              };
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      } else if (importExportDeclaration.test(node.type)) isEsModule = true;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    isEsModule,
    hasDefaultExport: false,
    ast
  };
}
function transformCommonjs(parse, code, id, isEntry, ignoreGlobal, ignoreRequire, customNamedExports, sourceMap, allowDynamicRequire, astCache) {
  const ast = astCache || tryParse(parse, code, id);
  const magicString = new MagicString(code);
  const required = {}; // Because objects have no guaranteed ordering, yet we need it,
  // we need to keep track of the order in a array

  const sources = [];
  let uid = 0;
  let scope = attachScopes(ast, 'scope');
  const uses = {
    module: false,
    exports: false,
    global: false,
    require: false
  };
  let lexicalDepth = 0;
  let programDepth = 0;
  const globals = new Set(); // TODO technically wrong since globals isn't populated yet, but ¯\_(ツ)_/¯

  const HELPERS_NAME = deconflict(scope, globals, 'commonjsHelpers');
  const namedExports = {}; // TODO handle transpiled modules

  let shouldWrap = /__esModule/.test(code);

  function isRequireStatement(node) {
    if (!node) return false;
    if (node.type !== 'CallExpression') return false;
    if (node.callee.name !== 'require' || scope.contains('require')) return false; // Weird case of require() without arguments

    if (node.arguments.length === 0) return false;
    return true;
  }

  function hasDynamicArguments(node) {
    return node.arguments.length > 1 || node.arguments[0].type !== 'Literal' && (node.arguments[0].type !== 'TemplateLiteral' || node.arguments[0].expressions.length > 0);
  }

  function isStaticRequireStatement(node) {
    if (!isRequireStatement(node)) return false;
    if (hasDynamicArguments(node)) return false;
    if (ignoreRequire(node.arguments[0].value)) return false;
    return true;
  }

  function getRequireStringArg(node) {
    return node.arguments[0].type === 'Literal' ? node.arguments[0].value : node.arguments[0].quasis[0].value.cooked;
  }

  function getRequired(node, name) {
    const sourceId = getRequireStringArg(node);
    const existing = required[sourceId]; // eslint-disable-next-line no-undefined

    if (existing === undefined) {
      if (!name) {
        do {
          name = `require$$${uid}`;
          uid += 1;
        } while (scope.contains(name));
      }

      sources.push(sourceId);
      required[sourceId] = {
        source: sourceId,
        name,
        importsDefault: false
      };
    }

    return required[sourceId];
  } // do a first pass, see which names are assigned to. This is necessary to prevent
  // illegally replacing `var foo = require('foo')` with `import foo from 'foo'`,
  // where `foo` is later reassigned. (This happens in the wild. CommonJS, sigh)


  const assignedTo = new Set();
  walk(ast, {
    enter(node) {
      if (node.type !== 'AssignmentExpression') return;
      if (node.left.type === 'MemberExpression') return;
      extractAssignedNames(node.left).forEach(name => {
        assignedTo.add(name);
      });
    }

  });
  walk(ast, {
    enter(node, parent) {
      if (sourceMap) {
        magicString.addSourcemapLocation(node.start);
        magicString.addSourcemapLocation(node.end);
      } // skip dead branches


      if (parent && (parent.type === 'IfStatement' || parent.type === 'ConditionalExpression')) {
        if (node === parent.consequent && isFalsy(parent.test)) {
          this.skip();
          return;
        }

        if (node === parent.alternate && isTruthy(parent.test)) {
          this.skip();
          return;
        }
      }

      if (node._skip) {
        this.skip();
        return;
      }

      programDepth += 1;

      if (node.scope) {
        scope = node.scope;
      }

      if (functionType.test(node.type)) lexicalDepth += 1; // if toplevel return, we need to wrap it

      if (node.type === 'ReturnStatement' && lexicalDepth === 0) {
        shouldWrap = true;
      } // rewrite `this` as `commonjsHelpers.commonjsGlobal`


      if (node.type === 'ThisExpression' && lexicalDepth === 0) {
        uses.global = true;
        if (!ignoreGlobal) magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, {
          storeName: true
        });
        return;
      } // rewrite `typeof module`, `typeof module.exports` and `typeof exports` (https://github.com/rollup/rollup-plugin-commonjs/issues/151)


      if (node.type === 'UnaryExpression' && node.operator === 'typeof') {
        const flattened = flatten(node.argument);
        if (!flattened) return;
        if (scope.contains(flattened.name)) return;

        if (flattened.keypath === 'module.exports' || flattened.keypath === 'module' || flattened.keypath === 'exports') {
          magicString.overwrite(node.start, node.end, `'object'`, {
            storeName: false
          });
        }
      } // rewrite `require` (if not already handled) `global` and `define`, and handle free references to
      // `module` and `exports` as these mean we need to wrap the module in commonjsHelpers.createCommonjsModule


      if (node.type === 'Identifier') {
        if (isReference(node, parent) && !scope.contains(node.name)) {
          if (node.name in uses) {
            if (node.name === 'require') {
              if (allowDynamicRequire) return;
              magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsRequire`, {
                storeName: true
              });
            }

            uses[node.name] = true;

            if (node.name === 'global' && !ignoreGlobal) {
              magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, {
                storeName: true
              });
            } // if module or exports are used outside the context of an assignment
            // expression, we need to wrap the module


            if (node.name === 'module' || node.name === 'exports') {
              shouldWrap = true;
            }
          }

          if (node.name === 'define') {
            magicString.overwrite(node.start, node.end, 'undefined', {
              storeName: true
            });
          }

          globals.add(node.name);
        }

        return;
      } // Is this an assignment to exports or module.exports?


      if (node.type === 'AssignmentExpression') {
        if (node.left.type !== 'MemberExpression') return;
        const flattened = flatten(node.left);
        if (!flattened) return;
        if (scope.contains(flattened.name)) return;
        const match = exportsPattern.exec(flattened.keypath);
        if (!match || flattened.keypath === 'exports') return;
        uses[flattened.name] = true; // we're dealing with `module.exports = ...` or `[module.]exports.foo = ...` –
        // if this isn't top-level, we'll need to wrap the module

        if (programDepth > 3) shouldWrap = true;
        node.left._skip = true;

        if (flattened.keypath === 'module.exports' && node.right.type === 'ObjectExpression') {
          node.right.properties.forEach(prop => {
            if (prop.computed || !('key' in prop) || prop.key.type !== 'Identifier') return;
            const name = prop.key.name;
            if (name === makeLegalIdentifier(name)) namedExports[name] = true;
          });
          return;
        }

        if (match[1]) namedExports[match[1]] = true;
        return;
      } // if this is `var x = require('x')`, we can do `import x from 'x'`


      if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && isStaticRequireStatement(node.init)) {
        // for now, only do this for top-level requires. maybe fix this in future
        if (scope.parent) return; // edge case — CJS allows you to assign to imports. ES doesn't

        if (assignedTo.has(node.id.name)) return;
        const required = getRequired(node.init, node.id.name);
        required.importsDefault = true;

        if (required.name === node.id.name) {
          node._shouldRemove = true;
        }
      }

      if (!isStaticRequireStatement(node)) return;
      const required = getRequired(node);

      if (parent.type === 'ExpressionStatement') {
        // is a bare import, e.g. `require('foo');`
        magicString.remove(parent.start, parent.end);
      } else {
        required.importsDefault = true;
        magicString.overwrite(node.start, node.end, required.name);
      }

      node.callee._skip = true;
    },

    leave(node) {
      programDepth -= 1;
      if (node.scope) scope = scope.parent;
      if (functionType.test(node.type)) lexicalDepth -= 1;

      if (node.type === 'VariableDeclaration') {
        let keepDeclaration = false;
        let c = node.declarations[0].start;

        for (let i = 0; i < node.declarations.length; i += 1) {
          const declarator = node.declarations[i];

          if (declarator._shouldRemove) {
            magicString.remove(c, declarator.end);
          } else {
            if (!keepDeclaration) {
              magicString.remove(c, declarator.start);
              keepDeclaration = true;
            }

            c = declarator.end;
          }
        }

        if (!keepDeclaration) {
          magicString.remove(node.start, node.end);
        }
      }
    }

  });

  if (!sources.length && !uses.module && !uses.exports && !uses.require && (ignoreGlobal || !uses.global)) {
    if (Object.keys(namedExports).length) {
      throw new Error(`Custom named exports were specified for ${id} but it does not appear to be a CommonJS module`);
    } // not a CommonJS module


    return null;
  }

  const includeHelpers = shouldWrap || uses.global || uses.require;
  const importBlock = `${(includeHelpers ? [`import * as ${HELPERS_NAME} from '${HELPERS_ID}';`] : []).concat(sources.map(source => // import the actual module before the proxy, so that we know
  // what kind of proxy to build
  `import '${source}';`), sources.map(source => {
    const _required$source = required[source],
          name = _required$source.name,
          importsDefault = _required$source.importsDefault;
    return `import ${importsDefault ? `${name} from ` : ``}'${getProxyId(source)}';`;
  })).join('\n')}\n\n`;
  const namedExportDeclarations = [];
  let wrapperStart = '';
  let wrapperEnd = '';
  const moduleName = deconflict(scope, globals, getName(id));

  if (!isEntry) {
    const exportModuleExports = {
      str: `export { ${moduleName} as __moduleExports };`,
      name: '__moduleExports'
    };
    namedExportDeclarations.push(exportModuleExports);
  }

  const name = getName(id);

  function addExport(x) {
    const deconflicted = deconflict(scope, globals, name);
    const declaration = deconflicted === name ? `export var ${x} = ${moduleName}.${x};` : `var ${deconflicted} = ${moduleName}.${x};\nexport { ${deconflicted} as ${x} };`;
    namedExportDeclarations.push({
      str: declaration,
      name: x
    });
  }

  if (customNamedExports) customNamedExports.forEach(addExport);
  const defaultExportPropertyAssignments = [];
  let hasDefaultExport = false;

  if (shouldWrap) {
    const args = `module${uses.exports ? ', exports' : ''}`;
    wrapperStart = `var ${moduleName} = ${HELPERS_NAME}.createCommonjsModule(function (${args}) {\n`;
    wrapperEnd = `\n});`;
  } else {
    const names = [];
    ast.body.forEach(node => {
      if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
        const left = node.expression.left;
        const flattened = flatten(left);
        if (!flattened) return;
        const match = exportsPattern.exec(flattened.keypath);
        if (!match) return;

        if (flattened.keypath === 'module.exports') {
          hasDefaultExport = true;
          magicString.overwrite(left.start, left.end, `var ${moduleName}`);
        } else {
          const _match = _slicedToArray(match, 2),
                name = _match[1];

          const deconflicted = deconflict(scope, globals, name);
          names.push({
            name,
            deconflicted
          });
          magicString.overwrite(node.start, left.end, `var ${deconflicted}`);
          const declaration = name === deconflicted ? `export { ${name} };` : `export { ${deconflicted} as ${name} };`;

          if (name !== 'default') {
            namedExportDeclarations.push({
              str: declaration,
              name
            });
            delete namedExports[name];
          }

          defaultExportPropertyAssignments.push(`${moduleName}.${name} = ${deconflicted};`);
        }
      }
    });

    if (!hasDefaultExport && (names.length || !isEntry)) {
      wrapperEnd = `\n\nvar ${moduleName} = {\n${names.map(({
        name,
        deconflicted
      }) => `\t${name}: ${deconflicted}`).join(',\n')}\n};`;
    }
  }

  Object.keys(namedExports).filter(key => !blacklist[key]).forEach(addExport);
  const defaultExport = /__esModule/.test(code) ? `export default ${HELPERS_NAME}.unwrapExports(${moduleName});` : `export default ${moduleName};`;
  const named = namedExportDeclarations.filter(x => x.name !== 'default' || !hasDefaultExport).map(x => x.str);
  const exportBlock = `\n\n${[defaultExport].concat(named).concat(hasDefaultExport ? defaultExportPropertyAssignments : []).join('\n')}`;
  magicString.trim().prepend(importBlock + wrapperStart).trim().append(wrapperEnd);

  if (hasDefaultExport || named.length > 0 || shouldWrap || !isEntry) {
    magicString.append(exportBlock);
  }

  code = magicString.toString();
  const map = sourceMap ? magicString.generateMap() : null;
  return {
    code,
    map
  };
}

function commonjs(options = {}) {
  const extensions = options.extensions || ['.js'];
  const filter = createFilter(options.include, options.exclude);
  const ignoreGlobal = options.ignoreGlobal;
  const customNamedExports = {};

  if (options.namedExports) {
    Object.keys(options.namedExports).forEach(id => {
      let resolveId = id;
      let resolvedId;

      if (resolve_2(id)) {
        // resolve will not find npm modules with the same name as
        // core modules without a trailing slash. Since core modules
        // must be external, we can assume any core modules defined
        // here are npm modules by that name.
        resolveId += '/';
      }

      try {
        resolvedId = resolve_3(resolveId, {
          basedir: process.cwd()
        });
      } catch (err) {
        resolvedId = resolve$1(id);
      } // Note: customNamedExport's keys must be normalized file paths.
      // resolve and nodeResolveSync both return normalized file paths
      // so no additional normalization is necessary.


      customNamedExports[resolvedId] = options.namedExports[id];

      if (existsSync(resolvedId)) {
        const realpath = realpathSync(resolvedId);

        if (realpath !== resolvedId) {
          customNamedExports[realpath] = options.namedExports[id];
        }
      }
    });
  }

  const esModulesWithoutDefaultExport = new Set();
  const esModulesWithDefaultExport = new Set(); // TODO maybe this should be configurable?

  const allowDynamicRequire = !!options.ignore;
  const ignoreRequire = typeof options.ignore === 'function' ? options.ignore : Array.isArray(options.ignore) ? id => options.ignore.includes(id) : () => false;
  const resolveId = getResolveId(extensions);
  const sourceMap = options.sourceMap !== false;

  function transformAndCheckExports(code, id) {
    const _checkEsModule = checkEsModule(this.parse, code, id),
          isEsModule = _checkEsModule.isEsModule,
          hasDefaultExport = _checkEsModule.hasDefaultExport,
          ast = _checkEsModule.ast;

    if (isEsModule) {
      (hasDefaultExport ? esModulesWithDefaultExport : esModulesWithoutDefaultExport).add(id);
      return null;
    } // it is not an ES module but it does not have CJS-specific elements.


    if (!hasCjsKeywords(code, ignoreGlobal)) {
      esModulesWithoutDefaultExport.add(id);
      return null;
    }

    const normalizedId = normalize(id);
    const transformed = transformCommonjs(this.parse, code, id, this.getModuleInfo(id).isEntry, ignoreGlobal, ignoreRequire, customNamedExports[normalizedId], sourceMap, allowDynamicRequire, ast);

    if (!transformed) {
      esModulesWithoutDefaultExport.add(id);
      return null;
    }

    return transformed;
  }

  return {
    name: 'commonjs',

    buildStart() {
      const _this$meta$rollupVers = this.meta.rollupVersion.split('.').map(Number),
            _this$meta$rollupVers2 = _slicedToArray(_this$meta$rollupVers, 2),
            major = _this$meta$rollupVers2[0],
            minor = _this$meta$rollupVers2[1];

      const minVersion = peerDependencies.rollup.slice(2);

      const _minVersion$split$map = minVersion.split('.').map(Number),
            _minVersion$split$map2 = _slicedToArray(_minVersion$split$map, 2),
            minMajor = _minVersion$split$map2[0],
            minMinor = _minVersion$split$map2[1];

      if (major < minMajor || major === minMajor && minor < minMinor) {
        this.error(`Insufficient Rollup version: "@rollup/plugin-commonjs" requires at least rollup@${minVersion} but found rollup@${this.meta.rollupVersion}.`);
      }
    },

    resolveId,

    load(id) {
      if (id === HELPERS_ID) return HELPERS; // generate proxy modules

      if (id.endsWith(EXTERNAL_SUFFIX)) {
        const actualId = getIdFromExternalProxyId(id);
        const name = getName(actualId);
        return `import ${name} from ${JSON.stringify(actualId)}; export default ${name};`;
      }

      if (id.endsWith(PROXY_SUFFIX)) {
        const actualId = getIdFromProxyId(id);
        const name = getName(actualId);
        return getIsCjsPromise(actualId).then(isCjs => {
          if (isCjs) return `import { __moduleExports } from ${JSON.stringify(actualId)}; export default __moduleExports;`;else if (esModulesWithoutDefaultExport.has(actualId)) return `import * as ${name} from ${JSON.stringify(actualId)}; export default ${name};`;else if (esModulesWithDefaultExport.has(actualId)) {
            return `export {default} from ${JSON.stringify(actualId)};`;
          }
          return `import * as ${name} from ${JSON.stringify(actualId)}; import {getCjsExportFromNamespace} from "${HELPERS_ID}"; export default getCjsExportFromNamespace(${name})`;
        });
      }

      return null;
    },

    transform(code, id) {
      if (!filter(id) || extensions.indexOf(extname(id)) === -1) {
        setIsCjsPromise(id, null);
        return null;
      }

      let transformed;

      try {
        transformed = transformAndCheckExports.call(this, code, id);
      } catch (err) {
        transformed = null;
        this.error(err, err.loc);
      }

      setIsCjsPromise(id, Boolean(transformed));
      return transformed;
    }

  };
}

function json(options) {
  if ( options === void 0 ) options = {};

  var filter = createFilter(options.include, options.exclude);
  var indent = 'indent' in options ? options.indent : '\t';

  return {
    name: 'json',

    // eslint-disable-next-line no-shadow
    transform: function transform(json, id) {
      if (id.slice(-5) !== '.json' || !filter(id)) { return null; }

      return {
        code: dataToEsm(JSON.parse(json), {
          preferConst: options.preferConst,
          compact: options.compact,
          namedExports: options.namedExports,
          indent: indent
        }),
        map: { mappings: '' }
      };
    }
  };
}

const {builtinModules} = module$1;

const blacklist$1 = [
	'sys'
];

// eslint-disable-next-line node/no-deprecated-api
var builtinModules_1 = (builtinModules || Object.keys(process.binding('natives')))
	.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) && !blacklist$1.includes(x))
	.sort();

// no idea what these regular expressions do,
// but i extracted it from https://github.com/yahoo/js-module-formats/blob/master/index.js#L18
var ES6ImportExportRegExp = /(?:^\s*|[}{\(\);,\n]\s*)(import\s+['"]|(import|module)\s+[^"'\(\)\n;]+\s+from\s+['"]|export\s+(\*|\{|default|function|var|const|let|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*))/;

var ES6AliasRegExp = /(?:^\s*|[}{\(\);,\n]\s*)(export\s*\*\s*from\s*(?:'([^']+)'|"([^"]+)"))/;

var isModule = function (sauce) {
  return ES6ImportExportRegExp.test(sauce)
    || ES6AliasRegExp.test(sauce);
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

const exists = promisify(fs$1.exists);
const readFile = promisify(fs$1.readFile);
const realpath = promisify(fs$1.realpath);
const stat = promisify(fs$1.stat);

const onError = error => {
  if (error.code === 'ENOENT') {
    return false;
  }

  throw error;
};

const makeCache = fn => {
  const cache = new Map();

  const wrapped =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (param, done) {
      if (cache.has(param) === false) {
        cache.set(param, fn(param).catch(err => {
          cache.delete(param);
          throw err;
        }));
      }

      try {
        const result = cache.get(param);
        const value = yield result;
        return done(null, value);
      } catch (error) {
        return done(error);
      }
    });

    return function wrapped(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  wrapped.clear = () => cache.clear();

  return wrapped;
};

const isDirCached = makeCache(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (file) {
    try {
      const stats = yield stat(file);
      return stats.isDirectory();
    } catch (error) {
      return onError(error);
    }
  });

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}());
const isFileCached = makeCache(
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (file) {
    try {
      const stats = yield stat(file);
      return stats.isFile();
    } catch (error) {
      return onError(error);
    }
  });

  return function (_x4) {
    return _ref3.apply(this, arguments);
  };
}());
const readCachedFile = makeCache(readFile);

const resolveId = promisify(resolve); // returns the imported package name for bare module imports

function getPackageName(id) {
  if (id.startsWith('.') || id.startsWith('/')) {
    return null;
  }

  const split = id.split('/'); // @my-scope/my-package/foo.js -> @my-scope/my-package
  // @my-scope/my-package -> @my-scope/my-package

  if (split[0][0] === '@') {
    return `${split[0]}/${split[1]}`;
  } // my-package/foo.js -> my-package
  // my-package -> my-package


  return split[0];
}
function getMainFields(options) {
  let mainFields;

  if (options.mainFields) {
    mainFields = options.mainFields;
  } else {
    mainFields = ['module', 'main'];
  }

  if (options.browser && mainFields.indexOf('browser') === -1) {
    return ['browser'].concat(mainFields);
  }

  if (!mainFields.length) {
    throw new Error('Please ensure at least one `mainFields` value is specified');
  }

  return mainFields;
}
function getPackageInfo(options) {
  const cache = options.cache,
        extensions = options.extensions,
        pkg = options.pkg,
        mainFields = options.mainFields,
        preserveSymlinks = options.preserveSymlinks,
        useBrowserOverrides = options.useBrowserOverrides;
  let pkgPath = options.pkgPath;

  if (cache.has(pkgPath)) {
    return cache.get(pkgPath);
  } // browserify/resolve doesn't realpath paths returned in its packageFilter callback


  if (!preserveSymlinks) {
    pkgPath = realpathSync(pkgPath);
  }

  const pkgRoot = dirname(pkgPath);
  const packageInfo = {
    // copy as we are about to munge the `main` field of `pkg`.
    packageJson: Object.assign({}, pkg),
    // path to package.json file
    packageJsonPath: pkgPath,
    // directory containing the package.json
    root: pkgRoot,
    // which main field was used during resolution of this module (main, module, or browser)
    resolvedMainField: 'main',
    // whether the browser map was used to resolve the entry point to this module
    browserMappedMain: false,
    // the entry point of the module with respect to the selected main field and any
    // relevant browser mappings.
    resolvedEntryPoint: ''
  };
  let overriddenMain = false;

  for (let i = 0; i < mainFields.length; i++) {
    const field = mainFields[i];

    if (typeof pkg[field] === 'string') {
      pkg.main = pkg[field];
      packageInfo.resolvedMainField = field;
      overriddenMain = true;
      break;
    }
  }

  const internalPackageInfo = {
    cachedPkg: pkg,
    hasModuleSideEffects: () => null,
    hasPackageEntry: overriddenMain !== false || mainFields.indexOf('main') !== -1,
    packageBrowserField: useBrowserOverrides && typeof pkg.browser === 'object' && Object.keys(pkg.browser).reduce((browser, key) => {
      let resolved = pkg.browser[key];

      if (resolved && resolved[0] === '.') {
        resolved = resolve$1(pkgRoot, resolved);
      }
      /* eslint-disable no-param-reassign */


      browser[key] = resolved;

      if (key[0] === '.') {
        const absoluteKey = resolve$1(pkgRoot, key);
        browser[absoluteKey] = resolved;

        if (!extname(key)) {
          extensions.reduce((subBrowser, ext) => {
            subBrowser[absoluteKey + ext] = subBrowser[key];
            return subBrowser;
          }, browser);
        }
      }

      return browser;
    }, {}),
    packageInfo
  };
  const browserMap = internalPackageInfo.packageBrowserField;

  if (useBrowserOverrides && typeof pkg.browser === 'object' && // eslint-disable-next-line no-prototype-builtins
  browserMap.hasOwnProperty(pkg.main)) {
    packageInfo.resolvedEntryPoint = browserMap[pkg.main];
    packageInfo.browserMappedMain = true;
  } else {
    // index.node is technically a valid default entrypoint as well...
    packageInfo.resolvedEntryPoint = resolve$1(pkgRoot, pkg.main || 'index.js');
    packageInfo.browserMappedMain = false;
  }

  const packageSideEffects = pkg.sideEffects;

  if (typeof packageSideEffects === 'boolean') {
    internalPackageInfo.hasModuleSideEffects = () => packageSideEffects;
  } else if (Array.isArray(packageSideEffects)) {
    internalPackageInfo.hasModuleSideEffects = createFilter(packageSideEffects, null, {
      resolve: pkgRoot
    });
  }

  cache.set(pkgPath, internalPackageInfo);
  return internalPackageInfo;
}
function normalizeInput(input) {
  if (Array.isArray(input)) {
    return input;
  } else if (typeof input === 'object') {
    return Object.values(input);
  } // otherwise it's a string


  return input;
} // Resolve module specifiers in order. Promise resolves to the first module that resolves
// successfully, or the error that resulted from the last attempted module resolution.

function resolveImportSpecifiers(importSpecifierList, resolveOptions) {
  let promise = Promise.resolve();

  for (let i = 0; i < importSpecifierList.length; i++) {
    promise = promise.then(value => {
      // if we've already resolved to something, just return it.
      if (value) {
        return value;
      }

      return resolveId(importSpecifierList[i], resolveOptions);
    });

    if (i < importSpecifierList.length - 1) {
      // swallow MODULE_NOT_FOUND errors from all but the last resolution
      promise = promise.catch(error => {
        if (error.code !== 'MODULE_NOT_FOUND') {
          throw error;
        }
      });
    }
  }

  return promise;
}

const builtins$1 = new Set(builtinModules_1);
const ES6_BROWSER_EMPTY = '\0node-resolve:empty.js';

const nullFn = () => null;

const defaults = {
  customResolveOptions: {},
  dedupe: [],
  // It's important that .mjs is listed before .js so that Rollup will interpret npm modules
  // which deploy both ESM .mjs and CommonJS .js files as ESM.
  extensions: ['.mjs', '.js', '.json', '.node'],
  resolveOnly: []
};
function nodeResolve(opts = {}) {
  const options = Object.assign({}, defaults, opts);
  const customResolveOptions = options.customResolveOptions,
        extensions = options.extensions,
        jail = options.jail;
  const warnings = [];
  const packageInfoCache = new Map();
  const idToPackageInfo = new Map();
  const mainFields = getMainFields(options);
  const useBrowserOverrides = mainFields.indexOf('browser') !== -1;
  const isPreferBuiltinsSet = options.preferBuiltins === true || options.preferBuiltins === false;
  const preferBuiltins = isPreferBuiltinsSet ? options.preferBuiltins : true;
  const rootDir = options.rootDir || process.cwd();
  let dedupe = options.dedupe;
  let rollupOptions;

  if (options.only) {
    warnings.push('node-resolve: The `only` options is deprecated, please use `resolveOnly`');
    options.resolveOnly = options.only;
  }

  if (typeof dedupe !== 'function') {
    dedupe = importee => options.dedupe.includes(importee) || options.dedupe.includes(getPackageName(importee));
  }

  const resolveOnly = options.resolveOnly.map(pattern => {
    if (pattern instanceof RegExp) {
      return pattern;
    }

    const normalized = pattern.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`^${normalized}$`);
  });
  const browserMapCache = new Map();
  let preserveSymlinks;
  return {
    name: 'node-resolve',

    buildStart(options) {
      rollupOptions = options;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = warnings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const warning = _step.value;
          this.warn(warning);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      preserveSymlinks = options.preserveSymlinks;
    },

    generateBundle() {
      readCachedFile.clear();
      isFileCached.clear();
      isDirCached.clear();
    },

    resolveId(importee, importer) {
      var _this = this;

      return _asyncToGenerator(function* () {
        if (importee === ES6_BROWSER_EMPTY) {
          return importee;
        } // ignore IDs with null character, these belong to other plugins


        if (/\0/.test(importee)) return null;
        const basedir = !importer || dedupe(importee) ? rootDir : dirname(importer); // https://github.com/defunctzombie/package-browser-field-spec

        const browser = browserMapCache.get(importer);

        if (useBrowserOverrides && browser) {
          const resolvedImportee = resolve$1(basedir, importee);

          if (browser[importee] === false || browser[resolvedImportee] === false) {
            return ES6_BROWSER_EMPTY;
          }

          const browserImportee = browser[importee] || browser[resolvedImportee] || browser[`${resolvedImportee}.js`] || browser[`${resolvedImportee}.json`];

          if (browserImportee) {
            importee = browserImportee;
          }
        }

        const parts = importee.split(/[/\\]/);
        let id = parts.shift();

        if (id[0] === '@' && parts.length > 0) {
          // scoped packages
          id += `/${parts.shift()}`;
        } else if (id[0] === '.') {
          // an import relative to the parent dir of the importer
          id = resolve$1(basedir, importee);
        }

        const input = normalizeInput(rollupOptions.input);

        if (resolveOnly.length && !resolveOnly.some(pattern => pattern.test(id))) {
          if (input.includes(id)) {
            return null;
          }

          return false;
        }

        let hasModuleSideEffects = nullFn;
        let hasPackageEntry = true;
        let packageBrowserField = false;
        let packageInfo;

        const filter = (pkg, pkgPath) => {
          const info = getPackageInfo({
            cache: packageInfoCache,
            extensions,
            pkg,
            pkgPath,
            mainFields,
            preserveSymlinks,
            useBrowserOverrides
          });
          packageInfo = info.packageInfo;
          hasModuleSideEffects = info.hasModuleSideEffects;
          hasPackageEntry = info.hasPackageEntry;
          packageBrowserField = info.packageBrowserField;
          return info.cachedPkg;
        };

        let resolveOptions = {
          basedir,
          packageFilter: filter,
          readFile: readCachedFile,
          isFile: isFileCached,
          isDirectory: isDirCached,
          extensions
        };

        if (preserveSymlinks !== undefined) {
          resolveOptions.preserveSymlinks = preserveSymlinks;
        }

        const importSpecifierList = [];

        if (importer === undefined && !importee[0].match(/^\.?\.?\//)) {
          // For module graph roots (i.e. when importer is undefined), we
          // need to handle 'path fragments` like `foo/bar` that are commonly
          // found in rollup config files. If importee doesn't look like a
          // relative or absolute path, we make it relative and attempt to
          // resolve it. If we don't find anything, we try resolving it as we
          // got it.
          importSpecifierList.push(`./${importee}`);
        }

        const importeeIsBuiltin = builtins$1.has(importee);

        if (importeeIsBuiltin && (!preferBuiltins || !isPreferBuiltinsSet)) {
          // The `resolve` library will not resolve packages with the same
          // name as a node built-in module. If we're resolving something
          // that's a builtin, and we don't prefer to find built-ins, we
          // first try to look up a local module with that name. If we don't
          // find anything, we resolve the builtin which just returns back
          // the built-in's name.
          importSpecifierList.push(`${importee}/`);
        }

        importSpecifierList.push(importee);
        resolveOptions = Object.assign(resolveOptions, customResolveOptions);

        try {
          let resolved = yield resolveImportSpecifiers(importSpecifierList, resolveOptions);

          if (resolved && packageBrowserField) {
            if (Object.prototype.hasOwnProperty.call(packageBrowserField, resolved)) {
              if (!packageBrowserField[resolved]) {
                browserMapCache.set(resolved, packageBrowserField);
                return ES6_BROWSER_EMPTY;
              }

              resolved = packageBrowserField[resolved];
            }

            browserMapCache.set(resolved, packageBrowserField);
          }

          if (hasPackageEntry && !preserveSymlinks && resolved) {
            const fileExists = yield exists(resolved);

            if (fileExists) {
              resolved = yield realpath(resolved);
            }
          }

          idToPackageInfo.set(resolved, packageInfo);

          if (hasPackageEntry) {
            if (builtins$1.has(resolved) && preferBuiltins && isPreferBuiltinsSet) {
              return null;
            } else if (importeeIsBuiltin && preferBuiltins) {
              if (!isPreferBuiltinsSet) {
                _this.warn(`preferring built-in module '${importee}' over local alternative at '${resolved}', pass 'preferBuiltins: false' to disable this behavior or 'preferBuiltins: true' to disable this warning`);
              }

              return null;
            } else if (jail && resolved.indexOf(normalize(jail.trim(sep))) !== 0) {
              return null;
            }
          }

          if (resolved && options.modulesOnly) {
            const code = yield readFile(resolved, 'utf-8');

            if (isModule(code)) {
              return {
                id: resolved,
                moduleSideEffects: hasModuleSideEffects(resolved)
              };
            }

            return null;
          }

          const result = {
            id: resolved,
            moduleSideEffects: hasModuleSideEffects(resolved)
          };
          return result;
        } catch (error) {
          return null;
        }
      })();
    },

    load(importee) {
      if (importee === ES6_BROWSER_EMPTY) {
        return 'export default {};';
      }

      return null;
    },

    getPackageInfoForId(id) {
      return idToPackageInfo.get(id);
    }

  };
}

function escape(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function ensureFunction(functionOrValue) {
  if (typeof functionOrValue === 'function') { return functionOrValue; }
  return function () { return functionOrValue; };
}

function longest(a, b) {
  return b.length - a.length;
}

function getReplacements(options) {
  if (options.values) {
    return Object.assign({}, options.values);
  }
  var values = Object.assign({}, options);
  delete values.delimiters;
  delete values.include;
  delete values.exclude;
  delete values.sourcemap;
  delete values.sourceMap;
  return values;
}

function mapToFunctions(object) {
  return Object.keys(object).reduce(function (fns, key) {
    var functions = Object.assign({}, fns);
    functions[key] = ensureFunction(object[key]);
    return functions;
  }, {});
}

function replace$1(options) {
  if ( options === void 0 ) options = {};

  var filter = createFilter(options.include, options.exclude);
  var delimiters = options.delimiters;
  var functionValues = mapToFunctions(getReplacements(options));
  var keys = Object.keys(functionValues)
    .sort(longest)
    .map(escape);
  var pattern = delimiters
    ? new RegExp(((escape(delimiters[0])) + "(" + (keys.join('|')) + ")" + (escape(delimiters[1]))), 'g')
    : new RegExp(("\\b(" + (keys.join('|')) + ")\\b"), 'g');

  return {
    name: 'replace',

    renderChunk: function renderChunk(code, chunk) {
      var id = chunk.fileName;
      if (!keys.length) { return null; }
      if (!filter(id)) { return null; }
      return executeReplacement(code, id);
    },

    transform: function transform(code, id) {
      if (!keys.length) { return null; }
      if (!filter(id)) { return null; }
      return executeReplacement(code, id);
    }
  };

  function executeReplacement(code, id) {
    var magicString = new MagicString(code);
    if (!codeHasReplacements(code, id, magicString)) {
      return null;
    }

    var result = { code: magicString.toString() };
    if (isSourceMapEnabled()) {
      result.map = magicString.generateMap({ hires: true });
    }
    return result;
  }

  function codeHasReplacements(code, id, magicString) {
    var result = false;
    var match;

    // eslint-disable-next-line no-cond-assign
    while ((match = pattern.exec(code))) {
      result = true;

      var start = match.index;
      var end = start + match[0].length;
      var replacement = String(functionValues[match[1]](id));
      magicString.overwrite(start, end, replacement);
    }
    return result;
  }

  function isSourceMapEnabled() {
    return options.sourceMap !== false && options.sourcemap !== false;
  }
}

export { commonjs as rollupCommonjsPlugin, json as rollupJsonPlugin, nodeResolve as rollupNodeResolvePlugin, index as rollupPluginUtils, replace$1 as rollupReplacePlugin };
