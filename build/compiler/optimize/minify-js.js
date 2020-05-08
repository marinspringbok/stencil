import { splitLineBreaks } from '@utils';
import terser from 'terser';
export const minifyJs = async (input, opts) => {
    if (opts) {
        const mangle = opts.mangle;
        if (mangle) {
            const mangleProperties = mangle.properties;
            if (mangleProperties && mangleProperties.regex) {
                mangleProperties.regex = new RegExp(mangleProperties.regex);
            }
        }
    }
    const result = terser.minify(input, opts);
    const diagnostics = loadMinifyJsDiagnostics(input, result);
    if (diagnostics.length === 0) {
        const compress = opts.compress;
        if (compress && compress.module && result.code.endsWith('};')) {
            result.code = result.code.substring(0, result.code.length - 1);
        }
    }
    return {
        output: result.code,
        sourceMap: result.map,
        diagnostics: diagnostics,
    };
};
const loadMinifyJsDiagnostics = (sourceText, result) => {
    const diagnostics = [];
    if (!result || !result.error) {
        return diagnostics;
    }
    const d = {
        level: 'error',
        type: 'build',
        language: 'javascript',
        header: 'Minify JS',
        code: '',
        messageText: result.error.message,
        absFilePath: null,
        relFilePath: null,
        lines: [],
    };
    const err = result.error;
    if (typeof err.line === 'number' && err.line > -1) {
        const srcLines = splitLineBreaks(sourceText);
        const errorLine = {
            lineIndex: err.line - 1,
            lineNumber: err.line,
            text: srcLines[err.line - 1],
            errorCharStart: err.col,
            errorLength: 0,
        };
        d.lineNumber = errorLine.lineNumber;
        d.columnNumber = errorLine.errorCharStart;
        const highlightLine = errorLine.text.substr(d.columnNumber);
        for (let i = 0; i < highlightLine.length; i++) {
            if (CHAR_BREAK.has(highlightLine.charAt(i))) {
                break;
            }
            errorLine.errorLength++;
        }
        d.lines.push(errorLine);
        if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
            errorLine.errorLength = 1;
            errorLine.errorCharStart--;
        }
        if (errorLine.lineIndex > 0) {
            const previousLine = {
                lineIndex: errorLine.lineIndex - 1,
                lineNumber: errorLine.lineNumber - 1,
                text: srcLines[errorLine.lineIndex - 1],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.unshift(previousLine);
        }
        if (errorLine.lineIndex + 1 < srcLines.length) {
            const nextLine = {
                lineIndex: errorLine.lineIndex + 1,
                lineNumber: errorLine.lineNumber + 1,
                text: srcLines[errorLine.lineIndex + 1],
                errorCharStart: -1,
                errorLength: -1,
            };
            d.lines.push(nextLine);
        }
    }
    diagnostics.push(d);
    return diagnostics;
};
const CHAR_BREAK = new Set([' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`']);
