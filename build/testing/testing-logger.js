export class TestingLogger {
    constructor() {
        this.colors = false;
        this.enable = false;
        this.buildLogFilePath = null;
    }
    info(...msg) {
        if (this.enable) {
            console.log.apply(console, msg);
        }
    }
    warn(...msg) {
        if (this.enable) {
            console.warn.apply(console, msg);
        }
    }
    error(...msg) {
        if (this.enable) {
            console.error.apply(console, msg);
        }
    }
    debug(...msg) {
        if (this.enable) {
            console.log.apply(console, msg);
        }
    }
    color(_msg, _color) {
        /* */
    }
    red(msg) {
        return msg;
    }
    green(msg) {
        return msg;
    }
    yellow(msg) {
        return msg;
    }
    blue(msg) {
        return msg;
    }
    magenta(msg) {
        return msg;
    }
    cyan(msg) {
        return msg;
    }
    gray(msg) {
        return msg;
    }
    bold(msg) {
        return msg;
    }
    dim(msg) {
        return msg;
    }
    bgRed(msg) {
        return msg;
    }
    createTimeSpan(_startMsg, _debug = false) {
        return {
            duration() {
                return 0;
            },
            finish() {
                return 0;
            },
        };
    }
    printDiagnostics(_diagnostics) {
        /* */
    }
    writeLogs(_) {
        /**/
    }
}
