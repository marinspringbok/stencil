!function(t,n){for(var e in n)t[e]=n[e]}(exports,function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=0)}([function(t,n,e){t.exports=e(1)},function(t,n,e){var r,o,c=e(2),i=e(3),u=e(5),f=e(7),s=e(8);"function"==typeof Symbol&&"function"==typeof Symbol.for?(r=Symbol.for("graceful-fs.queue"),o=Symbol.for("graceful-fs.previous")):(r="___graceful-fs.queue",o="___graceful-fs.previous");var a=function(){};if(s.debuglog?a=s.debuglog("gfs4"):/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&(a=function(){var t=s.format.apply(s,arguments);t="GFS4: "+t.split(/\n/).join("\nGFS4: "),console.error(t)}),!global[r]){var l=[];Object.defineProperty(global,r,{get:function(){return l}}),c.close=function(t){function n(n,e){return t.call(c,n,(function(t){t||d(),"function"==typeof e&&e.apply(this,arguments)}))}return Object.defineProperty(n,o,{value:t}),n}(c.close),c.closeSync=function(t){function n(n){t.apply(c,arguments),d()}return Object.defineProperty(n,o,{value:t}),n}(c.closeSync),/\bgfs4\b/i.test(process.env.NODE_DEBUG||"")&&process.on("exit",(function(){a(global[r]),e(9).equal(global[r].length,0)}))}function p(t){i(t),t.gracefulify=p,t.createReadStream=function(n,e){return new t.ReadStream(n,e)},t.createWriteStream=function(n,e){return new t.WriteStream(n,e)};var n=t.readFile;t.readFile=function(t,e,r){"function"==typeof e&&(r=e,e=null);return function t(e,r,o){return n(e,r,(function(n){!n||"EMFILE"!==n.code&&"ENFILE"!==n.code?("function"==typeof o&&o.apply(this,arguments),d()):h([t,[e,r,o]])}))}(t,e,r)};var e=t.writeFile;t.writeFile=function(t,n,r,o){"function"==typeof r&&(o=r,r=null);return function t(n,r,o,c){return e(n,r,o,(function(e){!e||"EMFILE"!==e.code&&"ENFILE"!==e.code?("function"==typeof c&&c.apply(this,arguments),d()):h([t,[n,r,o,c]])}))}(t,n,r,o)};var r=t.appendFile;r&&(t.appendFile=function(t,n,e,o){"function"==typeof e&&(o=e,e=null);return function t(n,e,o,c){return r(n,e,o,(function(r){!r||"EMFILE"!==r.code&&"ENFILE"!==r.code?("function"==typeof c&&c.apply(this,arguments),d()):h([t,[n,e,o,c]])}))}(t,n,e,o)});var o=t.readdir;function c(n){return o.apply(t,n)}if(t.readdir=function(t,n,e){var r=[t];"function"!=typeof n?r.push(n):e=n;return r.push((function(t,n){n&&n.sort&&n.sort();!t||"EMFILE"!==t.code&&"ENFILE"!==t.code?("function"==typeof e&&e.apply(this,arguments),d()):h([c,[r]])})),c(r)},"v0.8"===process.version.substr(0,4)){var f=u(t);m=f.ReadStream,b=f.WriteStream}var s=t.ReadStream;s&&(m.prototype=Object.create(s.prototype),m.prototype.open=function(){var t=this;v(t.path,t.flags,t.mode,(function(n,e){n?(t.autoClose&&t.destroy(),t.emit("error",n)):(t.fd=e,t.emit("open",e),t.read())}))});var a=t.WriteStream;a&&(b.prototype=Object.create(a.prototype),b.prototype.open=function(){var t=this;v(t.path,t.flags,t.mode,(function(n,e){n?(t.destroy(),t.emit("error",n)):(t.fd=e,t.emit("open",e))}))}),Object.defineProperty(t,"ReadStream",{get:function(){return m},set:function(t){m=t},enumerable:!0,configurable:!0}),Object.defineProperty(t,"WriteStream",{get:function(){return b},set:function(t){b=t},enumerable:!0,configurable:!0});var l=m;Object.defineProperty(t,"FileReadStream",{get:function(){return l},set:function(t){l=t},enumerable:!0,configurable:!0});var y=b;function m(t,n){return this instanceof m?(s.apply(this,arguments),this):m.apply(Object.create(m.prototype),arguments)}function b(t,n){return this instanceof b?(a.apply(this,arguments),this):b.apply(Object.create(b.prototype),arguments)}Object.defineProperty(t,"FileWriteStream",{get:function(){return y},set:function(t){y=t},enumerable:!0,configurable:!0});var S=t.open;function v(t,n,e,r){return"function"==typeof e&&(r=e,e=null),function t(n,e,r,o){return S(n,e,r,(function(c,i){!c||"EMFILE"!==c.code&&"ENFILE"!==c.code?("function"==typeof o&&o.apply(this,arguments),d()):h([t,[n,e,r,o]])}))}(t,n,e,r)}return t.open=v,t}function h(t){a("ENQUEUE",t[0].name,t[1]),global[r].push(t)}function d(){var t=global[r].shift();t&&(a("RETRY",t[0].name,t[1]),t[0].apply(null,t[1]))}t.exports=p(f(c)),process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&!c.__patched&&(t.exports=p(c),c.__patched=!0)},function(t,n){t.exports=require("fs")},function(t,n,e){var r=e(4),o=process.cwd,c=null,i=process.env.GRACEFUL_FS_PLATFORM||process.platform;process.cwd=function(){return c||(c=o.call(process)),c};try{process.cwd()}catch(t){}var u=process.chdir;process.chdir=function(t){c=null,u.call(process,t)},t.exports=function(t){r.hasOwnProperty("O_SYMLINK")&&process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&function(t){t.lchmod=function(n,e,o){t.open(n,r.O_WRONLY|r.O_SYMLINK,e,(function(n,r){n?o&&o(n):t.fchmod(r,e,(function(n){t.close(r,(function(t){o&&o(n||t)}))}))}))},t.lchmodSync=function(n,e){var o,c=t.openSync(n,r.O_WRONLY|r.O_SYMLINK,e),i=!0;try{o=t.fchmodSync(c,e),i=!1}finally{if(i)try{t.closeSync(c)}catch(t){}else t.closeSync(c)}return o}}(t);t.lutimes||function(t){r.hasOwnProperty("O_SYMLINK")?(t.lutimes=function(n,e,o,c){t.open(n,r.O_SYMLINK,(function(n,r){n?c&&c(n):t.futimes(r,e,o,(function(n){t.close(r,(function(t){c&&c(n||t)}))}))}))},t.lutimesSync=function(n,e,o){var c,i=t.openSync(n,r.O_SYMLINK),u=!0;try{c=t.futimesSync(i,e,o),u=!1}finally{if(u)try{t.closeSync(i)}catch(t){}else t.closeSync(i)}return c}):(t.lutimes=function(t,n,e,r){r&&process.nextTick(r)},t.lutimesSync=function(){})}(t);t.chown=c(t.chown),t.fchown=c(t.fchown),t.lchown=c(t.lchown),t.chmod=e(t.chmod),t.fchmod=e(t.fchmod),t.lchmod=e(t.lchmod),t.chownSync=u(t.chownSync),t.fchownSync=u(t.fchownSync),t.lchownSync=u(t.lchownSync),t.chmodSync=o(t.chmodSync),t.fchmodSync=o(t.fchmodSync),t.lchmodSync=o(t.lchmodSync),t.stat=f(t.stat),t.fstat=f(t.fstat),t.lstat=f(t.lstat),t.statSync=s(t.statSync),t.fstatSync=s(t.fstatSync),t.lstatSync=s(t.lstatSync),t.lchmod||(t.lchmod=function(t,n,e){e&&process.nextTick(e)},t.lchmodSync=function(){});t.lchown||(t.lchown=function(t,n,e,r){r&&process.nextTick(r)},t.lchownSync=function(){});"win32"===i&&(t.rename=(n=t.rename,function(e,r,o){var c=Date.now(),i=0;n(e,r,(function u(f){if(f&&("EACCES"===f.code||"EPERM"===f.code)&&Date.now()-c<6e4)return setTimeout((function(){t.stat(r,(function(t,c){t&&"ENOENT"===t.code?n(e,r,u):o(f)}))}),i),void(i<100&&(i+=10));o&&o(f)}))}));var n;function e(n){return n?function(e,r,o){return n.call(t,e,r,(function(t){a(t)&&(t=null),o&&o.apply(this,arguments)}))}:n}function o(n){return n?function(e,r){try{return n.call(t,e,r)}catch(t){if(!a(t))throw t}}:n}function c(n){return n?function(e,r,o,c){return n.call(t,e,r,o,(function(t){a(t)&&(t=null),c&&c.apply(this,arguments)}))}:n}function u(n){return n?function(e,r,o){try{return n.call(t,e,r,o)}catch(t){if(!a(t))throw t}}:n}function f(n){return n?function(e,r,o){function c(t,n){n&&(n.uid<0&&(n.uid+=4294967296),n.gid<0&&(n.gid+=4294967296)),o&&o.apply(this,arguments)}return"function"==typeof r&&(o=r,r=null),r?n.call(t,e,r,c):n.call(t,e,c)}:n}function s(n){return n?function(e,r){var o=r?n.call(t,e,r):n.call(t,e);return o.uid<0&&(o.uid+=4294967296),o.gid<0&&(o.gid+=4294967296),o}:n}function a(t){return!t||("ENOSYS"===t.code||!(process.getuid&&0===process.getuid()||"EINVAL"!==t.code&&"EPERM"!==t.code))}t.read=function(n){function e(e,r,o,c,i,u){var f;if(u&&"function"==typeof u){var s=0;f=function(a,l,p){if(a&&"EAGAIN"===a.code&&s<10)return s++,n.call(t,e,r,o,c,i,f);u.apply(this,arguments)}}return n.call(t,e,r,o,c,i,f)}return e.__proto__=n,e}(t.read),t.readSync=(l=t.readSync,function(n,e,r,o,c){for(var i=0;;)try{return l.call(t,n,e,r,o,c)}catch(t){if("EAGAIN"===t.code&&i<10){i++;continue}throw t}});var l}},function(t,n){t.exports=require("constants")},function(t,n,e){var r=e(6).Stream;t.exports=function(t){return{ReadStream:function n(e,o){if(!(this instanceof n))return new n(e,o);r.call(this);var c=this;this.path=e,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=65536,o=o||{};for(var i=Object.keys(o),u=0,f=i.length;u<f;u++){var s=i[u];this[s]=o[s]}this.encoding&&this.setEncoding(this.encoding);if(void 0!==this.start){if("number"!=typeof this.start)throw TypeError("start must be a Number");if(void 0===this.end)this.end=1/0;else if("number"!=typeof this.end)throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}if(null!==this.fd)return void process.nextTick((function(){c._read()}));t.open(this.path,this.flags,this.mode,(function(t,n){if(t)return c.emit("error",t),void(c.readable=!1);c.fd=n,c.emit("open",n),c._read()}))},WriteStream:function n(e,o){if(!(this instanceof n))return new n(e,o);r.call(this),this.path=e,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,o=o||{};for(var c=Object.keys(o),i=0,u=c.length;i<u;i++){var f=c[i];this[f]=o[f]}if(void 0!==this.start){if("number"!=typeof this.start)throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],null===this.fd&&(this._open=t.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}}}},function(t,n){t.exports=require("stream")},function(t,n,e){"use strict";t.exports=function(t){if(null===t||"object"!=typeof t)return t;if(t instanceof Object)var n={__proto__:t.__proto__};else n=Object.create(null);return Object.getOwnPropertyNames(t).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))})),n}},function(t,n){t.exports=require("util")},function(t,n){t.exports=require("assert")}]));