import appErrorCss from './app-error.css';
export const appError = (data) => {
    const results = {
        diagnostics: [],
        status: null,
    };
    if (data && data.window && Array.isArray(data.buildResults.diagnostics)) {
        const diagnostics = data.buildResults.diagnostics.filter(diagnostic => diagnostic.level === 'error');
        if (diagnostics.length > 0) {
            const modal = getDevServerModal(data.window.document);
            diagnostics.forEach((diagnostic) => {
                results.diagnostics.push(diagnostic);
                appendDiagnostic(data.window.document, data.openInEditor, modal, diagnostic);
            });
            results.status = 'error';
        }
    }
    return results;
};
const appendDiagnostic = (doc, openInEditor, modal, diagnostic) => {
    const card = doc.createElement('div');
    card.className = 'dev-server-diagnostic';
    const masthead = doc.createElement('div');
    masthead.className = 'dev-server-diagnostic-masthead';
    masthead.title = `${escapeHtml(diagnostic.type)} error: ${escapeHtml(diagnostic.code)}`;
    card.appendChild(masthead);
    const title = doc.createElement('div');
    title.className = 'dev-server-diagnostic-title';
    if (typeof diagnostic.header === 'string' && diagnostic.header.trim().length > 0) {
        title.textContent = diagnostic.header;
    }
    else {
        title.textContent = `${titleCase(diagnostic.type)} ${titleCase(diagnostic.level)}`;
    }
    masthead.appendChild(title);
    const message = doc.createElement('div');
    message.className = 'dev-server-diagnostic-message';
    message.textContent = diagnostic.messageText;
    masthead.appendChild(message);
    const file = doc.createElement('div');
    file.className = 'dev-server-diagnostic-file';
    card.appendChild(file);
    const canOpenInEditor = typeof openInEditor === 'function' && typeof diagnostic.absFilePath === 'string';
    if (diagnostic.relFilePath) {
        const fileHeader = doc.createElement(canOpenInEditor ? 'a' : 'div');
        fileHeader.className = 'dev-server-diagnostic-file-header';
        if (diagnostic.absFilePath) {
            fileHeader.title = escapeHtml(diagnostic.absFilePath);
            if (canOpenInEditor) {
                addOpenInEditor(openInEditor, fileHeader, diagnostic.absFilePath, diagnostic.lineNumber, diagnostic.columnNumber);
            }
        }
        const parts = diagnostic.relFilePath.split('/');
        const fileName = doc.createElement('span');
        fileName.className = 'dev-server-diagnostic-file-name';
        fileName.textContent = parts.pop();
        const filePath = doc.createElement('span');
        filePath.className = 'dev-server-diagnostic-file-path';
        filePath.textContent = parts.join('/') + '/';
        fileHeader.appendChild(filePath);
        fileHeader.appendChild(fileName);
        file.appendChild(fileHeader);
    }
    if (diagnostic.lines && diagnostic.lines.length > 0) {
        const blob = doc.createElement('div');
        blob.className = 'dev-server-diagnostic-blob';
        file.appendChild(blob);
        const table = doc.createElement('table');
        table.className = 'dev-server-diagnostic-table';
        blob.appendChild(table);
        prepareLines(diagnostic.lines).forEach(l => {
            const tr = doc.createElement('tr');
            if (l.errorCharStart > 0) {
                tr.classList.add('dev-server-diagnostic-error-line');
            }
            if (canOpenInEditor) {
                tr.classList.add('dev-server-diagnostic-open-in-editor');
            }
            table.appendChild(tr);
            const tdNum = doc.createElement('td');
            tdNum.className = 'dev-server-diagnostic-blob-num';
            if (l.lineNumber > 0) {
                tdNum.setAttribute('data-line-number', l.lineNumber + '');
                tdNum.title = escapeHtml(diagnostic.relFilePath) + ', line ' + l.lineNumber;
                if (canOpenInEditor) {
                    const column = l.lineNumber === diagnostic.lineNumber ? diagnostic.columnNumber : 1;
                    addOpenInEditor(openInEditor, tdNum, diagnostic.absFilePath, l.lineNumber, column);
                }
            }
            tr.appendChild(tdNum);
            const tdCode = doc.createElement('td');
            tdCode.className = 'dev-server-diagnostic-blob-code';
            tdCode.innerHTML = highlightError(l.text, l.errorCharStart, l.errorLength);
            tr.appendChild(tdCode);
        });
    }
    modal.appendChild(card);
};
const addOpenInEditor = (openInEditor, elm, file, line, column) => {
    if (elm.tagName === 'A') {
        elm.href = '#open-in-editor';
    }
    if (typeof line !== 'number' || line < 1) {
        line = 1;
    }
    if (typeof column !== 'number' || column < 1) {
        column = 1;
    }
    elm.addEventListener('click', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        openInEditor({
            file: file,
            line: line,
            column: column,
        });
    });
};
const getDevServerModal = (doc) => {
    let outer = doc.getElementById(DEV_SERVER_MODAL);
    if (!outer) {
        outer = doc.createElement('div');
        outer.id = DEV_SERVER_MODAL;
        outer.setAttribute('role', 'dialog');
        doc.body.appendChild(outer);
    }
    outer.innerHTML = `<style>${appErrorCss}</style><div id="${DEV_SERVER_MODAL}-inner"></div>`;
    return doc.getElementById(`${DEV_SERVER_MODAL}-inner`);
};
export const clearAppErrorModal = (data) => {
    const appErrorElm = data.window.document.getElementById(DEV_SERVER_MODAL);
    if (appErrorElm) {
        appErrorElm.parentNode.removeChild(appErrorElm);
    }
};
const escapeHtml = (unsafe) => {
    if (typeof unsafe === 'number' || typeof unsafe === 'boolean') {
        return unsafe.toString();
    }
    if (typeof unsafe === 'string') {
        return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }
    return '';
};
const titleCase = (str) => str.charAt(0).toUpperCase() + str.substr(1);
const highlightError = (text, errorCharStart, errorLength) => {
    if (typeof text !== 'string') {
        return '';
    }
    const errorCharEnd = errorCharStart + errorLength;
    return text
        .split('')
        .map((inputChar, charIndex) => {
        let outputChar;
        if (inputChar === `<`) {
            outputChar = `&lt;`;
        }
        else if (inputChar === `>`) {
            outputChar = `&gt;`;
        }
        else if (inputChar === `"`) {
            outputChar = `&quot;`;
        }
        else if (inputChar === `'`) {
            outputChar = `&#039;`;
        }
        else if (inputChar === `&`) {
            outputChar = `&amp;`;
        }
        else {
            outputChar = inputChar;
        }
        if (charIndex >= errorCharStart && charIndex < errorCharEnd) {
            outputChar = `<span class="dev-server-diagnostic-error-chr">${outputChar}</span>`;
        }
        return outputChar;
    })
        .join('');
};
const prepareLines = (orgLines) => {
    const lines = JSON.parse(JSON.stringify(orgLines));
    for (let i = 0; i < 100; i++) {
        if (!eachLineHasLeadingWhitespace(lines)) {
            return lines;
        }
        for (let i = 0; i < lines.length; i++) {
            lines[i].text = lines[i].text.substr(1);
            lines[i].errorCharStart--;
            if (!lines[i].text.length) {
                return lines;
            }
        }
    }
    return lines;
};
const eachLineHasLeadingWhitespace = (lines) => {
    if (!lines.length) {
        return false;
    }
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].text || lines[i].text.length < 1) {
            return false;
        }
        const firstChar = lines[i].text.charAt(0);
        if (firstChar !== ' ' && firstChar !== '\t') {
            return false;
        }
    }
    return true;
};
const DEV_SERVER_MODAL = `dev-server-modal`;
