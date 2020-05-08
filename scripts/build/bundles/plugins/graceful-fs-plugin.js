"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function gracefulFsPlugin() {
    return {
        name: 'gracefulFsPlugin',
        resolveId(id) {
            if (id === 'graceful-fs') {
                return {
                    id: '../sys/node/graceful-fs.js',
                    external: true,
                };
            }
            return null;
        },
    };
}
exports.gracefulFsPlugin = gracefulFsPlugin;
