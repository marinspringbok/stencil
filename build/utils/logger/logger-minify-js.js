import { splitLineBreaks } from './logger-utils';
export function loadMinifyJsDiagnostics(sourceText, result, diagnostics) {
    if (!result || !result.error) {
        return;
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
    if (typeof result.error.line === 'number' && result.error.line > -1) {
        const srcLines = splitLineBreaks(sourceText);
        const errorLine = {
            lineIndex: result.error.line - 1,
            lineNumber: result.error.line,
            text: srcLines[result.error.line - 1],
            errorCharStart: result.error.col,
            errorLength: 0,
        };
        d.lineNumber = errorLine.lineNumber;
        d.columnNumber = errorLine.errorCharStart;
        const highlightLine = errorLine.text.substr(d.columnNumber);
        for (let i = 0; i < highlightLine.length; i++) {
            if (CHAR_BREAK.includes(highlightLine.charAt(i))) {
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
}
const CHAR_BREAK = [' ', '=', '.', ',', '?', ':', ';', '(', ')', '{', '}', '[', ']', '|', `'`, `"`, '`'];
