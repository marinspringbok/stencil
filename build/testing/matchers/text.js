export function toEqualText(input, expectTextContent) {
    if (input == null) {
        throw new Error(`expect toEqualText() value is "${input}"`);
    }
    if (typeof input.then === 'function') {
        throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
    }
    let textContent;
    if (input.nodeType === 1 /* ELEMENT_NODE */) {
        textContent = input.textContent.replace(/\s\s+/g, ' ').trim();
    }
    else if (input != null) {
        textContent = String(input)
            .replace(/\s\s+/g, ' ')
            .trim();
    }
    if (typeof expectTextContent === 'string') {
        expectTextContent = expectTextContent.replace(/\s\s+/g, ' ').trim();
    }
    const pass = textContent === expectTextContent;
    return {
        message: () => `expected textContent "${expectTextContent}" to ${pass ? 'not ' : ''}equal "${textContent}"`,
        pass: pass,
    };
}
