import { isString } from './helpers';
export const buildError = (diagnostics) => {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Build Error',
        messageText: 'build error',
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (diagnostics) {
        diagnostics.push(diagnostic);
    }
    return diagnostic;
};
export const buildWarn = (diagnostics) => {
    const diagnostic = {
        level: 'warn',
        type: 'build',
        header: 'Build Warn',
        messageText: 'build warn',
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    diagnostics.push(diagnostic);
    return diagnostic;
};
export const buildJsonFileError = (compilerCtx, diagnostics, jsonFilePath, msg, pkgKey) => {
    const err = buildError(diagnostics);
    err.messageText = msg;
    err.absFilePath = jsonFilePath;
    if (typeof pkgKey === 'string') {
        try {
            const jsonStr = compilerCtx.fs.readFileSync(jsonFilePath);
            const lines = jsonStr.replace(/\r/g, '\n').split('\n');
            for (let i = 0; i < lines.length; i++) {
                const txtLine = lines[i];
                const txtIndex = txtLine.indexOf(pkgKey);
                if (txtIndex > -1) {
                    const warnLine = {
                        lineIndex: i,
                        lineNumber: i + 1,
                        text: txtLine,
                        errorCharStart: txtIndex,
                        errorLength: pkgKey.length,
                    };
                    err.lineNumber = warnLine.lineNumber;
                    err.columnNumber = txtIndex + 1;
                    err.lines.push(warnLine);
                    if (i >= 0) {
                        const beforeWarnLine = {
                            lineIndex: warnLine.lineIndex - 1,
                            lineNumber: warnLine.lineNumber - 1,
                            text: lines[i - 1],
                            errorCharStart: -1,
                            errorLength: -1,
                        };
                        err.lines.unshift(beforeWarnLine);
                    }
                    if (i < lines.length) {
                        const afterWarnLine = {
                            lineIndex: warnLine.lineIndex + 1,
                            lineNumber: warnLine.lineNumber + 1,
                            text: lines[i + 1],
                            errorCharStart: -1,
                            errorLength: -1,
                        };
                        err.lines.push(afterWarnLine);
                    }
                    break;
                }
            }
        }
        catch (e) { }
    }
    return err;
};
export const catchError = (diagnostics, err, msg) => {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Build Error',
        messageText: 'build error',
        relFilePath: null,
        absFilePath: null,
        lines: [],
    };
    if (isString(msg)) {
        diagnostic.messageText = msg;
    }
    else if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else {
            if (err.message != null) {
                diagnostic.messageText = err.message.toString();
            }
            else {
                diagnostic.messageText = err.toString();
            }
        }
    }
    if (diagnostics != null && !shouldIgnoreError(diagnostic.messageText)) {
        diagnostics.push(diagnostic);
    }
    return diagnostic;
};
export const hasError = (diagnostics) => {
    if (diagnostics == null || diagnostics.length === 0) {
        return false;
    }
    return diagnostics.some(d => d.level === 'error' && d.type !== 'runtime');
};
export const hasWarning = (diagnostics) => {
    if (diagnostics == null || diagnostics.length === 0) {
        return false;
    }
    return diagnostics.some(d => d.level === 'warn');
};
export const shouldIgnoreError = (msg) => {
    return msg === TASK_CANCELED_MSG;
};
export const TASK_CANCELED_MSG = `task canceled`;
