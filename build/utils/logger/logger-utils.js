export const normalizeDiagnostics = (compilerCtx, diagnostics) => {
    const normalizedErrors = [];
    const normalizedOthers = [];
    const dups = new Set();
    for (let i = 0; i < diagnostics.length; i++) {
        const d = normalizeDiagnostic(compilerCtx, diagnostics[i]);
        const key = d.absFilePath + d.code + d.messageText + d.type;
        if (dups.has(key)) {
            continue;
        }
        dups.add(key);
        const total = normalizedErrors.length + normalizedOthers.length;
        if (d.level === 'error') {
            normalizedErrors.push(d);
        }
        else if (total < MAX_ERRORS) {
            normalizedOthers.push(d);
        }
    }
    return [...normalizedErrors, ...normalizedOthers];
};
const normalizeDiagnostic = (compilerCtx, diagnostic) => {
    if (diagnostic.messageText) {
        if (typeof diagnostic.messageText.message === 'string') {
            diagnostic.messageText = diagnostic.messageText.message;
        }
        else if (typeof diagnostic.messageText === 'string' && diagnostic.messageText.indexOf('Error: ') === 0) {
            diagnostic.messageText = diagnostic.messageText.substr(7);
        }
    }
    if (diagnostic.messageText) {
        if (diagnostic.messageText.includes(`Cannot find name 'h'`)) {
            diagnostic.header = `Missing "h" import for JSX types`;
            diagnostic.messageText = `In order to load accurate JSX types for components, the "h" function must be imported from "@stencil/core" by each component using JSX. For example: import { Component, h } from '@stencil/core';`;
            try {
                const sourceText = compilerCtx.fs.readFileSync(diagnostic.absFilePath);
                const srcLines = splitLineBreaks(sourceText);
                for (let i = 0; i < srcLines.length; i++) {
                    const srcLine = srcLines[i];
                    if (srcLine.includes('@stencil/core')) {
                        const msgLines = [];
                        const beforeLineIndex = i - 1;
                        if (beforeLineIndex > -1) {
                            const beforeLine = {
                                lineIndex: beforeLineIndex,
                                lineNumber: beforeLineIndex + 1,
                                text: srcLines[beforeLineIndex],
                                errorCharStart: -1,
                                errorLength: -1,
                            };
                            msgLines.push(beforeLine);
                        }
                        const errorLine = {
                            lineIndex: i,
                            lineNumber: i + 1,
                            text: srcLine,
                            errorCharStart: 0,
                            errorLength: -1,
                        };
                        msgLines.push(errorLine);
                        diagnostic.lineNumber = errorLine.lineNumber;
                        diagnostic.columnNumber = srcLine.indexOf('}');
                        const afterLineIndex = i + 1;
                        if (afterLineIndex < srcLines.length) {
                            const afterLine = {
                                lineIndex: afterLineIndex,
                                lineNumber: afterLineIndex + 1,
                                text: srcLines[afterLineIndex],
                                errorCharStart: -1,
                                errorLength: -1,
                            };
                            msgLines.push(afterLine);
                        }
                        diagnostic.lines = msgLines;
                        break;
                    }
                }
            }
            catch (e) { }
        }
    }
    return diagnostic;
};
export const splitLineBreaks = (sourceText) => {
    if (typeof sourceText !== 'string')
        return [];
    sourceText = sourceText.replace(/\\r/g, '\n');
    return sourceText.split('\n');
};
export const escapeHtml = (unsafe) => {
    if (unsafe === undefined)
        return 'undefined';
    if (unsafe === null)
        return 'null';
    if (typeof unsafe !== 'string') {
        unsafe = unsafe.toString();
    }
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
export const MAX_ERRORS = 25;
